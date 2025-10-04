const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  // Crear nuevo usuario
  static async create(userData) {
    const { nombre, correo, contraseña } = userData;
    
    // Encriptar contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(contraseña, saltRounds);

    const [result] = await pool.execute(
      'INSERT INTO Usuario (nombre, correo, contraseña) VALUES (?, ?, ?)',
      [nombre, correo, hashedPassword]
    );

    return result.insertId;
  }

  // Buscar usuario por email
  static async findByEmail(correo) {
    const [rows] = await pool.execute(
      'SELECT * FROM Usuario WHERE correo = ?',
      [correo]
    );
    return rows[0];
  }

  // Buscar usuario por ID
  static async findById(id) {
    const [rows] = await pool.execute(
      'SELECT id_usuario, nombre, correo, fecha_registro FROM Usuario WHERE id_usuario = ?',
      [id]
    );
    return rows[0];
  }

  // Verificar contraseña
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Obtener todos los usuarios (para desarrollo)
  static async getAll() {
    const [rows] = await pool.execute(
      'SELECT id_usuario, nombre, correo, fecha_registro FROM Usuario'
    );
    return rows;
  }
}

module.exports = User;