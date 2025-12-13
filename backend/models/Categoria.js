const db = require("../config/database");

class Categoria {
  // ✅ Tabla correcta: categorias (id, nombre)
  static obtenerTodas(callback) {
    const query = "SELECT id, nombre FROM categorias ORDER BY nombre";
    db.execute(query, callback);
  }

  // ✅ Buscar por ID usando la columna correcta: id
  static obtenerPorId(id, callback) {
    const query = "SELECT id, nombre FROM categorias WHERE id = ?";
    db.execute(query, [id], callback);
  }

  // ✅ Join contra categorias.id (asumiendo que receta guarda id_categoria)
  static obtenerRecetasPorCategoria(id_categoria, id_usuario, callback) {
    const query = `
      SELECT r.*, c.nombre AS categoria_nombre
      FROM receta r
      LEFT JOIN categorias c ON r.id_categoria = c.id
      WHERE r.id_categoria = ? AND r.id_usuario = ?
      ORDER BY r.fecha_creacion DESC
    `;
    db.execute(query, [id_categoria, id_usuario], callback);
  }

  // ✅ Estadísticas sin icono (porque categorias solo tiene id, nombre)
  static obtenerEstadisticasUsuario(id_usuario, callback) {
    const query = `
      SELECT 
        c.id AS id_categoria,
        c.nombre,
        COUNT(r.id_receta) AS total_recetas
      FROM categorias c
      LEFT JOIN receta r ON c.id = r.id_categoria AND r.id_usuario = ?
      GROUP BY c.id, c.nombre
      ORDER BY total_recetas DESC
    `;
    db.execute(query, [id_usuario], callback);
  }

  // ✅ Buscar por nombre en tabla categorias
  static buscarPorNombre(termino, callback) {
    const query = "SELECT id, nombre FROM categorias WHERE nombre LIKE ? ORDER BY nombre";
    const likeTermino = `%${termino}%`;
    db.execute(query, [likeTermino], callback);
  }
}

module.exports = Categoria;
