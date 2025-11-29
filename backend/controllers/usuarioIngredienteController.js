// backend/controllers/usuarioIngredienteController.js
const UsuarioIngrediente = require("../models/UsuarioIngrediente");

const usuarioIngredienteController = {

  // Buscar ingredientes (para autocompletar)
  buscar: (req, res) => {
    const { q } = req.query;

    if (!q || q.trim() === "") {
      return res.json({ success: true, data: [] });
    }

    UsuarioIngrediente.buscarPorNombre(q, (error, results) => {
      if (error) {
        console.error("Error buscando ingredientes:", error);
        return res.status(500).json({
          success: false,
          message: "Error interno"
        });
      }

      return res.json({ success: true, data: results });
    });
  },

  // Sugerir un ingrediente
  sugerir: (req, res) => {
    const { nombre } = req.body;
    const creadoPor = req.user.id;

    if (!nombre || nombre.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "El nombre es obligatorio"
      });
    }

    UsuarioIngrediente.sugerir(nombre.trim(), creadoPor, (error, result) => {
      if (error) {
        console.error("Error sugiriendo ingrediente:", error);
        return res.status(500).json({
          success: false,
          message: "Error interno"
        });
      }

      return res.status(201).json({
        success: true,
        message: "Ingrediente sugerido correctamente",
        id: result.insertId
      });
    });
  }
};

module.exports = usuarioIngredienteController;
