const express = require("express");
const router = express.Router();

const configuracionController = require("../controllers/configuracionController");
const verificarToken = require("../middlewares/authMiddleware");
const checkAdmin = require("../middlewares/checkAdmin");

// Obtener la configuración del sitio
router.get("/", verificarToken, checkAdmin, configuracionController.obtener);

// Actualizar configuración
router.put("/", verificarToken, checkAdmin, configuracionController.actualizar);

module.exports = router;
