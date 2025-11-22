const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadRecetaImage");

// Controladores
const {
  crearReceta,
  obtenerRecetas,
  obtenerRecetaPorId,
  actualizarReceta,
  obtenerCategorias,
} = require("../controllers/recetaController");

// ========================
// RUTAS DE RECETAS
// ========================

// Obtener todas las recetas del usuario
router.get("/", authMiddleware, obtenerRecetas);

// Obtener categorías
router.get("/categorias", authMiddleware, obtenerCategorias);

// Crear receta con imagen
router.post(
  "/",
  authMiddleware,
  upload.single("imagen"),
  crearReceta
);

// Obtener receta por ID
router.get("/:id", authMiddleware, obtenerRecetaPorId);

// 🔥 ACTUALIZAR receta usando POST (estable para imagen)
router.post(
  "/actualizar/:id",
  authMiddleware,
  upload.single("imagen"),
  actualizarReceta
);

module.exports = router;
