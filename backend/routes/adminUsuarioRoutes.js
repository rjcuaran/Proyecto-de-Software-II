const express = require("express");
const router = express.Router();

const adminUsuarioController = require("../controllers/adminUsuarioController");
const verificarToken = require("../middlewares/authMiddleware");
const { isAdmin } = require("../middlewares/authMiddleware");

// ==============================
// RUTAS ADMINISTRATIVAS DE USUARIOS
// ==============================

// Obtener usuarios NO eliminados
router.get("/", verificarToken, isAdmin, adminUsuarioController.obtenerTodos);

// Promover admin
router.post("/:id/promover", verificarToken, isAdmin, adminUsuarioController.promoverAdmin);

// Quitar admin
router.post("/:id/quitar-admin", verificarToken, isAdmin, adminUsuarioController.quitarAdmin);

// Activar usuario
router.post("/:id/activar", verificarToken, isAdmin, adminUsuarioController.activar);

// Desactivar usuario
router.post("/:id/desactivar", verificarToken, isAdmin, adminUsuarioController.desactivar);

// Crear usuario
router.post("/crear", verificarToken, isAdmin, adminUsuarioController.crearUsuario);

// Editar usuario
router.put("/:id", verificarToken, isAdmin, adminUsuarioController.editarUsuario);

// Reset password
router.patch("/:id/reset-password", verificarToken, isAdmin, adminUsuarioController.resetearPassword);

// Eliminación lógica
router.delete("/:id", verificarToken, isAdmin, adminUsuarioController.eliminarUsuario);

// Restaurar usuario
router.post("/:id/restaurar", verificarToken, isAdmin, adminUsuarioController.restaurarUsuario);

module.exports = router;
