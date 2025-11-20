const express = require('express');
const router = express.Router();
const recetaController = require('../controllers/recetaController');
const authMiddleware = require('../middleware/authMiddleware');

// ✅ Corregido
router.use(authMiddleware);

// Rutas de recetas
router.get('/', recetaController.obtenerRecetas);
router.get('/search', recetaController.buscarRecetas);
router.get('/:id', recetaController.obtenerRecetaPorId);
router.post('/', recetaController.crearReceta);
router.put('/:id', recetaController.actualizarReceta);
router.delete('/:id', recetaController.eliminarReceta);

module.exports = router;
