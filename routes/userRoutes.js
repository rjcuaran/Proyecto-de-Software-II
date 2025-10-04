const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');
const { body } = require('express-validator');
const { handleValidationErrors } = require('../middleware/validation');

// Validaciones para actualizar perfil
const validateProfile = [
  body('nombre')
    .optional()
    .isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres'),
  body('correo')
    .optional()
    .isEmail().withMessage('Debe ser un email válido')
];

router.use(authenticateToken);

router.get('/profile', userController.getProfile);
router.put('/profile', validateProfile, handleValidationErrors, userController.updateProfile);

module.exports = router;