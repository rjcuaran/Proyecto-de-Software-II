// backend/controllers/userController.js
const db = require("../config/database");

const userController = {
  // Obtener perfil básico del usuario autenticado
  getProfile: (req, res) => {
    const userId = req.user.id;

    const sql =
      "SELECT id_usuario, nombre, correo, fecha_registro, avatar FROM usuario WHERE id_usuario = ?";

    db.query(sql, [userId], (error, results) => {
      if (error) {
        console.error("Error obteniendo perfil:", error);
        return res.status(500).json({
          success: false,
          message: "Error interno del servidor al obtener perfil",
        });
      }

      if (!results || results.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Usuario no encontrado",
        });
      }

      const usuario = results[0];

      return res.json({
        success: true,
        data: {
          id_usuario: usuario.id_usuario,
          nombre: usuario.nombre,
          correo: usuario.correo,
          fecha_registro: usuario.fecha_registro,
          avatar: usuario.avatar || null,
        },
      });
    });
  },

  // Actualizar nombre y correo del perfil
  updateProfile: (req, res) => {
    const userId = req.user.id;
    const { nombre, email } = req.body;

    if (!nombre || !email) {
      return res.status(400).json({
        success: false,
        message: "Nombre y correo son obligatorios",
      });
    }

    const sql =
      "UPDATE usuario SET nombre = ?, correo = ? WHERE id_usuario = ?";

    db.query(sql, [nombre, email, userId], (error) => {
      if (error) {
        console.error("Error actualizando perfil:", error);
        return res.status(500).json({
          success: false,
          message: "Error interno del servidor al actualizar perfil",
        });
      }

      return res.json({
        success: true,
        message: "Perfil actualizado exitosamente",
      });
    });
  },

  // Actualizar avatar (foto de perfil)
  updateAvatar: (req, res) => {
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No se ha enviado ninguna imagen",
      });
    }

    const avatarFilename = req.file.filename;

    const sql = "UPDATE usuario SET avatar = ? WHERE id_usuario = ?";

    db.query(sql, [avatarFilename, userId], (error) => {
      if (error) {
        console.error("Error actualizando avatar:", error);
        return res.status(500).json({
          success: false,
          message: "Error interno del servidor al actualizar avatar",
        });
      }

      return res.json({
        success: true,
        message: "Avatar actualizado exitosamente",
        avatar: avatarFilename,
      });
    });
  },
};

module.exports = userController;
