console.log('🔍 DIAGNÓSTICO FINAL - BUSCANDO EL ERROR\n');

try {
  console.log('1. 🔄 Cargando express y router...');
  const express = require('express');
  const router = express.Router();
  console.log('   ✅ Express y router cargados');

  console.log('2. 📁 Verificando imports individuales...');
  
  console.log('   a) Modelo Categoria...');
  const Categoria = require('./models/Categoria');
  console.log('      ✅ Modelo Categoria - OK');
  
  console.log('   b) Auth Middleware...');
  const authMiddleware = require('./middleware/authMiddleware');
  console.log('      ✅ Auth Middleware - OK');
  console.log('      📝 Función verificarToken:', typeof authMiddleware.verificarToken);
  
  console.log('   c) Categoria Controller...');
  const categoriaController = require('./controllers/categoriaController');
  console.log('      ✅ Categoria Controller - OK');
  console.log('      📝 Funciones disponibles:');
  console.log('         - obtenerTodas:', typeof categoriaController.obtenerTodas);
  console.log('         - obtenerRecetasPorCategoria:', typeof categoriaController.obtenerRecetasPorCategoria);
  console.log('         - obtenerEstadisticasUsuario:', typeof categoriaController.obtenerEstadisticasUsuario);
  console.log('         - buscarPorNombre:', typeof categoriaController.buscarPorNombre);

  console.log('3. 🛣️  Configurando rutas...');
  router.use(authMiddleware.verificarToken);
  console.log('   ✅ Middleware aplicado - OK');
  
  router.get('/', categoriaController.obtenerTodas);
  console.log('   ✅ Ruta GET / configurada - OK');
  
  router.get('/:idCategoria/recetas', categoriaController.obtenerRecetasPorCategoria);
  console.log('   ✅ Ruta GET /:idCategoria/recetas configurada - OK');

  console.log('4. ✅ Exportando router...');
  console.log('   📝 Tipo de router:', typeof router);
  console.log('   📝 Router tiene use function:', typeof router.use);
  console.log('   📝 Router tiene get function:', typeof router.get);

  console.log('\n🎉 ¡TODAS LAS VERIFICACIONES PASARON!');
  console.log('💡 El problema debe estar en la CARGA del archivo de rutas.');

} catch (error) {
  console.error('\n❌ ERROR ENCONTRADO:');
  console.error('   Mensaje:', error.message);
  console.error('   Archivo:', error.stack.split('\n')[1]);
  
  if (error.code === 'MODULE_NOT_FOUND') {
    console.error('   🔍 Archivo no encontrado:', error.requireStack[0]);
  }
}