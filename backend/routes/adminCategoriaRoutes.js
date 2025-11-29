const express = require("express");
const router = express.Router();

const adminCategoriaController = require("../controllers/adminCategoriaController");
const verificarToken = require("../middlewares/authMiddleware");
const checkAdmin = require("../middlewares/checkAdmin");

router.get("/", verificarToken, checkAdmin, adminCategoriaController.obtenerTodas);
router.post("/", verificarToken, checkAdmin, adminCategoriaController.crear);
router.put("/:id", verificarToken, checkAdmin, adminCategoriaController.actualizar);
router.delete("/:id", verificarToken, checkAdmin, adminCategoriaController.eliminar);

module.exports = router;
