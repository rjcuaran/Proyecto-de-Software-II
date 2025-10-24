const db = require('../config/database');

class Favorito {
  static agregar(idUsuario, idReceta, callback) {
    const query = 'INSERT INTO Favoritos (idUsuario, idReceta, fecha_agregado) VALUES (?, ?, NOW())';
    db.execute(query, [idUsuario, idReceta], callback);
  }

  static eliminar(idUsuario, idReceta, callback) {
    const query = 'DELETE FROM Favoritos WHERE idUsuario = ? AND idReceta = ?';
    db.execute(query, [idUsuario, idReceta], callback);
  }

  static obtenerPorUsuario(idUsuario, callback) {
    const query = `
      SELECT r.*, f.fecha_agregado 
      FROM Recetas r 
      INNER JOIN Favoritos f ON r.idReceta = f.idReceta 
      WHERE f.idUsuario = ? 
      ORDER BY f.fecha_agregado DESC
    `;
    db.execute(query, [idUsuario], callback);
  }

  static esFavorito(idUsuario, idReceta, callback) {
    const query = 'SELECT 1 FROM Favoritos WHERE idUsuario = ? AND idReceta = ? LIMIT 1';
    db.execute(query, [idUsuario, idReceta], (err, results) => {
      if (err) return callback(err);
      callback(null, { esFavorito: results.length > 0 });
    });
  }
}

module.exports = Favorito;