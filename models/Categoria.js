const db = require('../config/database');

class Categoria {
  static obtenerTodas(callback) {
    const query = 'SELECT * FROM categoria ORDER BY nombre';
    db.execute(query, callback);
  }

  static obtenerPorId(id_categoria, callback) {
    const query = 'SELECT * FROM categoria WHERE id_categoria = ?';
    db.execute(query, [id_categoria], callback);
  }

  static obtenerRecetasPorCategoria(id_categoria, id_usuario, callback) {
    const query = `
      SELECT r.*, c.nombre as categoria_nombre
      FROM receta r
      LEFT JOIN categoria c ON r.id_categoria = c.id_categoria
      WHERE r.id_categoria = ? AND r.id_usuario = ?
      ORDER BY r.fecha_creacion DESC
    `;
    db.execute(query, [id_categoria, id_usuario], callback);
  }

  static obtenerEstadisticasUsuario(id_usuario, callback) {
    const query = `
      SELECT 
        c.id_categoria,
        c.nombre,
        c.icono,
        COUNT(r.id_receta) as total_recetas
      FROM categoria c
      LEFT JOIN receta r ON c.id_categoria = r.id_categoria AND r.id_usuario = ?
      GROUP BY c.id_categoria, c.nombre, c.icono
      ORDER BY total_recetas DESC
    `;
    db.execute(query, [id_usuario], callback);
  }

  static buscarPorNombre(termino, callback) {
    const query = 'SELECT * FROM categoria WHERE nombre LIKE ? ORDER BY nombre';
    const likeTermino = `%${termino}%`;
    db.execute(query, [likeTermino], callback);
  }
}

module.exports = Categoria;