// backend/server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

// Base de datos
const db = require("./config/database");

dotenv.config();

const app = express();
app.use(cors());

// Aumentar límite máximo de JSON y formularios
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ==========================
//   RUTAS PÚBLICAS
// ==========================
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const recetaRoutes = require("./routes/recetaRoutes");
const favoritosRoutes = require("./routes/favoritosRoutes");
const shoppingListRoutes = require("./routes/shoppingListRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/usuarios", userRoutes);
app.use("/api/recetas", recetaRoutes);
app.use("/api/favoritos", favoritosRoutes);
app.use("/api/shopping-list", shoppingListRoutes);

// ==========================
//   RUTAS ADMIN
// ==========================
const adminCategoriaRoutes = require("./routes/adminCategoriaRoutes");
app.use("/api/admin/categorias", adminCategoriaRoutes);

const adminIngredienteRoutes = require("./routes/adminIngredienteRoutes");
app.use("/api/admin/ingredientes", adminIngredienteRoutes);

const adminUnidadRoutes = require("./routes/adminUnidadRoutes");
app.use("/api/admin/unidades", adminUnidadRoutes);

// Configuración del sitio
const configuracionRoutes = require("./routes/configuracionRoutes");
app.use("/api/configuracion", configuracionRoutes);

// Usuarios Admin
const adminUsuarioRoutes = require("./routes/adminUsuarioRoutes");
app.use("/api/admin/usuarios", adminUsuarioRoutes);

// ==========================
//   INGREDIENTES DE USUARIO
// ==========================
const usuarioIngredienteRoutes = require("./routes/usuarioIngredienteRoutes");
app.use("/api/ingredientes", usuarioIngredienteRoutes);

// ==========================
//   SERVIR IMÁGENES
// ==========================
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/uploads/configuracion", express.static(path.join(__dirname, "uploads/configuracion")));
app.use("/uploads/avatars", express.static(path.join(__dirname, "uploads/avatars")));

// ==========================
//   PUERTO
// ==========================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en puerto ${PORT}`);
});
