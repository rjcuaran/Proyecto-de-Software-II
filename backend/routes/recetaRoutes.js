const express = require("express");
const router = express.Router();
const { crearReceta, obtenerRecetaPorId } = require("../controllers/recetaController");
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);

// Crear receta con ingredientes
router.post("/", crearReceta);

// Obtener receta con sus ingredientes
router.get("/:id", obtenerRecetaPorId);

module.exports = router;
