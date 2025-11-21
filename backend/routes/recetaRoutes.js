const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadRecetaImage"); // <-- Multer agregado

// Controladores
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

// Crear receta CON IMAGEN
router.post(
  "/",
  authMiddleware,
  upload.single("imagen"),   // <-- aquí recibimos la imagen
  crearReceta
);

// Obtener receta por ID
router.get("/:id", authMiddleware, obtenerRecetaPorId);

module.exports = router;
