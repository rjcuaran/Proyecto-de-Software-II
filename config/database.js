const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'organizador_recetas'
};

// Crear pool de conexiones
const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Función para inicializar la base de datos
async function initializeDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password
    });

    // Crear base de datos si no existe
    await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\``);
    console.log('✅ Base de datos verificada/creada');

    await connection.end();

    // Ejecutar script de tablas
    await createTables();
    
  } catch (error) {
    console.error('❌ Error inicializando la base de datos:', error);
    process.exit(1);
  }
}

async function createTables() {
  try {
    const tables = [
      `CREATE TABLE IF NOT EXISTS Usuario (
        id_usuario INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        correo VARCHAR(150) UNIQUE NOT NULL,
        contraseña VARCHAR(255) NOT NULL,
        fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,

      `CREATE TABLE IF NOT EXISTS Receta (
        id_receta INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(200) NOT NULL,
        categoria VARCHAR(100),
        descripcion TEXT,
        preparacion TEXT,
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        id_usuario INT NOT NULL,
        FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario) ON DELETE CASCADE
      )`,

      `CREATE TABLE IF NOT EXISTS Ingrediente (
        id_ingrediente INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(150) NOT NULL,
        cantidad DECIMAL(8,2),
        unidad_medida VARCHAR(50),
        id_receta INT NOT NULL,
        FOREIGN KEY (id_receta) REFERENCES Receta(id_receta) ON DELETE CASCADE
      )`,

      `CREATE TABLE IF NOT EXISTS Favorito (
        id_favorito INT AUTO_INCREMENT PRIMARY KEY,
        id_usuario INT NOT NULL,
        id_receta INT NOT NULL,
        fecha_agregado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario) ON DELETE CASCADE,
        FOREIGN KEY (id_receta) REFERENCES Receta(id_receta) ON DELETE CASCADE,
        UNIQUE KEY unique_favorito (id_usuario, id_receta)
      )`
    ];

    for (const tableSql of tables) {
      await pool.execute(tableSql);
    }

    console.log('✅ Tablas creadas/verificadas correctamente');
    
  } catch (error) {
    console.error('❌ Error creando tablas:', error);
    throw error;
  }
}

module.exports = { pool, initializeDatabase };