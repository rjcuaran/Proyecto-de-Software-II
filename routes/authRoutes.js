const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateUserRegistration, handleValidationErrors } = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');
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

// Rutas protegidas
router.get('/profile', authenticateToken, authController.getProfile);
router.get('/users', authController.getUsers); // Mantener pública para desarrollo

module.exports = router;