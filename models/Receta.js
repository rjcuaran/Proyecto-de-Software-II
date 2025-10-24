const db = require('../config/database');

class Receta {
  static crear(recetaData, callback) {
    const { titulo, descripcion, tiempo_preparacion, porciones, idUsuario } = recetaData;
    
    const query = `
      INSERT INTO Recetas (titulo, descripcion, tiempo_preparacion, porciones, idUsuario, fecha_creacion)
      VALUES (?, ?, ?, ?, ?, NOW())
    `;
    
    db.execute(query, [titulo, descripcion, tiempo_preparacion, porciones, idUsuario], callback);
  }

  static obtenerPorUsuario(idUsuario, callback) {
    const query = `
      SELECT r.*, COUNT(f.idReceta) as esFavorito
      FROM Recetas r 
      LEFT JOIN Favoritos f ON r.idReceta = f.idReceta AND f.idUsuario = ?
      WHERE r.idUsuario = ?
      GROUP BY r.idReceta
      ORDER BY r.fecha_creacion DESC
    `;
    db.execute(query, [idUsuario, idUsuario], callback);
  }

  static obtenerPorId(idReceta, callback) {
    const query = 'SELECT * FROM Recetas WHERE idReceta = ?';
    db.execute(query, [idReceta], callback);
  }

  static actualizar(idReceta, recetaData, callback) {
    const { titulo, descripcion, tiempo_preparacion, porciones } = recetaData;
    
    const query = `
      UPDATE Recetas 
      SET titulo = ?, descripcion = ?, tiempo_preparacion = ?, porciones = ?
      WHERE idReceta = ?
    `;
    
    db.execute(query, [titulo, descripcion, tiempo_preparacion, porciones, idReceta], callback);
  }

  static eliminar(idReceta, callback) {
    const query = 'DELETE FROM Recetas WHERE idReceta = ?';
    db.execute(query, [idReceta], callback);
  }

  static buscar(termino, idUsuario, callback) {
    const query = `
      SELECT * FROM Recetas 
      WHERE idUsuario = ? AND (titulo LIKE ? OR descripcion LIKE ?)
    `;
    const likeTermino = `%${termino}%`;
    db.execute(query, [idUsuario, likeTermino, likeTermino], callback);
  }
}

module.exports = Receta;