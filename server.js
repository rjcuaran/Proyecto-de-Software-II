const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { initializeDatabase } = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const recetaRoutes = require('./routes/recetaRoutes');
const userRoutes = require('./routes/userRoutes');
const favoritosRoutes = require('./routes/favoritosRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/favoritos', favoritosRoutes);
app.use('/api/recetas', recetaRoutes);
app.use('/api/usuario', userRoutes);
app.use('/api/categorias', require('./routes/categoriaRoutes'));


// Ruta de prueba mejorada
app.get('/', (req, res) => {
  res.json({
    message: '🚀 Bienvenido al Organizador de Recetas API - CRUD COMPLETO',
    version: '2.0.0',
    endpoints: {
      auth: {
        registro: 'POST /api/auth/register',
        usuarios: 'GET /api/auth/users (desarrollo)'
      },
      recetas: {
        listar: 'GET /api/recetas',
        crear: 'POST /api/recetas',
        obtener: 'GET /api/recetas/:id',
        actualizar: 'PUT /api/recetas/:id',
        eliminar: 'DELETE /api/recetas/:id',
        buscar: 'GET /api/recetas/search?q=termino&categoria=postres'
      },
      usuario: {
        perfil: 'GET /api/usuario/profile',
        actualizar: 'PUT /api/usuario/profile'
      }
    },
    nota: 'Todas las rutas de recetas y usuario requieren autenticación JWT'
  });
});

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

// Manejo global de errores
app.use((error, req, res, next) => {
  console.error('Error global:', error);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor'
  });
});

// Inicializar servidor
async function startServer() {
  try {
    await initializeDatabase();
    
    app.listen(PORT, () => {
      console.log(`🎯 Servidor ejecutándose en http://localhost:${PORT}`);
      console.log(`📊 Base de datos: ${process.env.DB_NAME || 'organizador_recetas'}`);
      console.log(`🚀 CRUD COMPLETO implementado:`);
      console.log(`   ✅ Autenticación`);
      console.log(`   ✅ Gestión de Recetas (CRUD)`);
      console.log(`   ✅ Gestión de Usuarios`);
      console.log(`   ✅ Búsqueda y Filtros`);
    });
  } catch (error) {
    console.error('❌ No se pudo iniciar el servidor:', error);
    process.exit(1);
  }
}

startServer();