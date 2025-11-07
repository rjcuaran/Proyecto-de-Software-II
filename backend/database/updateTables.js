require('dotenv').config();
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'organizador_recetas'
});

console.log('🔄 Actualizando estructura de la tabla Recetas...');

connection.connect((err) => {
  if (err) {
    console.error('❌ Error conectando a MySQL:', err);
    process.exit(1);
  }
  
  console.log('✅ Conectado a MySQL - Procediendo con actualizaciones...');
  
  // Función para verificar si una columna existe
  function columnExists(tableName, columnName, callback) {
    const checkQuery = `
      SELECT COUNT(*) as exists_flag 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? 
      AND TABLE_NAME = ? 
      AND COLUMN_NAME = ?
    `;
    
    connection.execute(checkQuery, [process.env.DB_NAME, tableName, columnName], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0].exists_flag > 0);
    });
  }
  
  // Función para agregar columna si no existe
  function addColumnIfNotExists(tableName, columnName, columnDefinition, callback) {
    columnExists(tableName, columnName, (err, exists) => {
      if (err) return callback(err);
      
      if (exists) {
        console.log(`✅ Columna "${columnName}" ya existe en ${tableName}`);
        callback(null);
      } else {
        const addQuery = `ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${columnDefinition}`;
        connection.execute(addQuery, (err, results) => {
          if (err) return callback(err);
          console.log(`✅ Columna "${columnName}" agregada a ${tableName}`);
          callback(null);
        });
      }
    });
  }
  
  // Agregar columnas necesarias
  const columnsToAdd = [
    { table: 'Recetas', name: 'instrucciones', definition: 'TEXT' },
    { table: 'Recetas', name: 'imagen', definition: 'VARCHAR(255)' }
  ];
  
  let completed = 0;
  
  columnsToAdd.forEach((column, index) => {
    addColumnIfNotExists(column.table, column.name, column.definition, (err) => {
      if (err) {
        console.error(`❌ Error agregando ${column.name}:`, err.message);
      }
      
      completed++;
      if (completed === columnsToAdd.length) {
        console.log('🎉 Todas las actualizaciones completadas');
        connection.end();
      }
    });
  });
});