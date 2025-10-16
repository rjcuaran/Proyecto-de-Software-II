const { pool } = require('../config/database');

const favoritosController = {
    // Agregar receta a favoritos
    async addFavorito(req, res) {
        try {
            const { idReceta } = req.params;
            const id_usuario = req.user.id_usuario;

            // Verificar que la receta existe
            const [recetas] = await pool.execute(
                'SELECT id_receta FROM Receta WHERE id_receta = ?',
                [idReceta]
            );

            if (recetas.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Receta no encontrada'
                });
            }

            // Verificar si ya es favorita
            const [existeFavorito] = await pool.execute(
                'SELECT id_favorito FROM Favorito WHERE id_usuario = ? AND id_receta = ?',
                [id_usuario, idReceta]
            );

            if (existeFavorito.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'La receta ya está en tus favoritos'
                });
            }

            // Agregar a favoritos
            await pool.execute(
                'INSERT INTO Favorito (id_usuario, id_receta) VALUES (?, ?)',
                [id_usuario, idReceta]
            );

            // Obtener información actualizada de la receta
            const recetaActualizada = await recetaController.getRecetaById(idReceta, id_usuario);

            res.status(201).json({
                success: true,
                message: 'Receta agregada a favoritos',
                data: recetaActualizada
            });

        } catch (error) {
            console.error('Error agregando a favoritos:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor al agregar favorito'
            });
        }
    },

    // Eliminar receta de favoritos
    async removeFavorito(req, res) {
        try {
            const { idReceta } = req.params;
            const id_usuario = req.user.id_usuario;

            const [result] = await pool.execute(
                'DELETE FROM Favorito WHERE id_usuario = ? AND id_receta = ?',
                [id_usuario, idReceta]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Receta no encontrada en favoritos'
                });
            }

            // Obtener información actualizada de la receta
            const recetaActualizada = await recetaController.getRecetaById(idReceta, id_usuario);

            res.json({
                success: true,
                message: 'Receta eliminada de favoritos',
                data: recetaActualizada
            });

        } catch (error) {
            console.error('Error eliminando de favoritos:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor al eliminar favorito'
            });
        }
    },

    // Obtener todas las recetas favoritas del usuario
    async getFavoritos(req, res) {
        try {
            const id_usuario = req.user.id_usuario;

            const [recetas] = await pool.execute(
                `SELECT r.*, 
                u.nombre as autor,
                COUNT(DISTINCT i.id_ingrediente) as total_ingredientes,
                COUNT(DISTINCT f2.id_favorito) as total_favoritos
         FROM Favorito f
         JOIN Receta r ON f.id_receta = r.id_receta
         JOIN Usuario u ON r.id_usuario = u.id_usuario
         LEFT JOIN Ingrediente i ON r.id_receta = i.id_receta
         LEFT JOIN Favorito f2 ON r.id_receta = f2.id_receta
         WHERE f.id_usuario = ?
         GROUP BY r.id_receta
         ORDER BY f.fecha_agregado DESC`,
                [id_usuario]
            );

            res.json({
                success: true,
                data: recetas,
                total: recetas.length
            });

        } catch (error) {
            console.error('Error obteniendo favoritos:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    },

    // Verificar si una receta es favorita
    async checkFavorito(req, res) {
        try {
            const { idReceta } = req.params;
            const id_usuario = req.user.id_usuario;

            const [favorito] = await pool.execute(
                'SELECT id_favorito FROM Favorito WHERE id_usuario = ? AND id_receta = ?',
                [id_usuario, idReceta]
            );

            const esFavorita = favorito.length > 0;

            res.json({
                success: true,
                data: {
                    esFavorita: esFavorita,
                    id_receta: parseInt(idReceta)
                }
            });

        } catch (error) {
            console.error('Error verificando favorito:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    },

    // Método auxiliar para obtener receta con información de favorito
    async getRecetaConFavorito(idReceta, idUsuario) {
        const [recetas] = await pool.execute(
            `SELECT r.*, 
              u.nombre as autor,
              COUNT(DISTINCT i.id_ingrediente) as total_ingredientes,
              COUNT(DISTINCT f.id_favorito) as total_favoritos,
              EXISTS(
                SELECT 1 FROM Favorito f2 
                WHERE f2.id_receta = r.id_receta AND f2.id_usuario = ?
              ) as es_favorita
       FROM Receta r
       JOIN Usuario u ON r.id_usuario = u.id_usuario
       LEFT JOIN Ingrediente i ON r.id_receta = i.id_receta
       LEFT JOIN Favorito f ON r.id_receta = f.id_receta
       WHERE r.id_receta = ?
       GROUP BY r.id_receta`,
            [idUsuario, idReceta]
        );

        if (recetas.length === 0) {
            return null;
        }

        const receta = recetas[0];

        // Obtener ingredientes
        const [ingredientes] = await pool.execute(
            'SELECT * FROM Ingrediente WHERE id_receta = ? ORDER BY id_ingrediente',
            [idReceta]
        );

        receta.ingredientes = ingredientes;

        return receta;
    }
};

module.exports = favoritosController;