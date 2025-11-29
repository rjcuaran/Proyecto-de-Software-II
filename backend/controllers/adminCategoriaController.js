// backend/controllers/adminCategoriaController.js
const AdminCategoria = require("../models/AdminCategoria");

const adminCategoriaController = {
  obtenerTodas: (req, res) => {
    AdminCategoria.obtenerTodas((error, results) => {
      if (error) {
        console.error("Error obteniendo categorías:", error);
        return res.status(500).json({ success: false, message: "Error interno del servidor" });
      }

      res.json({ success: true, data: results });
    });
  },

  crear: (req, res) => {
    const { nombre } = req.body;

    if (!nombre) {
      return res.status(400).json({ success: false, message: "El nombre es obligatorio" });
    }

    AdminCategoria.crear(nombre, (error, result) => {
      if (error) {
        console.error("Error creando categoría:", error);
        return res.status(500).json({ success: false, message: "Error interno del servidor" });
      }

      res.status(201).json({
        success: true,
        message: "Categoría creada",
        id: result.insertId,
      });
    });
  },

  actualizar: (req, res) => {
    const { id } = req.params;
    const { nombre } = req.body;

    if (!nombre) {
      return res.status(400).json({ success: false, message: "El nombre es obligatorio" });
    }

    AdminCategoria.actualizar(id, nombre, (error) => {
      if (error) {
        console.error("Error actualizando categoría:", error);
        return res.status(500).json({ success: false, message: "Error interno del servidor" });
      }

      res.json({ success: true, message: "Categoría actualizada" });
    });
  },

  eliminar: (req, res) => {
    const { id } = req.params;

    AdminCategoria.eliminar(id, (error) => {
      if (error) {
        console.error("Error eliminando categoría:", error);
        return res.status(500).json({ success: false, message: "Error interno del servidor" });
      }

      res.json({ success: true, message: "Categoría eliminada" });
    });
  },
};

module.exports = adminCategoriaController;
