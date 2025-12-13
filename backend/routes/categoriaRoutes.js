const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');

// Obtener todas las categorías (PÚBLICO)
router.get('/', categoriaController.obtenerTodas);

// Las demás rutas sí pueden protegerse si lo deseas
router.get('/:idCategoria/recetas', categoriaController.obtenerRecetasPorCategoria);
router.get('/estadisticas/usuario', categoriaController.obtenerEstadisticasUsuario);
router.get('/buscar/:termino', categoriaController.buscarPorNombre);

module.exports = router;
