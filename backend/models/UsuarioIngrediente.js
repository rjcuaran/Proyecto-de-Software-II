// backend/models/UsuarioIngrediente.js
const db = require("../config/database");

class UsuarioIngrediente {
  static buscarPorNombre(nombre, callback) {
    const sql = `
      SELECT id, nombre, aprobado 
      FROM ingredientes_globales
      WHERE nombre LIKE ?
      ORDER BY nombre ASC
    `;
    db.query(sql, [`%${nombre}%`], callback);
  }

  static sugerir(nombre, creadoPor, callback) {
    const sql = `
      INSERT INTO ingredientes_globales (nombre, aprobado, creado_por)
      VALUES (?, false, ?)
    `;
    db.query(sql, [nombre, creadoPor], callback);
  }
}

module.exports = UsuarioIngrediente;
