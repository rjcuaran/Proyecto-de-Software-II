const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rutas (comenta categorías temporalmente)
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/recetas', require('./routes/recetaRoutes'));
app.use('/api/favoritos', require('./routes/favoritosRoutes'));
app.use('/api/usuario', require('./routes/userRoutes')); // ← Para perfil de usuario
// app.use('/api/categorias', require('./routes/categoriaRoutes')); // ⏸️ Temporalmente comentado

// Ruta de prueba
app.get('/api', (req, res) => {
  res.json({ 
    mensaje: 'API del Organizador de Recetas funcionando',
    endpoints: {
      auth: '/api/auth',
      recetas: '/api/recetas', 
      usuario: '/api/usuario',
      favoritos: '/api/favoritos'
      // categorias: '/api/categorias' // ⏸️ También comentado aquí
    }
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log('✅ Conectado a MySQL - Organizador de Recetas');
});