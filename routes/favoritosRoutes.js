const express = require('express');
const router = express.Router();
const favoritosController = require('../controllers/favoritosController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { param } = require('express-validator');
const { handleValidationErrors } = require('../middleware/validation');

// Validaciones para el parámetro idReceta
const validateIdReceta = [
  param('idReceta')
    .isInt({ min: 1 })
    .withMessage('El ID de receta debe ser un número válido')
    .toInt(),
  handleValidationErrors
];

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Agregar receta a favoritos
router.post('/:idReceta', validateIdReceta, favoritosController.addFavorito);

// Eliminar receta de favoritos
router.delete('/:idReceta', validateIdReceta, favoritosController.removeFavorito);

// Obtener todas las recetas favoritas del usuario
router.get('/', favoritosController.getFavoritos);

// Verificar si una receta específica es favorita
router.get('/:idReceta/check', validateIdReceta, favoritosController.checkFavorito);

module.exports = router;