const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateUserRegistration, handleValidationErrors } = require('../middleware/validation');

// Ruta para registro de usuarios
router.post('/register', 
  validateUserRegistration, 
  handleValidationErrors, 
  authController.register
);

// Ruta para obtener usuarios (solo desarrollo)
router.get('/users', authController.getUsers);

module.exports = router;