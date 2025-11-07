const jwt = require('jsonwebtoken');

const authMiddleware = {
    verificarToken: function(req, res, next) {
        const authHeader = req.header('Authorization');
        
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                mensaje: 'Acceso denegado. Token no proporcionado.'
            });
        }

        // Extraer el token (puede venir como "Bearer token" o solo "token")
        const token = authHeader.startsWith('Bearer ') 
            ? authHeader.substring(7) 
            : authHeader;

        if (!token) {
            return res.status(401).json({
                success: false,
                mensaje: 'Acceso denegado. Token no proporcionado.'
            });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next();
        } catch (error) {
            console.error('Error verificando token:', error);
            return res.status(401).json({
                success: false,
                mensaje: 'Token invalido o expirado.'
            });
        }
    }
};

module.exports = authMiddleware;