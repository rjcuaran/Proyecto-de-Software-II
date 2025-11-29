// backend/routes/adminUsuarioRoutes.js
const express = require("express");
const router = express.Router();

const adminUsuarioController = require("../controllers/adminUsuarioController");
const verificarToken = require("../middlewares/authMiddleware");
const checkAdmin = require("../middlewares/checkAdmin");

router.get("/", verificarToken, checkAdmin, adminUsuarioController.obtenerTodos);

router.post("/:id/promover", verificarToken, checkAdmin, adminUsuarioController.promoverAdmin);

router.post("/:id/quitar-admin", verificarToken, checkAdmin, adminUsuarioController.quitarAdmin);

router.post("/:id/activar", verificarToken, checkAdmin, adminUsuarioController.activar);

router.post("/:id/desactivar", verificarToken, checkAdmin, adminUsuarioController.desactivar);

module.exports = router;
