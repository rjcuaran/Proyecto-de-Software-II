// backend/controllers/adminCategoriaController.js
const AdminCategoria = require("../models/AdminCategoria");

const adminCategoriaController = {
  // GET /api/admin/categorias
  obtenerTodas: (req, res) => {
    AdminCategoria.obtenerTodas((error, results) => {
      if (error) {
        console.error("Error obteniendo categorías:", error);
        return res
          .status(500)
          .json({ success: false, message: "Error interno del servidor" });
      }

      return res.json({ success: true, data: results });
    });
  },

  // POST /api/admin/categorias
  crear: (req, res) => {
    const { nombre } = req.body;

    if (!nombre || !nombre.trim()) {
      return res.status(400).json({
        success: false,
        message: "El nombre de la categoría es obligatorio",
      });
    }

    AdminCategoria.crear(nombre.trim(), (error, result) => {
      if (error) {
        console.error("Error creando categoría:", error);

        // Duplicado por restricción UNIQUE
        if (error.code === "ER_DUP_ENTRY") {
          return res.status(400).json({
            success: false,
            message: "Esta categoría ya existe",
          });
        }

        return res
          .status(500)
          .json({ success: false, message: "Error interno del servidor" });
      }

      return res.json({
        success: true,
        message: "Categoría creado correctamente",
        id: result.insertId,
      });
    });
  },

  // PUT /api/admin/categorias/:id
  actualizar: (req, res) => {
    const { id } = req.params;
    const { nombre } = req.body;

    if (!nombre || !nombre.trim()) {
      return res.status(400).json({
        success: false,
        message: "El nombre de la categoría es obligatorio",
      });
    }

    AdminCategoria.actualizar(id, nombre.trim(), (error, result) => {
      if (error) {
        console.error("Error actualizando categoría:", error);

        if (error.code === "ER_DUP_ENTRY") {
          return res.status(400).json({
            success: false,
            message: "Esta categoría ya existe",
          });
        }

        return res
          .status(500)
          .json({ success: false, message: "Error interno del servidor" });
      }

      return res.json({
        success: true,
        message: "Categoría actualizada correctamente",
      });
    });
  },

  // DELETE /api/admin/categorias/:id
  eliminar: (req, res) => {
    const { id } = req.params;

    AdminCategoria.eliminar(id, (error, result) => {
      if (error) {
        console.error("Error eliminando categoría:", error);
        return res
          .status(500)
          .json({ success: false, message: "Error interno del servidor" });
      }

      return res.json({
        success: true,
        message: "Categoría eliminada correctamente",
      });
    });
  },
};

module.exports = adminCategoriaController;
