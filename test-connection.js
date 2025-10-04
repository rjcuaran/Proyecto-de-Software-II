const mysql = require('mysql2/promise');

async function testMySQLConnection() {
  console.log('🧪 Probando conexión a MySQL...\n');
  
  const config = {
    host: 'localhost',
    user: 'root',
    password: '',  // Sin contraseña
    database: 'organizador_recetas'
  };

  try {
    console.log('📋 Configuración usada:');
    console.log(`   Host: ${config.host}`);
    console.log(`   Usuario: ${config.user}`);
    console.log(`   Contraseña: (vacía)`);
    console.log(`   Base de datos: ${config.database}\n`);

    // Primero conectar sin especificar base de datos
    const connection = await mysql.createConnection({
      host: config.host,
      user: config.user,
      password: config.password
    });

    console.log('✅ ¡Conexión a MySQL exitosa!');

    // Crear base de datos
    await connection.execute(`CREATE DATABASE IF NOT EXISTS \`organizador_recetas\``);
    console.log(`✅ Base de datos 'organizador_recetas' creada`);

    // Mostrar version
    const [rows] = await connection.execute('SELECT VERSION() as version');
    console.log(`✅ Versión de MySQL: ${rows[0].version}`);

    // Mostrar bases de datos
    const [dbs] = await connection.execute('SHOW DATABASES');
    console.log('\n📊 Bases de datos existentes:');
    dbs.forEach(db => {
      console.log(`   - ${db.Database}`);
    });

    await connection.end();
    console.log('\n🎉 ¡Todo listo! Ahora ejecuta: npm start');
    
    return true;
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    console.log('\n🔧 Posibles soluciones:');
    console.log('1. Verifica que MySQL esté ejecutándose');
    console.log('2. Revisa que no haya firewall bloqueando');
    return false;
  }
}

testMySQLConnection();