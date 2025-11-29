// backend/models/AdminUsuario.js
const db = require("../config/database");

class AdminUsuario {
  static obtenerTodos(callback) {
    const sql = `
      SELECT id_usuario, nombre, correo, role, estado, fecha_registro, avatar
      FROM usuario
      ORDER BY fecha_registro DESC
    `;
    db.query(sql, callback);
  }

  static actualizarRol(id, role, callback) {
    const sql = `
      UPDATE usuario SET role = ? WHERE id_usuario = ?
    `;
    db.query(sql, [role, id], callback);
  }

  static actualizarEstado(id, estado, callback) {
    const sql = `
      UPDATE usuario SET estado = ? WHERE id_usuario = ?
    `;
    db.query(sql, [estado, id], callback);
  }
}

module.exports = AdminUsuario;
