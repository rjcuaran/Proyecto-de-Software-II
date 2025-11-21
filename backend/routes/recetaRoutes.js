const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

// Importar controladores CORRECTAMENTE
const {
  crearReceta,
  obtenerRecetas,
  obtenerRecetaPorId,
} = require("../controllers/recetaController");

// ========================
// RUTAS DE RECETAS
// ========================

// Obtener todas las recetas del usuario
router.get("/", authMiddleware, obtenerRecetas);

// Crear receta
router.post("/", authMiddleware, crearReceta);

// Obtener receta por ID
router.get("/:id", authMiddleware, obtenerRecetaPorId);

module.exports = router;
