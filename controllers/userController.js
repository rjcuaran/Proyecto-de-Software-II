const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');

const userController = {
  // Obtener perfil del usuario con estadísticas completas
  async getProfile(req, res) {
    try {
      const user = req.user;

      // Obtener estadísticas detalladas del usuario
      const [stats] = await pool.execute(
        `SELECT 
          COUNT(DISTINCT r.id_receta) as total_recetas,
          COUNT(DISTINCT f.id_receta) as total_favoritos,
          MAX(r.fecha_creacion) as ultima_receta_creada,
          (SELECT COUNT(*) FROM Favorito WHERE id_usuario = ?) as mis_favoritos
         FROM Usuario u
         LEFT JOIN Receta r ON u.id_usuario = r.id_usuario
         LEFT JOIN Favorito f ON u.id_usuario = f.id_usuario
         WHERE u.id_usuario = ?`,
        [user.id_usuario, user.id_usuario]
      );

      // Obtener categorías más utilizadas
      const [categorias] = await pool.execute(
        `SELECT categoria, COUNT(*) as cantidad
         FROM Receta 
         WHERE id_usuario = ? 
         GROUP BY categoria 
         ORDER BY cantidad DESC 
         LIMIT 5`,
        [user.id_usuario]
      );

      res.json({
        success: true,
        data: {
          ...user,
          estadisticas: {
            ...stats[0],
            categorias_populares: categorias
          }
        }
      });

    } catch (error) {
      console.error('Error obteniendo perfil:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor al obtener perfil'
      });
    }
  },

  // Actualizar perfil con validaciones mejoradas
  async updateProfile(req, res) {
    try {
      const { nombre, correo, contraseña_actual, nueva_contraseña } = req.body;
      const id_usuario = req.user.id_usuario;

      const connection = await pool.getConnection();
      await connection.beginTransaction();

      try {
        // Verificar si el usuario quiere cambiar el correo
        if (correo && correo !== req.user.correo) {
          const [existing] = await connection.execute(
            'SELECT id_usuario FROM Usuario WHERE correo = ? AND id_usuario != ?',
            [correo, id_usuario]
          );

          if (existing.length > 0) {
            await connection.rollback();
            connection.release();
            return res.status(400).json({
              success: false,
              message: 'El correo ya está en uso por otro usuario'
            });
          }
        }

        // Verificar si el usuario quiere cambiar la contraseña
        if (contraseña_actual && nueva_contraseña) {
          // Obtener la contraseña actual del usuario
          const [users] = await connection.execute(
            'SELECT contraseña FROM Usuario WHERE id_usuario = ?',
            [id_usuario]
          );

          const user = users[0];
          
          // Verificar que la contraseña actual sea correcta
          const isPasswordValid = await bcrypt.compare(contraseña_actual, user.contraseña);
          
          if (!isPasswordValid) {
            await connection.rollback();
            connection.release();
            return res.status(400).json({
              success: false,
              message: 'La contraseña actual es incorrecta'
            });
          }

          // Encriptar la nueva contraseña
          const saltRounds = 10;
          const hashedNewPassword = await bcrypt.hash(nueva_contraseña, saltRounds);

          // Actualizar contraseña
          await connection.execute(
            'UPDATE Usuario SET contraseña = ? WHERE id_usuario = ?',
            [hashedNewPassword, id_usuario]
          );
        }

        // Preparar campos para actualización
        const updateFields = [];
        const updateParams = [];

        if (nombre && nombre !== req.user.nombre) {
          updateFields.push('nombre = ?');
          updateParams.push(nombre);
        }

        if (correo && correo !== req.user.correo) {
          updateFields.push('correo = ?');
          updateParams.push(correo);
        }

        // Solo actualizar si hay campos que cambiar
        if (updateFields.length > 0) {
          updateParams.push(id_usuario);
          
          await connection.execute(
            `UPDATE Usuario SET ${updateFields.join(', ')} WHERE id_usuario = ?`,
            updateParams
          );
        }

        await connection.commit();
        connection.release();

        // Obtener usuario actualizado
        const [updatedUsers] = await pool.execute(
          'SELECT id_usuario, nombre, correo, fecha_registro FROM Usuario WHERE id_usuario = ?',
          [id_usuario]
        );

        const mensaje = updateFields.length > 0 || (contraseña_actual && nueva_contraseña) 
          ? 'Perfil actualizado exitosamente' 
          : 'No se realizaron cambios en el perfil';

        res.json({
          success: true,
          message: mensaje,
          data: updatedUsers[0],
          cambios_realizados: {
            perfil: updateFields.length > 0,
            contraseña: !!(contraseña_actual && nueva_contraseña)
          }
        });

      } catch (error) {
        await connection.rollback();
        connection.release();
        throw error;
      }

    } catch (error) {
      console.error('Error actualizando perfil:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor al actualizar perfil'
      });
    }
  },

  // Nuevo método: Obtener estadísticas detalladas
  async getEstadisticas(req, res) {
    try {
      const id_usuario = req.user.id_usuario;

      const [estadisticas] = await pool.execute(
        `SELECT 
          -- Recetas
          COUNT(DISTINCT r.id_receta) as total_recetas,
          COUNT(DISTINCT CASE WHEN r.fecha_creacion >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN r.id_receta END) as recetas_ultimo_mes,
          
          -- Favoritos
          COUNT(DISTINCT f.id_receta) as total_favoritos,
          (SELECT COUNT(*) FROM Favorito WHERE id_usuario = ?) as mis_favoritos,
          
          -- Actividad
          MAX(r.fecha_creacion) as ultima_receta_creada,
          MIN(r.fecha_creacion) as primera_receta_creada,
          DATEDIFF(NOW(), MIN(r.fecha_creacion)) as dias_activo,
          
          -- Categorías
          (SELECT COUNT(DISTINCT categoria) FROM Receta WHERE id_usuario = ?) as total_categorias
         FROM Usuario u
         LEFT JOIN Receta r ON u.id_usuario = r.id_usuario
         LEFT JOIN Favorito f ON u.id_usuario = f.id_usuario
         WHERE u.id_usuario = ?`,
        [id_usuario, id_usuario, id_usuario]
      );

      // Recetas por categoría
      const [categorias] = await pool.execute(
        `SELECT categoria, COUNT(*) as cantidad
         FROM Receta 
         WHERE id_usuario = ? 
         GROUP BY categoria 
         ORDER BY cantidad DESC`,
        [id_usuario]
      );

      // Evolución mensual de recetas creadas
      const [evolucion] = await pool.execute(
        `SELECT 
          DATE_FORMAT(fecha_creacion, '%Y-%m') as mes,
          COUNT(*) as recetas_creadas
         FROM Receta 
         WHERE id_usuario = ? 
         GROUP BY mes 
         ORDER BY mes DESC 
         LIMIT 6`,
        [id_usuario]
      );

      res.json({
        success: true,
        data: {
          resumen: estadisticas[0],
          categorias: categorias,
          evolucion_mensual: evolucion.reverse() // Ordenar de más antiguo a más reciente
        }
      });

    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor al obtener estadísticas'
      });
    }
  }
};

module.exports = userController;