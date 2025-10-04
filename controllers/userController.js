const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');

const userController = {
  // Obtener perfil del usuario
  async getProfile(req, res) {
    try {
      const user = req.user;

      // Obtener estadísticas del usuario
      const [stats] = await pool.execute(
        `SELECT 
          COUNT(DISTINCT r.id_receta) as total_recetas,
          COUNT(DISTINCT f.id_receta) as total_favoritos
         FROM Usuario u
         LEFT JOIN Receta r ON u.id_usuario = r.id_usuario
         LEFT JOIN Favorito f ON u.id_usuario = f.id_usuario
         WHERE u.id_usuario = ?`,
        [user.id_usuario]
      );

      res.json({
        success: true,
        data: {
          ...user,
          estadisticas: stats[0]
        }
      });

    } catch (error) {
      console.error('Error obteniendo perfil:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  },

  // Actualizar perfil
  async updateProfile(req, res) {
    try {
      const { nombre, correo } = req.body;
      const id_usuario = req.user.id_usuario;

      // Verificar si el correo ya existe en otro usuario
      if (correo) {
        const [existing] = await pool.execute(
          'SELECT id_usuario FROM Usuario WHERE correo = ? AND id_usuario != ?',
          [correo, id_usuario]
        );

        if (existing.length > 0) {
          return res.status(400).json({
            success: false,
            message: 'El correo ya está en uso por otro usuario'
          });
        }
      }

      await pool.execute(
        'UPDATE Usuario SET nombre = COALESCE(?, nombre), correo = COALESCE(?, correo) WHERE id_usuario = ?',
        [nombre, correo, id_usuario]
      );

      // Obtener usuario actualizado
      const [users] = await pool.execute(
        'SELECT id_usuario, nombre, correo, fecha_registro FROM Usuario WHERE id_usuario = ?',
        [id_usuario]
      );

      res.json({
        success: true,
        message: 'Perfil actualizado exitosamente',
        data: users[0]
      });

    } catch (error) {
      console.error('Error actualizando perfil:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
};

module.exports = userController;