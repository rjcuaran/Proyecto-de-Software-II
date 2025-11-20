const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verificarToken = require('../middleware/authMiddleware'); // ✅ Importamos directamente la función

// ✅ Middleware de autenticación
router.use(verificarToken);

// Obtener perfil del usuario
router.get('/profile', userController.getProfile);

// Actualizar perfil del usuario
router.put('/profile', userController.updateProfile);

module.exports = router;
