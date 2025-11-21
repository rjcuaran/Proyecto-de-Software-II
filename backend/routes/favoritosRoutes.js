const express = require('express');
const router = express.Router();
const favoritosController = require('../controllers/favoritosController');
const authMiddleware = require('../middlewares/authMiddleware');

// ✅ Corregido
router.use(authMiddleware);

// Agregar receta a favoritos
router.post('/:idReceta', favoritosController.agregarFavorito);

// Eliminar receta de favoritos
router.delete('/:idReceta', favoritosController.eliminarFavorito);

// Obtener favoritos del usuario
router.get('/', favoritosController.obtenerFavoritos);

// Verificar si una receta es favorita
router.get('/:idReceta/check', favoritosController.verificarFavorito);

module.exports = router;
