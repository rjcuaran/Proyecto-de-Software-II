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
        req.user = decoded;
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
