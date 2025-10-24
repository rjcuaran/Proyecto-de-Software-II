const Categoria = require('../models/Categoria');

const categoriaController = {
  // Obtener todas las categorías
  obtenerTodas: (req, res) => {
    Categoria.obtenerTodas((error, results) => {
      if (error) {
        console.error('Error obteniendo categorías:', error);
        return res.status(500).json({
          mensaje: 'Error interno del servidor',
          error: error.message
        });
      }
      
      res.json({
        success: true,
        categorias: results
      });
    });
  },

  // Obtener recetas por categoría
  obtenerRecetasPorCategoria: (req, res) => {
    const { idCategoria } = req.params;
    const idUsuario = req.user.id;

    Categoria.obtenerRecetasPorCategoria(idCategoria, idUsuario, (error, results) => {
      if (error) {
        console.error('Error obteniendo recetas por categoría:', error);
        return res.status(500).json({
          mensaje: 'Error interno del servidor',
          error: error.message
        });
      }

      res.json({
        success: true,
        recetas: results
      });
    });
  },

  // Obtener estadísticas de categorías del usuario
  obtenerEstadisticasUsuario: (req, res) => {
    const idUsuario = req.user.id;

    Categoria.obtenerEstadisticasUsuario(idUsuario, (error, results) => {
      if (error) {
        console.error('Error obteniendo estadísticas:', error);
        return res.status(500).json({
          mensaje: 'Error interno del servidor',
          error: error.message
        });
      }

      res.json({
        success: true,
        estadisticas: results
      });
    });
  },

  // Buscar categorías por nombre
  buscarPorNombre: (req, res) => {
    const { termino } = req.params;

    Categoria.buscarPorNombre(termino, (error, results) => {
      if (error) {
        console.error('Error buscando categorías:', error);
        return res.status(500).json({
          mensaje: 'Error interno del servidor',
          error: error.message
        });
      }

      res.json({
        success: true,
        categorias: results
      });
    });
  }
};

module.exports = categoriaController;