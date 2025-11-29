// backend/controllers/configuracionController.js
const Configuracion = require("../models/Configuracion");

const configuracionController = {
  obtener: (req, res) => {
    Configuracion.obtener((error, results) => {
      if (error) {
        console.error("Error obteniendo configuración:", error);
        return res.status(500).json({
          success: false,
          message: "Error obteniendo configuración"
        });
      }

      return res.json({ success: true, data: results[0] });
    });
  },

  actualizar: (req, res) => {
    const {
      logo,
      color_primario,
      color_secundario,
      color_terciario,
      footer_texto,
      link_facebook,
      link_instagram,
      link_youtube
    } = req.body;

    const datos = {
      logo: logo || null,
      color_primario,
      color_secundario,
      color_terciario,
      footer_texto,
      link_facebook,
      link_instagram,
      link_youtube,
    };

    Configuracion.actualizar(datos, (error) => {
      if (error) {
        console.error("Error actualizando configuración:", error);
        return res.status(500).json({
          success: false,
          message: "Error actualizando configuración"
        });
      }

      return res.json({
        success: true,
        message: "Configuración actualizada"
      });
    });
  },
};

module.exports = configuracionController;
