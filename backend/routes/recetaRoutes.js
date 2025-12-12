const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadRecetaImage"); // <-- Multer
const { generarRecetaPdf } = require("../controllers/recetaPdfController");


// Controladores
const {
  crearReceta,
  obtenerRecetas,
  obtenerRecetaPorId,
  actualizarReceta,
  obtenerCategorias,
  eliminarReceta, // ✅ NUEVO
} = require("../controllers/recetaController");

// ========================
// RUTAS DE RECETAS
// ========================

router.get("/:id/pdf", authMiddleware, generarRecetaPdf);


// Obtener todas las recetas del usuario
router.get("/", authMiddleware, obtenerRecetas);

// Obtener listado de categorías disponibles
router.get("/categorias", authMiddleware, obtenerCategorias);

// Crear receta CON IMAGEN
router.post(
  "/",
  authMiddleware,
  upload.single("imagen"),   // <-- aquí recibimos la imagen
  crearReceta
);

// 📄 Descargar receta en PDF (AUTOMÁTICO)
router.get("/:id/pdf", authMiddleware, generarRecetaPdf);


// Obtener receta por ID
router.get("/:id", authMiddleware, obtenerRecetaPorId);

// Actualizar receta (con opción de nueva imagen)
router.put(
  "/:id",
  authMiddleware,
  upload.single("imagen"),
  actualizarReceta
);

// ✅ Eliminar receta (incluye ingredientes y, si aplica, la imagen física)
router.delete("/:id", authMiddleware, eliminarReceta);

module.exports = router;
