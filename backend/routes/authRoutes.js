const express = require("express");
const router = express.Router();

const {
  login,
  registrar,
  forgotPassword,
  resetPassword,
  verificarToken,
} = require("../controllers/authController");

// Login
router.post("/login", login);

// Registro
router.post("/register", registrar);

// Verificar token
router.get("/verify", verificarToken);

// Recuperación de contraseña (simple)
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;
