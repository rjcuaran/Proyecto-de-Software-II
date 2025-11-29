// backend/controllers/adminUnidadController.js
const AdminUnidad = require("../models/AdminUnidad");

const adminUnidadController = {
  obtenerTodas: (req, res) => {
    AdminUnidad.obtenerTodas((error, results) => {
      if (error) {
        console.error("Error obteniendo unidades:", error);
        return res.status(500).json({
          success: false,
          message: "Error obteniendo unidades"
        });
      }

      return res.json({ success: true, data: results });
    });
  },

  crear: (req, res) => {
    const { nombre, abreviatura } = req.body;

    if (!nombre || !abreviatura) {
      return res.status(400).json({
        success: false,
        message: "Nombre y abreviatura son obligatorios"
      });
    }

    AdminUnidad.crear(nombre, abreviatura, (error, result) => {
      if (error) {
        console.error("Error creando unidad:", error);
        return res.status(500).json({
          success: false,
          message: "Error creando unidad"
        });
      }

      res.status(201).json({
        success: true,
        message: "Unidad creada",
        id: result.insertId
      });
    });
  },

  actualizar: (req, res) => {
    const { id } = req.params;
    const { nombre, abreviatura } = req.body;

    if (!nombre || !abreviatura) {
      return res.status(400).json({
        success: false,
        message: "Nombre y abreviatura son obligatorios"
      });
    }

    AdminUnidad.actualizar(id, nombre, abreviatura, (error) => {
      if (error) {
        console.error("Error actualizando unidad:", error);
        return res.status(500).json({
          success: false,
          message: "Error actualizando unidad"
        });
      }

      res.json({
        success: true,
        message: "Unidad actualizada"
      });
    });
  },

  eliminar: (req, res) => {
    const { id } = req.params;

    AdminUnidad.eliminar(id, (error) => {
      if (error) {
        console.error("Error eliminando unidad:", error);
        return res.status(500).json({
          success: false,
          message: "Error eliminando unidad"
        });
      }

      res.json({
        success: true,
        message: "Unidad eliminada"
      });
    });
  }
};

module.exports = adminUnidadController;
