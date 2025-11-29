// backend/routes/adminUnidadRoutes.js
const express = require("express");
const router = express.Router();

const adminUnidadController = require("../controllers/adminUnidadController");
const verificarToken = require("../middlewares/authMiddleware");
const { isAdmin } = require("../middlewares/authMiddleware");

// RUTAS ADMINISTRATIVAS DE UNIDADES DE MEDIDA — SOLO ADMIN
router.get("/", verificarToken, isAdmin, adminUnidadController.obtenerTodas);
router.post("/", verificarToken, isAdmin, adminUnidadController.crear);
router.put("/:id", verificarToken, isAdmin, adminUnidadController.actualizar);
router.delete("/:id", verificarToken, isAdmin, adminUnidadController.eliminar);

module.exports = router;
