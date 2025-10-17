const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { body } = require('express-validator');
const { handleValidationErrors } = require('../middleware/validation');

// Validaciones para actualizar perfil
const validateProfile = [
  body('nombre')
    .optional()
    .isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres')
    .trim(),
  body('correo')
    .optional()
    .isEmail().withMessage('Debe ser un email válido')
    .normalizeEmail(),
  body('nueva_contraseña')
    .optional()
    .isLength({ min: 6 }).withMessage('La nueva contraseña debe tener al menos 6 caracteres')
    .matches(/\d/).withMessage('La contraseña debe contener al menos un número')
];

// Aplicar authenticateToken individualmente a cada ruta
router.get('/profile', authenticateToken, userController.getProfile);
router.get('/estadisticas', authenticateToken, userController.getEstadisticas);
router.put('/profile', authenticateToken, validateProfile, handleValidationErrors, userController.updateProfile);

module.exports = router;