const Favorito = require('../models/Favorito');

const favoritosController = {
    // Agregar receta a favoritos
    agregarFavorito: function(req, res) {
        const userId = req.user.id;
        const recetaId = req.params.idReceta;

        console.log('📥 Agregando favorito - Usuario:', userId, 'Receta:', recetaId);

        Favorito.agregar(userId, recetaId, (error, results) => {
            if (error) {
                console.error('❌ Error agregando favorito:', error);
                return res.status(500).json({
                    success: false,
                    message: 'Error interno del servidor'
                });
            }

            res.status(201).json({
                success: true,
                message: 'Receta agregada a favoritos exitosamente',
                data: {
                    id_receta: parseInt(recetaId),
                    id_usuario: userId
                }
            });
        });
    },

    // Eliminar receta de favoritos
    eliminarFavorito: function(req, res) {
        const userId = req.user.id;
        const recetaId = req.params.idReceta;

        console.log('🗑️ Eliminando favorito - Usuario:', userId, 'Receta:', recetaId);

        Favorito.eliminar(userId, recetaId, (error, results) => {
            if (error) {
                console.error('❌ Error eliminando favorito:', error);
                return res.status(500).json({
                    success: false,
                    message: 'Error interno del servidor'
                });
            }

            res.json({
                success: true,
                message: 'Receta eliminada de favoritos exitosamente'
            });
        });
    },

    // Obtener favoritos del usuario
    obtenerFavoritos: function(req, res) {
        const userId = req.user.id;

        console.log('📋 Obteniendo favoritos - Usuario:', userId);

        Favorito.obtenerPorUsuario(userId, (error, results) => {
            if (error) {
                console.error('❌ Error obteniendo favoritos:', error);
                return res.status(500).json({
                    success: false,
                    message: 'Error interno del servidor'
                });
            }

            res.json({
                success: true,
                data: results,
                total: results.length
            });
        });
    },

    // Verificar si una receta es favorita
    verificarFavorito: function(req, res) {
        const userId = req.user.id;
        const recetaId = req.params.idReceta;

        console.log('🔍 Verificando favorito - Usuario:', userId, 'Receta:', recetaId);

        Favorito.esFavorito(userId, recetaId, (error, results) => {
            if (error) {
                console.error('❌ Error verificando favorito:', error);
                return res.status(500).json({
                    success: false,
                    message: 'Error interno del servidor'
                });
            }

            res.json({
                success: true,
                esFavorito: results.esFavorito
            });
        });
    }
};

module.exports = favoritosController;