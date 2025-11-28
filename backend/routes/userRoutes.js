// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verificarToken = require('../middlewares/authMiddleware');
const uploadAvatar = require('../middlewares/uploadAvatarImage');

// ✅ Middleware de autenticación para todas las rutas de usuario
router.use(verificarToken);

// Obtener perfil del usuario
router.get('/profile', userController.getProfile);

// Actualizar datos básicos del perfil (nombre, correo)
router.put('/profile', userController.updateProfile);

// Actualizar avatar (foto de perfil)
router.put('/profile/avatar', uploadAvatar.single('avatar'), userController.updateAvatar);

module.exports = router;
