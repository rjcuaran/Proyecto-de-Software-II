// backend/routes/adminUnidadRoutes.js
const express = require("express");
const router = express.Router();

const adminUnidadController = require("../controllers/adminUnidadController");
const verificarToken = require("../middlewares/authMiddleware");
const checkAdmin = require("../middlewares/checkAdmin");

router.get("/", verificarToken, checkAdmin, adminUnidadController.obtenerTodas);
router.post("/", verificarToken, checkAdmin, adminUnidadController.crear);
router.put("/:id", verificarToken, checkAdmin, adminUnidadController.actualizar);
router.delete("/:id", verificarToken, checkAdmin, adminUnidadController.eliminar);

module.exports = router;
