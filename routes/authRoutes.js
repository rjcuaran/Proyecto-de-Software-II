const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController'); // ← AGREGAR esta línea
const { validateUserRegistration, handleValidationErrors } = require('../middleware/validation');
const { authenticateToken } = require('../middleware/authMiddleware');
const { body } = require('express-validator');

// Validaciones para login
const validateLogin = [
  body('correo')
    .isEmail().withMessage('Debe ser un email válido')
    .normalizeEmail(),
  body('contraseña')
    .notEmpty().withMessage('La contraseña es requerida')
];

// Rutas públicas
router.post('/register', 
  validateUserRegistration, 
  handleValidationErrors, 
  authController.register
);

router.post('/login',
  validateLogin,
  handleValidationErrors,
  authController.login
);

// Rutas protegidas - CORREGIDAS
router.get('/profile', authenticateToken, userController.getProfile); // ← userController, no authController
router.get('/users', authController.getUsers); // Mantener pública para desarrollo

module.exports = router;