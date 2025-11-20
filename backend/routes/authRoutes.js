const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Ruta de registro (pública)
router.post('/register', authController.registrar);

// Ruta de login (pública)  
router.post('/login', authController.login);

// Ruta para verificar token (protegida)
router.get('/verify', authMiddleware, (req, res) => {
    res.json({
        success: true,
        mensaje: 'Token válido',
        user: req.user
    });
});

module.exports = router;