// backend/middlewares/checkAdmin.js
function checkAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Acceso denegado. Solo administradores.",
    });
  }
  next();
}

module.exports = checkAdmin;
