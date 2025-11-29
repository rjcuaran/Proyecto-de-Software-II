const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

// Rutas
const userRoutes = require("./routes/userRoutes");
const recetaRoutes = require("./routes/recetaRoutes");
const favoritosRoutes = require("./routes/favoritosRoutes");
const shoppingListRoutes = require("./routes/shoppingListRoutes");
const authRoutes = require("./routes/authRoutes");


// Rutas para administración de categorías
const categoriaRoutes = require("./routes/categoriaRoutes");
app.use("/api/admin/categorias", categoriaRoutes);



// DB
const db = require("./config/database");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Rutas principales
app.use("/api/auth", authRoutes);
app.use("/api/usuarios", userRoutes);
app.use("/api/recetas", recetaRoutes);
app.use("/api/favoritos", favoritosRoutes);
app.use("/api/shopping-list", shoppingListRoutes);
const adminCategoriaRoutes = require("./routes/adminCategoriaRoutes");
app.use("/api/admin/categorias", adminCategoriaRoutes);
const adminIngredienteRoutes = require("./routes/adminIngredienteRoutes");
app.use("/api/admin/ingredientes", adminIngredienteRoutes);
const adminUnidadRoutes = require("./routes/adminUnidadRoutes");
app.use("/api/admin/unidades", adminUnidadRoutes);
const configuracionRoutes = require("./routes/configuracionRoutes");
app.use("/api/admin/config", configuracionRoutes);
const adminUsuarioRoutes = require("./routes/adminUsuarioRoutes");
app.use("/api/admin/usuarios", adminUsuarioRoutes);



// Servir imágenes
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 🔥 CORRECCIÓN IMPORTANTE
// Antes servías '/uploads/usuarios', pero los avatares se guardan en '/uploads/avatars'
app.use(
  "/uploads/avatars",
  express.static(path.join(__dirname, "uploads/avatars"))
);

// Puerto
const PORT = process.env.PORT || 5000;

// Servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en el puerto ${PORT}`);
});
