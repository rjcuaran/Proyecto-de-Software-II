// backend/server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

// DB
const db = require("./config/database");

// Cargar variables de entorno
dotenv.config();

// Crear servidor
const app = express();
app.use(cors());
app.use(express.json());

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

const configuracionRoutes = require("./routes/configuracionRoutes");
app.use("/api/configuracion", configuracionRoutes);

const adminUsuarioRoutes = require("./routes/adminUsuarioRoutes");
app.use("/api/admin/usuarios", adminUsuarioRoutes);

// ==========================
//   RUTAS USUARIO (INGREDIENTES)
// ==========================
const usuarioIngredienteRoutes = require("./routes/usuarioIngredienteRoutes");
app.use("/api/ingredientes", usuarioIngredienteRoutes);

// ==========================
//   SERVIR IMÁGENES
// ==========================
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(
  "/uploads/avatars",
  express.static(path.join(__dirname, "uploads/avatars"))
);

// ==========================
//   PUERTO
// ==========================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en puerto ${PORT}`);
});
