// backend/models/AdminCategoria.js
const db = require("../config/database");

class AdminCategoria {
  // Obtener todas las categorías ordenadas alfabéticamente
  static obtenerTodas(callback) {
    const sql = "SELECT id, nombre FROM categorias ORDER BY nombre ASC";
    db.query(sql, callback);
  }

  // Crear categoría
  static crear(nombre, callback) {
    const sql = "INSERT INTO categorias (nombre) VALUES (?)";
    db.query(sql, [nombre], callback);
  }

  // Actualizar categoría
  static actualizar(id, nombre, callback) {
    const sql = "UPDATE categorias SET nombre = ? WHERE id = ?";
    db.query(sql, [nombre, id], callback);
  }

  // Eliminar categoría
  static eliminar(id, callback) {
    const sql = "DELETE FROM categorias WHERE id = ?";
    db.query(sql, [id], callback);
  }
}

module.exports = AdminCategoria;
