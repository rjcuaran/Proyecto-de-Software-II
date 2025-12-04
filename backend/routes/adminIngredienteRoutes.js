const express = require("express");
const router = express.Router();

const adminIngredienteController = require("../controllers/adminIngredienteController");
const verificarToken = require("../middlewares/authMiddleware");
const { isAdmin } = require("../middlewares/authMiddleware");

// INGREDIENTES PARA ADMIN

// Listar todos los ingredientes globales
router.get("/", verificarToken, isAdmin, adminIngredienteController.obtenerTodos);

// Crear ingrediente global
router.post("/", verificarToken, isAdmin, adminIngredienteController.crear);

/* 
------------------------------------------------------
⚠️ RUTAS ESPECÍFICAS DEBEN IR ANTES DE /:id
------------------------------------------------------
*/

// Aprobar ingrediente global
router.put("/:id/aprobar", verificarToken, isAdmin, adminIngredienteController.aprobar);

// Quitar aprobación
router.put("/:id/desaprobar", verificarToken, isAdmin, adminIngredienteController.desaprobar);

// Rechazar sugerencia
router.post("/:id/rechazar", verificarToken, isAdmin, adminIngredienteController.rechazar);

/* 
------------------------------------------------------
⚠️ ESTA VA DE ÚLTIMA SIEMPRE
------------------------------------------------------
*/

// Actualizar ingrediente global
router.put("/:id", verificarToken, isAdmin, adminIngredienteController.actualizar);

// Eliminar ingrediente global
router.delete("/:id", verificarToken, isAdmin, adminIngredienteController.eliminar);

module.exports = router;
