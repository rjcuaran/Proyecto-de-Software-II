// backend/routes/usuarioIngredienteRoutes.js
const express = require("express");
const router = express.Router();

const usuarioIngredienteController = require("../controllers/usuarioIngredienteController");
const verificarToken = require("../middlewares/authMiddleware");

// Buscar ingrediente (autocompletar)
router.get("/buscar", verificarToken, usuarioIngredienteController.buscar);

// Sugerir nuevo ingrediente
router.post("/sugerir", verificarToken, usuarioIngredienteController.sugerir);

module.exports = router;
