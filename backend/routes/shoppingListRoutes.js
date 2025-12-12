const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

const {
  obtenerListaCompra,
  toggleItemComprado,
  agregarIngredientesReceta,
  generarListaCompra,
  agregarMultiple,
  limpiarLista,
  exportarExcel // 👈 ESTA LÍNEA DEBE EXISTIR
} = require("../controllers/shoppingListController");




// Obtener lista
router.get("/", authMiddleware, obtenerListaCompra);

// Generar lista completa (reemplaza todo)
router.post("/generar", authMiddleware, generarListaCompra);

// Agregar ingredientes de una receta individual
router.post("/agregar", authMiddleware, agregarIngredientesReceta);

// Agregar múltiples recetas (selección múltiple premium)
router.post("/agregar-multiple", authMiddleware, agregarMultiple);

// Toggle comprado
router.patch("/:id/toggle", authMiddleware, toggleItemComprado);

// Limpiar lista de compras
router.delete("/limpiar", authMiddleware, limpiarLista);


// Exportar lista de compras a Excel
router.get("/exportar-excel", authMiddleware, exportarExcel);




module.exports = router;
