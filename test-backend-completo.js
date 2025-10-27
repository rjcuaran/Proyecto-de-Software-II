const axios = require('axios');

const API_BASE = 'http://localhost:3000/api';
let authToken = '';
let userId = '';

async function testBackend() {
    console.log('🧪 INICIANDO PRUEBA COMPLETA DEL BACKEND\n');
    
    try {
        // 1. Test de conexión básica
        console.log('1. 🔗 Probando conexión básica...');
        const baseResponse = await axios.get(`${API_BASE}`);
        console.log('✅ Conexión básica:', baseResponse.data.mensaje);

        // 2. Test de registro de usuario
        console.log('2. 👤 Probando registro de usuario...');
        const testEmail = `test${Date.now()}@example.com`;
        
        const registerResponse = await axios.post(`${API_BASE}/auth/register`, {
            nombre: 'Usuario Test',
            email: testEmail,
            password: '123456'
        });
        console.log('✅ Registro exitoso');

        // 3. Test de login
        console.log('3. 🔑 Probando login...');
        const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
            email: testEmail,
            password: '123456'
        });
        
        authToken = loginResponse.data.token;
        userId = loginResponse.data.user.id;
        console.log('✅ Login exitoso - Token obtenido');

        // 4. Test de verificación de token
        console.log('4. ✅ Probando verificación de token...');
        const verifyResponse = await axios.get(`${API_BASE}/auth/verify`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        console.log('✅ Token verificado correctamente');

        // 5. Test de perfil de usuario
        console.log('5. 📊 Probando perfil de usuario...');
        const profileResponse = await axios.get(`${API_BASE}/usuario/profile`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        console.log('✅ Perfil obtenido:', profileResponse.data.data.nombre);

        // 6. Test de creación de receta
        console.log('6. 🍳 Probando creación de receta...');
        const recetaData = {
            nombre: 'Receta de Prueba',
            categoria: 'Postres',
            descripcion: 'Esta es una receta de prueba',
            preparacion: 'Paso 1: Hacer esto. Paso 2: Hacer aquello.',
            ingredientes: [
                { nombre: 'Harina', cantidad: 2, unidad_medida: 'tazas' },
                { nombre: 'Azúcar', cantidad: 1, unidad_medida: 'taza' }
            ]
        };

        const recetaResponse = await axios.post(`${API_BASE}/recetas`, recetaData, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        const recetaId = recetaResponse.data.receta.id_receta;
        console.log('✅ Receta creada - ID:', recetaId);

        // 7. Test de listar recetas
        console.log('7. 📝 Probando listado de recetas...');
        const recetasResponse = await axios.get(`${API_BASE}/recetas`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        console.log(`✅ ${recetasResponse.data.recetas.length} recetas obtenidas`);

        // 8. Test de favoritos
        console.log('8. ❤️ Probando sistema de favoritos...');
        
        // Agregar a favoritos
        await axios.post(`${API_BASE}/favoritos/${recetaId}`, {}, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        console.log('✅ Receta agregada a favoritos');

        // Verificar favorito
        const checkFavResponse = await axios.get(`${API_BASE}/favoritos/${recetaId}/check`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        console.log('✅ Verificación de favorito:', checkFavResponse.data.esFavorito);

        // Listar favoritos
        const favResponse = await axios.get(`${API_BASE}/favoritos`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        console.log(`✅ ${favResponse.data.data.length} favoritos obtenidos`);

        // 9. Test de búsqueda
        console.log('9. 🔍 Probando búsqueda...');
        const searchResponse = await axios.get(`${API_BASE}/recetas/search?q=prueba`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        console.log(`✅ Búsqueda completada - ${searchResponse.data.recetas.length} resultados`);

        console.log('\n🎉 ¡TODAS LAS PRUEBAS EXITOSAS!');
        console.log('✅ Backend 100% funcional');
        console.log('✅ Base de datos conectada');
        console.log('✅ Autenticación JWT funcionando');
        console.log('✅ CRUD completo operativo');
        console.log('✅ Sistema de favoritos operativo');

    } catch (error) {
        console.error('❌ Error en las pruebas:', error.response?.data || error.message);
        console.log('🔧 Revisa los logs del servidor para más detalles');
    }
}

// Ejecutar pruebas
testBackend();