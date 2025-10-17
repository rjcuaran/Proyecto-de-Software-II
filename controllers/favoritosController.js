const { pool } = require('../config/database');

const favoritosController = {
    // Agregar receta a favoritos - VERSIÓN CORREGIDA
    async addFavorito(req, res) {
        try {
            const { idReceta } = req.params;
            const id_usuario = req.user.id_usuario;

            console.log('📌 Agregando favorito - Usuario:', id_usuario, 'Receta:', idReceta);

            // Verificar que la receta existe
            const [recetas] = await pool.execute(
                'SELECT id_receta, nombre FROM Receta WHERE id_receta = ?',
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
            const [result] = await pool.execute(
                'INSERT INTO Favorito (id_usuario, id_receta) VALUES (?, ?)',
                [id_usuario, idReceta]
            );

            console.log('✅ Favorito agregado exitosamente. ID:', result.insertId);

            res.status(201).json({
                success: true,
                message: 'Receta agregada a favoritos exitosamente',
                data: {
                    id_favorito: result.insertId,
                    id_receta: parseInt(idReceta),
                    id_usuario: id_usuario,
                    nombre: recetas[0].nombre
                }
            });

        } catch (error) {
            console.error('❌ Error agregando a favoritos:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    },

    // Eliminar receta de favoritos - VERSIÓN CORREGIDA
    async removeFavorito(req, res) {
        try {
            const { idReceta } = req.params;
            const id_usuario = req.user.id_usuario;

            console.log('📌 Eliminando favorito - Usuario:', id_usuario, 'Receta:', idReceta);

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

            console.log('✅ Favorito eliminado exitosamente');

            res.json({
                success: true,
                message: 'Receta eliminada de favoritos exitosamente'
            });

        } catch (error) {
            console.error('❌ Error eliminando de favoritos:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    },

    // Obtener todas las recetas favoritas - VERSIÓN CORREGIDA (sin GROUP BY problemático)
    async getFavoritos(req, res) {
        try {
            const id_usuario = req.user.id_usuario;

            console.log('📌 Obteniendo favoritos para usuario:', id_usuario);

            const [recetas] = await pool.execute(
                `SELECT 
                    r.id_receta, 
                    r.nombre, 
                    r.categoria, 
                    r.descripcion,
                    r.preparacion,
                    r.fecha_creacion,
                    u.nombre as autor,
                    f.fecha_agregado,
                    (SELECT COUNT(*) FROM Ingrediente i WHERE i.id_receta = r.id_receta) as total_ingredientes,
                    (SELECT COUNT(*) FROM Favorito f2 WHERE f2.id_receta = r.id_receta) as total_favoritos
                FROM Favorito f
                JOIN Receta r ON f.id_receta = r.id_receta
                JOIN Usuario u ON r.id_usuario = u.id_usuario
                WHERE f.id_usuario = ?
                ORDER BY f.fecha_agregado DESC`,
                [id_usuario]
            );

            console.log('✅ Favoritos obtenidos:', recetas.length, 'recetas');

            res.json({
                success: true,
                data: recetas,
                total: recetas.length
            });

        } catch (error) {
            console.error('❌ Error obteniendo favoritos:', error);
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

            console.log('📌 Verificando favorito - Usuario:', id_usuario, 'Receta:', idReceta);

            const [favorito] = await pool.execute(
                'SELECT id_favorito FROM Favorito WHERE id_usuario = ? AND id_receta = ?',
                [id_usuario, idReceta]
            );

            const esFavorita = favorito.length > 0;

            console.log('✅ Verificación completada. Es favorita:', esFavorita);

            res.json({
                success: true,
                data: {
                    esFavorita: esFavorita,
                    id_receta: parseInt(idReceta)
                }
            });

        } catch (error) {
            console.error('❌ Error verificando favorito:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }
};

module.exports = favoritosController;