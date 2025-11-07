const db = require('../config/database');

class Favorito {
  static agregar(id_usuario, id_receta, callback) {
    const query = 'INSERT INTO favorito (id_usuario, id_receta, fecha_agregado) VALUES (?, ?, NOW())';
    db.execute(query, [id_usuario, id_receta], callback);
  }

  static eliminar(id_usuario, id_receta, callback) {
    const query = 'DELETE FROM favorito WHERE id_usuario = ? AND id_receta = ?';
    db.execute(query, [id_usuario, id_receta], callback);
  }

  static obtenerPorUsuario(id_usuario, callback) {
    const query = `
      SELECT r.*, f.fecha_agregado 
      FROM receta r 
      INNER JOIN favorito f ON r.id_receta = f.id_receta 
      WHERE f.id_usuario = ? 
      ORDER BY f.fecha_agregado DESC
    `;
    db.execute(query, [id_usuario], callback);
  }

  static esFavorito(id_usuario, id_receta, callback) {
    const query = 'SELECT 1 FROM favorito WHERE id_usuario = ? AND id_receta = ? LIMIT 1';
    db.execute(query, [id_usuario, id_receta], (err, results) => {
      if (err) return callback(err);
      callback(null, { esFavorito: results.length > 0 });
    });
  }
}

module.exports = Favorito;