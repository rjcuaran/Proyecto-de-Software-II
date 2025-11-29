// backend/models/AdminIngrediente.js
const db = require("../config/database");

class AdminIngrediente {
  static obtenerTodos(callback) {
    const sql = `
      SELECT id, nombre, aprobado, creado_por
      FROM ingredientes_globales
      ORDER BY nombre ASC
    `;
    db.query(sql, callback);
  }

  static obtenerPendientes(callback) {
    const sql = `
      SELECT id, nombre, creado_por
      FROM ingredientes_globales
      WHERE aprobado = false
      ORDER BY nombre ASC
    `;
    db.query(sql, callback);
  }

  static crear(nombre, creadoPor, callback) {
    const sql = `
      INSERT INTO ingredientes_globales (nombre, aprobado, creado_por)
      VALUES (?, true, ?)
    `;
    db.query(sql, [nombre, creadoPor], callback);
  }

  static actualizar(id, nombre, callback) {
    const sql = `
      UPDATE ingredientes_globales
      SET nombre = ?
      WHERE id = ?
    `;
    db.query(sql, [nombre, id], callback);
  }

  static eliminar(id, callback) {
    const sql = `DELETE FROM ingredientes_globales WHERE id = ?`;
    db.query(sql, [id], callback);
  }

  static aprobar(id, callback) {
    const sql = `
      UPDATE ingredientes_globales
      SET aprobado = true
      WHERE id = ?
    `;
    db.query(sql, [id], callback);
  }

  static desaprobar(id, callback) {
    const sql = `
      UPDATE ingredientes_globales
      SET aprobado = false
      WHERE id = ?
    `;
    db.query(sql, [id], callback);
  }

  static rechazar(id, callback) {
    const sql = `DELETE FROM ingredientes_globales WHERE id = ?`;
    db.query(sql, [id], callback);
  }

  // NUEVO → Para evitar duplicados
  static buscarExacto(nombre, callback) {
    const sql = `
      SELECT id FROM ingredientes_globales WHERE nombre = ?
    `;
    db.query(sql, [nombre], callback);
  }
}

module.exports = AdminIngrediente;
