const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Todas las rutas requieren autenticación
router.use(authMiddleware.verificarToken);

// Obtener perfil del usuario
router.get('/profile', userController.getProfile);

// Actualizar perfil del usuario
router.put('/profile', userController.updateProfile);

module.exports = router;