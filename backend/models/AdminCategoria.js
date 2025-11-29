// backend/models/AdminCategoria.js
const db = require("../config/database");

class AdminCategoria {
  static obtenerTodas(callback) {
    const sql = "SELECT id, nombre FROM categorias ORDER BY nombre ASC";
    db.query(sql, callback);
  }

  static crear(nombre, callback) {
    const sql = "INSERT INTO categorias (nombre) VALUES (?)";
    db.query(sql, [nombre], callback);
  }

  static actualizar(id, nombre, callback) {
    const sql = "UPDATE categorias SET nombre = ? WHERE id = ?";
    db.query(sql, [nombre, id], callback);
  }

  static eliminar(id, callback) {
    const sql = "DELETE FROM categorias WHERE id = ?";
    db.query(sql, [id], callback);
  }
}

module.exports = AdminCategoria;
