// backend/models/Receta.js
const db = require('../config/database');

class Receta {
  static crear(recetaData, callback) {
    const { nombre, categoria, descripcion, preparacion, id_usuario } = recetaData;
    
    const query = `
INSERT INTO receta (nombre, categoria, descripcion, preparacion, imagen, id_usuario, fecha_creacion)
VALUES (?, ?, ?, ?, ?, ?, NOW())
    `;
    
    db.query(query, [nombre, categoria, descripcion, preparacion, id_usuario], (err, results) => {
      if (err) return callback(err);
      callback(null, { id_receta: results.insertId });
    });
  }

  static obtenerPorUsuario(id_usuario, callback) {
    const query = `
      SELECT r.*, 
             (SELECT COUNT(*) FROM favorito f WHERE f.id_receta = r.id_receta AND f.id_usuario = ?) as es_favorito
      FROM receta r 
      WHERE r.id_usuario = ?
      ORDER BY r.fecha_creacion DESC
    `;
    db.query(query, [id_usuario, id_usuario], callback);
  }

  static obtenerPorId(id_receta, callback) {
    const query = 'SELECT * FROM receta WHERE id_receta = ?';
    db.query(query, [id_receta], callback);
  }

  static actualizar(id_receta, recetaData, callback) {
    const { nombre, categoria, descripcion, preparacion } = recetaData;
    
    const query = `
      UPDATE receta 
      SET nombre = ?, categoria = ?, descripcion = ?, preparacion = ?
      WHERE id_receta = ?
    `;
    
    db.query(query, [nombre, categoria, descripcion, preparacion, id_receta], callback);
  }

  static eliminar(id_receta, callback) {
    const query = 'DELETE FROM receta WHERE id_receta = ?';
    db.query(query, [id_receta], callback);
  }

  static buscar(termino, id_usuario, callback) {
    const query = `
      SELECT * FROM receta 
      WHERE id_usuario = ? AND (nombre LIKE ? OR descripcion LIKE ? OR categoria LIKE ?)
    `;
    const likeTermino = `%${termino}%`;
    db.query(query, [id_usuario, likeTermino, likeTermino, likeTermino], callback);
  }
}

module.exports = Receta;
