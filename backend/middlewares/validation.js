const { body, validationResult } = require('express-validator');

// Validaciones para registro de usuario
const validateUserRegistration = [
  body('nombre')
    .notEmpty().withMessage('El nombre es requerido')
    .isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres')
    .trim(),

  body('correo')
    .isEmail().withMessage('Debe ser un email válido')
    .normalizeEmail(),

  body('contraseña')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
    .matches(/\d/).withMessage('La contraseña debe contener al menos un número')
];

// Middleware para manejar errores de validación
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Errores de validación',
      errors: errors.array()
    });
  }
  next();
};

module.exports = {
  validateUserRegistration,
  handleValidationErrors
};