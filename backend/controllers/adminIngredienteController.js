// backend/controllers/adminIngredienteController.js
const AdminIngrediente = require("../models/AdminIngrediente");

const adminIngredienteController = {
  obtenerTodos: (req, res) => {
    AdminIngrediente.obtenerTodos((error, results) => {
      if (error) {
        console.error("Error obteniendo ingredientes:", error);
        return res.status(500).json({
          success: false,
          message: "Error obteniendo ingredientes",
        });
      }
      return res.json({ success: true, data: results });
    });
  },

  obtenerPendientes: (req, res) => {
    AdminIngrediente.obtenerPendientes((error, results) => {
      if (error) {
        console.error("Error obteniendo pendientes:", error);
        return res.status(500).json({
          success: false,
          message: "Error obteniendo sugerencias",
        });
      }
      return res.json({ success: true, data: results });
    });
  },

  crear: (req, res) => {
    const { nombre } = req.body;
    const creadoPor = req.user.id;

    if (!nombre) {
      return res.status(400).json({
        success: false,
        message: "El nombre es obligatorio",
      });
    }

    AdminIngrediente.crear(nombre, creadoPor, (error, result) => {
      if (error) {
        console.error("Error creando ingrediente:", error);
        return res.status(500).json({
          success: false,
          message: "Error creando ingrediente",
        });
      }

      res.status(201).json({
        success: true,
        message: "Ingrediente creado correctamente",
        id: result.insertId,
      });
    });
  },

  aprobar: (req, res) => {
    const { id } = req.params;

    AdminIngrediente.aprobar(id, (error) => {
      if (error) {
        console.error("Error aprobando ingrediente:", error);
        return res.status(500).json({
          success: false,
          message: "Error aprobando ingrediente",
        });
      }

      res.json({
        success: true,
        message: "Ingrediente aprobado",
      });
    });
  },

  rechazar: (req, res) => {
    const { id } = req.params;

    AdminIngrediente.rechazar(id, (error) => {
      if (error) {
        console.error("Error eliminando sugerencia:", error);
        return res.status(500).json({
          success: false,
          message: "Error eliminando sugerencia",
        });
      }

      res.json({
        success: true,
        message: "Ingrediente rechazado y eliminado",
      });
    });
  },

  actualizar: (req, res) => {
    const { id } = req.params;
    const { nombre } = req.body;

    if (!nombre) {
      return res.status(400).json({
        success: false,
        message: "El nombre es obligatorio",
      });
    }

    AdminIngrediente.actualizar(id, nombre, (error) => {
      if (error) {
        console.error("Error actualizando ingrediente:", error);
        return res.status(500).json({
          success: false,
          message: "Error actualizando ingrediente",
        });
      }

      res.json({
        success: true,
        message: "Ingrediente actualizado",
      });
    });
  },

  eliminar: (req, res) => {
    const { id } = req.params;

    AdminIngrediente.eliminar(id, (error) => {
      if (error) {
        console.error("Error eliminando ingrediente:", error);
        return res.status(500).json({
          success: false,
          message: "Error eliminando ingrediente",
        });
      }

      res.json({
        success: true,
        message: "Ingrediente eliminado",
      });
    });
  },
};

module.exports = adminIngredienteController;
