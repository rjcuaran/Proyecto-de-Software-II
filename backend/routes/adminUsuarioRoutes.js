// backend/routes/adminUsuarioRoutes.js
const express = require("express");
const router = express.Router();

const adminUsuarioController = require("../controllers/adminUsuarioController");
const verificarToken = require("../middlewares/authMiddleware");
const { isAdmin } = require("../middlewares/authMiddleware");

// RUTAS ADMINISTRATIVAS DE USUARIOS
router.get("/", verificarToken, isAdmin, adminUsuarioController.obtenerTodos);

router.post("/:id/promover", verificarToken, isAdmin, adminUsuarioController.promoverAdmin);

router.post("/:id/quitar-admin", verificarToken, isAdmin, adminUsuarioController.quitarAdmin);

router.post("/:id/activar", verificarToken, isAdmin, adminUsuarioController.activar);

router.post("/:id/desactivar", verificarToken, isAdmin, adminUsuarioController.desactivar);

module.exports = router;
