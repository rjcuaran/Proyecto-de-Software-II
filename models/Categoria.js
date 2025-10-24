const db = require('../config/database');

class Categoria {
  // Obtener todas las categorías predefinidas
  static obtenerTodas(callback) {
    const query = 'SELECT * FROM Categorias ORDER BY nombre';
    db.execute(query, callback);
  }

  // Obtener categoría por ID
  static obtenerPorId(idCategoria, callback) {
    const query = 'SELECT * FROM Categorias WHERE idCategoria = ?';
    db.execute(query, [idCategoria], callback);
  }

  // Obtener recetas por categoría
  static obtenerRecetasPorCategoria(idCategoria, idUsuario, callback) {
    const query = `
      SELECT r.*, c.nombre as categoria_nombre
      FROM Recetas r
      INNER JOIN Categorias c ON r.idCategoria = c.idCategoria
      WHERE r.idCategoria = ? AND r.idUsuario = ?
      ORDER BY r.fecha_creacion DESC
    `;
    db.execute(query, [idCategoria, idUsuario], callback);
  }

  // Actualizar categoría de una receta
  static actualizarCategoriaReceta(idReceta, idCategoria, callback) {
    const query = 'UPDATE Recetas SET idCategoria = ? WHERE idReceta = ?';
    db.execute(query, [idCategoria, idReceta], callback);
  }

  // Obtener estadísticas de categorías por usuario
  static obtenerEstadisticasUsuario(idUsuario, callback) {
    const query = `
      SELECT 
        c.idCategoria,
        c.nombre,
        c.icono,
        COUNT(r.idReceta) as total_recetas
      FROM Categorias c
      LEFT JOIN Recetas r ON c.idCategoria = r.idCategoria AND r.idUsuario = ?
      GROUP BY c.idCategoria, c.nombre, c.icono
      ORDER BY total_recetas DESC
    `;
    db.execute(query, [idUsuario], callback);
  }

  // Buscar categorías por nombre
  static buscarPorNombre(termino, callback) {
    const query = 'SELECT * FROM Categorias WHERE nombre LIKE ? ORDER BY nombre';
    const likeTermino = `%${termino}%`;
    db.execute(query, [likeTermino], callback);
  }
}

module.exports = Categoria;