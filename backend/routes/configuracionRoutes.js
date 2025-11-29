const express = require("express");
const router = express.Router();

const configuracionController = require("../controllers/configuracionController");
const verificarToken = require("../middlewares/authMiddleware");
const { isAdmin } = require("../middlewares/authMiddleware");

// Obtener la configuración del sitio
router.get("/", verificarToken, isAdmin, configuracionController.obtener);

// Actualizar configuración
router.put("/", verificarToken, isAdmin, configuracionController.actualizar);

module.exports = router;
