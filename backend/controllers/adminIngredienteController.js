const AdminIngrediente = require("../models/AdminIngrediente");

const adminIngredienteController = {
  obtenerTodos: (req, res) => {
    AdminIngrediente.obtenerTodos((error, resultados) => {
      if (error) {
        console.error("Error obteniendo ingredientes:", error);
        return res.status(500).json({
          success: false,
          message: "Error obteniendo ingredientes",
        });
      }

      res.json({
        success: true,
        data: resultados,
      });
    });
  },

  crear: (req, res) => {
    const { nombre } = req.body;
    const usuario = req.user ? req.user.nombre || req.user.id_usuario : null;

    if (!nombre) {
      return res.status(400).json({
        success: false,
        message: "El nombre del ingrediente es obligatorio",
      });
    }

    AdminIngrediente.buscarExacto(nombre, (error, resultados) => {
      if (error) {
        console.error("Error verificando duplicado:", error);
        return res.status(500).json({
          success: false,
          message: "Error al verificar duplicado",
        });
      }

      if (resultados.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Este ingrediente ya existe",
        });
      }

      AdminIngrediente.crear(nombre, usuario, (err, resultado) => {
        if (err) {
          console.error("Error creando ingrediente:", err);
          return res.status(500).json({
            success: false,
            message: "Error creando ingrediente",
          });
        }

        res.json({
          success: true,
          message: "Ingrediente creado correctamente",
          id: resultado.insertId,
        });
      });
    });
  },

  actualizar: (req, res) => {
    const { id } = req.params;
    const { nombre } = req.body;

    if (!nombre) {
      return res.status(400).json({
        success: false,
        message: "El nombre del ingrediente es obligatorio",
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
        message: "Ingrediente actualizado correctamente",
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
        message: "Ingrediente eliminado correctamente",
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

  desaprobar: (req, res) => {
    const { id } = req.params;

    AdminIngrediente.desaprobar(id, (error) => {
      if (error) {
        console.error("Error quitando aprobación:", error);
        return res.status(500).json({
          success: false,
          message: "Error quitando aprobación del ingrediente",
        });
      }

      res.json({
        success: true,
        message: "Aprobación eliminada",
      });
    });
  },

  rechazar: (req, res) => {
    const { id } = req.params;

    AdminIngrediente.rechazar(id, (error) => {
      if (error) {
        console.error("Error rechazando ingrediente:", error);
        return res.status(500).json({
          success: false,
          message: "Error rechazando ingrediente",
        });
      }

      res.json({
        success: true,
        message: "Ingrediente rechazado",
      });
    });
  },
};

module.exports = adminIngredienteController;
