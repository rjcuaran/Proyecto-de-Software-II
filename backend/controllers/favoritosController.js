const Favorito = require('../models/Favorito');

const buildError = (res, error, message = 'Error interno del servidor') => {
  console.error(message, error);
  return res.status(500).json({ success: false, message });
};

const favoritosController = {
  // Agregar receta a favoritos (con idempotencia)
  agregarFavorito: function (req, res) {
    const userId = req.user.id;
    const recetaId = req.params.idReceta;

    console.log('📥 Agregando favorito - Usuario:', userId, 'Receta:', recetaId);

    Favorito.esFavorito(userId, recetaId, (checkErr, checkResult) => {
      if (checkErr) return buildError(res, checkErr);

      if (checkResult.esFavorito) {
        return res.status(200).json({
          success: true,
          message: 'La receta ya estaba en favoritos',
          data: { id_receta: parseInt(recetaId, 10), id_usuario: userId },
        });
      }

      Favorito.agregar(userId, recetaId, (error) => {
        if (error) return buildError(res, error, 'Error agregando favorito');

        res.status(201).json({
          success: true,
          message: 'Receta agregada a favoritos exitosamente',
          data: { id_receta: parseInt(recetaId, 10), id_usuario: userId },
        });
      });
    });
  },

  // Eliminar receta de favoritos
  eliminarFavorito: function (req, res) {
    const userId = req.user.id;
    const recetaId = req.params.idReceta;

    console.log('🗑️ Eliminando favorito - Usuario:', userId, 'Receta:', recetaId);

    Favorito.eliminar(userId, recetaId, (error) => {
      if (error) return buildError(res, error, 'Error eliminando favorito');

      res.json({
        success: true,
        message: 'Receta eliminada de favoritos exitosamente',
      });
    });
  },

  // Obtener favoritos del usuario
  obtenerFavoritos: function (req, res) {
    const userId = req.user.id;

    console.log('📋 Obteniendo favoritos - Usuario:', userId);

    Favorito.obtenerPorUsuario(userId, (error, results) => {
      if (error) return buildError(res, error, 'Error obteniendo favoritos');

      res.json({
        success: true,
        data: results,
        total: results.length,
      });
    });
  },

  // Verificar si una receta es favorita
  verificarFavorito: function (req, res) {
    const userId = req.user.id;
    const recetaId = req.params.idReceta;

    console.log('🔍 Verificando favorito - Usuario:', userId, 'Receta:', recetaId);

    Favorito.esFavorito(userId, recetaId, (error, results) => {
      if (error) return buildError(res, error, 'Error verificando favorito');

      res.json({
        success: true,
        esFavorito: results.esFavorito,
      });
    });
  },
};

module.exports = favoritosController;
