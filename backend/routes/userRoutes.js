const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// ✅ Corregido
router.use(authMiddleware);

// Obtener perfil del usuario
router.get('/profile', userController.getProfile);

// Actualizar perfil del usuario
router.put('/profile', userController.updateProfile);

module.exports = router;
