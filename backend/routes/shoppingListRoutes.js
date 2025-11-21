const express = require('express');
const router = express.Router();
const { generarListaCompra } = require('../controllers/shoppingListController');
const authMiddleware = require('../middlewares/authMiddleware');

// ✅ Requiere usuario autenticado para generar lista
router.post('/', authMiddleware, generarListaCompra);

module.exports = router;
