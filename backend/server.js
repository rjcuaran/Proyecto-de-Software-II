import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Rutas
import userRoutes from "./routes/userRoutes.js";
import recetaRoutes from "./routes/recetaRoutes.js";
import favoritosRoutes from "./routes/favoritosRoutes.js";
import shoppingListRoutes from "./routes/shoppingListRoutes.js"; // ✅ Asegúrate de incluir esta línea

// DB
import pool from "./config/db.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Rutas principales
app.use("/api/usuarios", userRoutes);
app.use("/api/recetas", recetaRoutes);
app.use("/api/favoritos", favoritosRoutes);
app.use("/api/shopping-list", shoppingListRoutes); // ✅ Aquí se activa la ruta

// Puerto
const PORT = process.env.PORT || 5000;

// Servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
