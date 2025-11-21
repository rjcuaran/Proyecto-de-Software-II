const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');
const authMiddleware = require('../middlewares/authMiddleware');

// ✅ Corregido
router.use(authMiddleware);

// Obtener todas las categorías
router.get('/', categoriaController.obtenerTodas);

// Obtener recetas por categoría
router.get('/:idCategoria/recetas', categoriaController.obtenerRecetasPorCategoria);

// Obtener estadísticas de categorías del usuario
router.get('/estadisticas/usuario', categoriaController.obtenerEstadisticasUsuario);

// Buscar categorías
router.get('/buscar/:termino', categoriaController.buscarPorNombre);

module.exports = router;
