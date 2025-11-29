// backend/models/AdminUnidad.js
const db = require("../config/database");

class AdminUnidad {
  static obtenerTodas(callback) {
    const sql = "SELECT id, nombre, abreviatura FROM unidades_medida ORDER BY nombre ASC";
    db.query(sql, callback);
  }

  static crear(nombre, abreviatura, callback) {
    const sql = "INSERT INTO unidades_medida (nombre, abreviatura) VALUES (?, ?)";
    db.query(sql, [nombre, abreviatura], callback);
  }

  static actualizar(id, nombre, abreviatura, callback) {
    const sql = "UPDATE unidades_medida SET nombre = ?, abreviatura = ? WHERE id = ?";
    db.query(sql, [nombre, abreviatura, id], callback);
  }

  static eliminar(id, callback) {
    const sql = "DELETE FROM unidades_medida WHERE id = ?";
    db.query(sql, [id], callback);
  }
}

module.exports = AdminUnidad;
