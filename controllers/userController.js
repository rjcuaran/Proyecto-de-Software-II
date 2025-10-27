const User = require('../models/User');

const userController = {
    // Obtener perfil básico del usuario
    getProfile: function(req, res) {
        const userId = req.user.id;
        
        User.obtenerPorId(userId, (error, results) => {
            if (error) {
                console.error('Error obteniendo perfil:', error);
                return res.status(500).json({
                    success: false,
                    message: 'Error interno del servidor al obtener perfil'
                });
            }

            if (results.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuario no encontrado'
                });
            }

            const user = results[0];
            res.json({
                success: true,
                data: {
                    id_usuario: user.id_usuario,
                    nombre: user.nombre,
                    correo: user.correo,
                    fecha_registro: user.fecha_registro
                }
            });
        });
    },

    // Actualizar perfil del usuario
    updateProfile: function(req, res) {
        const userId = req.user.id;
        const { nombre, email } = req.body;

        // Validaciones básicas
        if (!nombre && !email) {
            return res.status(400).json({
                success: false,
                message: 'Debe proporcionar nombre o email para actualizar'
            });
        }

        User.actualizarPerfil(userId, { nombre, correo: email }, (error, results) => {
            if (error) {
                console.error('Error actualizando perfil:', error);
                return res.status(500).json({
                    success: false,
                    message: 'Error interno del servidor al actualizar perfil'
                });
            }

            res.json({
                success: true,
                message: 'Perfil actualizado exitosamente'
            });
        });
    }
};

module.exports = userController;