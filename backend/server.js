const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

// Rutas
const userRoutes = require("./routes/userRoutes");
const recetaRoutes = require("./routes/recetaRoutes");
const favoritosRoutes = require("./routes/favoritosRoutes");
const shoppingListRoutes = require("./routes/shoppingListRoutes");
const authRoutes = require("./routes/authRoutes"); // ✅ ← Nueva línea

// DB
const db = require("./config/database");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Rutas principales
app.use("/api/auth", authRoutes); // ✅ ← Nueva línea
app.use("/api/usuarios", userRoutes);
app.use("/api/recetas", recetaRoutes);
app.use("/api/favoritos", favoritosRoutes);
app.use("/api/shopping-list", shoppingListRoutes);

// Puerto
const PORT = process.env.PORT || 5000;

// Servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en el puerto ${PORT}`);
});
