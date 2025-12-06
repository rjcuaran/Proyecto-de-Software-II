const express = require("express");
const router = express.Router();

const {
  obtenerConfiguracion,
  actualizarConfiguracion
} = require("../controllers/configuracionController");

const verificarToken = require("../middlewares/authMiddleware");
const { isAdmin } = require("../middlewares/authMiddleware");

const multer = require("multer");
const path = require("path");

// Almacenamiento físico del logo
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "..", "uploads/configuracion"));
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, "logo_" + unique + ext);
  }
});

const upload = multer({ storage });

// OBTENER CONFIGURACIÓN
router.get("/", verificarToken, isAdmin, obtenerConfiguracion);

// ACTUALIZAR CONFIGURACIÓN (archivo real)
router.put("/", verificarToken, isAdmin, upload.single("logo"), actualizarConfiguracion);

module.exports = router;
