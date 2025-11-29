// backend/models/User.js
const db = require('../config/database');

class User {
  static crear(usuarioData, callback) {
    const { nombre, correo, contraseña } = usuarioData;
    const query = 'INSERT INTO usuario (nombre, correo, contraseña) VALUES (?, ?, ?)';
    db.query(query, [nombre, correo, contraseña], callback);
  }

  static obtenerPorEmail(correo, callback) {
    const query = 'SELECT * FROM usuario WHERE correo = ?';
    db.query(query, [correo], callback);
  }

  static obtenerPorId(id_usuario, callback) {
    const query = `
      SELECT id_usuario, nombre, correo, fecha_registro, avatar, role 
      FROM usuario WHERE id_usuario = ?
    `;
    db.query(query, [id_usuario], callback);
  }

  static actualizarPerfil(id_usuario, usuarioData, callback) {
    const { nombre, correo } = usuarioData;
    const query = 'UPDATE usuario SET nombre = ?, correo = ? WHERE id_usuario = ?';
    db.query(query, [nombre, correo, id_usuario], callback);
  }
}

module.exports = User;
