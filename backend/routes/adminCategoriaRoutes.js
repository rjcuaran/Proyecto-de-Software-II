const express = require("express");
const router = express.Router();

const adminCategoriaController = require("../controllers/adminCategoriaController");
const verificarToken = require("../middlewares/authMiddleware");
const { isAdmin } = require("../middlewares/authMiddleware");

// RUTAS ADMINISTRATIVAS — SOLO PARA SUPERUSUARIOS
router.get("/", verificarToken, isAdmin, adminCategoriaController.obtenerTodas);
router.post("/", verificarToken, isAdmin, adminCategoriaController.crear);
router.put("/:id", verificarToken, isAdmin, adminCategoriaController.actualizar);
router.delete("/:id", verificarToken, isAdmin, adminCategoriaController.eliminar);

module.exports = router;
