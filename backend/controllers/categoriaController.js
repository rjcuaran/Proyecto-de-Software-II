const Categoria = require('../models/Categoria');

const categoriaController = {
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

  obtenerRecetasPorCategoria: (req, res) => {
    const idCategoria = req.params.idCategoria;
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

  buscarPorNombre: (req, res) => {
    const termino = req.params.termino;

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