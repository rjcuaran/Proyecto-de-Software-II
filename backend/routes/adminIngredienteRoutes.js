// backend/routes/adminIngredienteRoutes.js
const express = require("express");
const router = express.Router();

const adminIngredienteController = require("../controllers/adminIngredienteController");
const verificarToken = require("../middlewares/authMiddleware");
const checkAdmin = require("../middlewares/checkAdmin");

// INGREDIENTES PARA ADMIN
router.get("/", verificarToken, checkAdmin, adminIngredienteController.obtenerTodos);
router.get("/pendientes", verificarToken, checkAdmin, adminIngredienteController.obtenerPendientes);
router.post("/", verificarToken, checkAdmin, adminIngredienteController.crear);
router.put("/:id", verificarToken, checkAdmin, adminIngredienteController.actualizar);
router.delete("/:id", verificarToken, checkAdmin, adminIngredienteController.eliminar);

// Para aprobar o rechazar sugerencias
router.post("/:id/aprobar", verificarToken, checkAdmin, adminIngredienteController.aprobar);
router.post("/:id/rechazar", verificarToken, checkAdmin, adminIngredienteController.rechazar);

module.exports = router;
