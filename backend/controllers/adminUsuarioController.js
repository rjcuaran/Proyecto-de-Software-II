// backend/controllers/adminUsuarioController.js
const AdminUsuario = require("../models/AdminUsuario");

const adminUsuarioController = {
  obtenerTodos: (req, res) => {
    AdminUsuario.obtenerTodos((error, usuarios) => {
      if (error) {
        console.error("Error obteniendo usuarios:", error);
        return res.status(500).json({
          success: false,
          message: "Error interno"
        });
      }
      res.json({ success: true, data: usuarios });
    });
  },

  promoverAdmin: (req, res) => {
    const { id } = req.params;

    AdminUsuario.actualizarRol(id, "admin", (error) => {
      if (error) {
        console.error("Error actualizando rol:", error);
        return res.status(500).json({
          success: false,
          message: "Error actualizando rol"
        });
      }

      res.json({
        success: true,
        message: "Usuario promovido a administrador"
      });
    });
  },

  quitarAdmin: (req, res) => {
    const { id } = req.params;

    AdminUsuario.actualizarRol(id, "user", (error) => {
      if (error) {
        console.error("Error actualizando rol:", error);
        return res.status(500).json({
          success: false,
          message: "Error actualizando rol"
        });
      }

      res.json({
        success: true,
        message: "El usuario ya no es administrador"
      });
    });
  },

  activar: (req, res) => {
    const { id } = req.params;
    AdminUsuario.actualizarEstado(id, true, (error) => {
      if (error) {
        console.error("Error activando usuario:", error);
        return res.status(500).json({
          success: false,
          message: "Error interno"
        });
      }

      res.json({
        success: true,
        message: "Usuario activado correctamente"
      });
    });
  },

  desactivar: (req, res) => {
    const { id } = req.params;
    AdminUsuario.actualizarEstado(id, false, (error) => {
      if (error) {
        console.error("Error desactivando usuario:", error);
        return res.status(500).json({
          success: false,
          message: "Error interno"
        });
      }

      res.json({
        success: true,
        message: "Usuario desactivado correctamente"
      });
    });
  },
};

module.exports = adminUsuarioController;
