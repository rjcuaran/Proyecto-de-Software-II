// routes/shoppingListRoutes.js
import express from "express";
import { generarListaCompra } from "../controllers/shoppingListController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Requiere usuario autenticado para generar lista
router.post("/", authMiddleware, generarListaCompra);

export default router;
