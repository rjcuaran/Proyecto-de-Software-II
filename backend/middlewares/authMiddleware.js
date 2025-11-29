// backend/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

function verificarToken(req, res, next) {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
        return res.status(401).json({
            success: false,
            mensaje: 'Acceso denegado. Token no proporcionado.'
        });
    }

    const token = authHeader.startsWith('Bearer ')
        ? authHeader.substring(7)
        : authHeader;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Guardamos toda la info del usuario, incluyendo el role
        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role || "user",
        };

        next();
    } catch (error) {
        console.error('Error verificando token:', error);
        return res.status(401).json({
            success: false,
            mensaje: 'Token inválido o expirado.'
        });
    }
}

module.exports = verificarToken;







// Middleware para verificar rol de administrador
module.exports.isAdmin = function (req, res, next) {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({
            success: false,
            mensaje: "Acceso denegado. Se requiere rol de administrador."
        });
    }
    next();
};

