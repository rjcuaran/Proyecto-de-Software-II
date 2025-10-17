const express = require('express');
const router = express.Router();
const recetaController = require('../controllers/recetaController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { body, query, param } = require('express-validator');
const { handleValidationErrors } = require('../middleware/validation');

// Validaciones para crear/actualizar receta
const validateReceta = [
  body('nombre')
    .notEmpty().withMessage('El nombre de la receta es requerido')
    .isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres'),
  body('categoria')
    .notEmpty().withMessage('La categoría es requerida'),
  body('descripcion')
    .optional()
    .isLength({ max: 500 }).withMessage('La descripción no puede exceder 500 caracteres'),
  body('preparacion')
    .notEmpty().withMessage('La preparación es requerida'),
  body('ingredientes')
    .isArray({ min: 1 }).withMessage('Debe incluir al menos un ingrediente'),
  body('ingredientes.*.nombre')
    .notEmpty().withMessage('El nombre del ingrediente es requerido'),
  body('ingredientes.*.cantidad')
    .isNumeric().withMessage('La cantidad debe ser un número')
];

// Validaciones para búsqueda
const validateSearch = [
  query('q')
    .optional()
    .isLength({ min: 2 }).withMessage('El término de búsqueda debe tener al menos 2 caracteres'),
  query('categoria')
    .optional()
    .isLength({ min: 2 }).withMessage('La categoría debe tener al menos 2 caracteres')
];

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// CRUD Completo de Recetas
router.post('/', validateReceta, handleValidationErrors, recetaController.create);
router.get('/', recetaController.getAll);
router.get('/search', validateSearch, handleValidationErrors, recetaController.search);
router.get('/:id', [
  param('id').isInt({ min: 1 }).withMessage('ID de receta inválido')
], handleValidationErrors, recetaController.getById);
router.put('/:id', [
  param('id').isInt({ min: 1 }).withMessage('ID de receta inválido'),
  ...validateReceta
], handleValidationErrors, recetaController.update);
router.delete('/:id', [
  param('id').isInt({ min: 1 }).withMessage('ID de receta inválido')
], handleValidationErrors, recetaController.delete);

module.exports = router;