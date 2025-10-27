const axios = require('axios');

const API_BASE = 'http://localhost:3000/api';
let authToken = '';
let userId = '';
let recetaId = '';

async function testFinal() {
    console.log('🎯 REVISIÓN FINAL COMPLETA DEL BACKEND\n');
    
    const resultados = {
        exitos: 0,
        errores: 0,
        detalles: []
    };

    try {
        // 1. CONEXIÓN BÁSICA
        console.log('1. 🔗 CONEXIÓN BÁSICA');
        try {
            const baseResponse = await axios.get(`${API_BASE}`);
            console.log('   ✅ Conexión: OK -', baseResponse.data.mensaje);
            resultados.exitos++;
            resultados.detalles.push('✅ Conexión básica funcionando');
        } catch (error) {
            console.log('   ❌ Conexión: FALLÓ');
            resultados.errores++;
            resultados.detalles.push('❌ Conexión básica falló');
        }

        // 2. AUTENTICACIÓN
        console.log('2. 🔐 SISTEMA DE AUTENTICACIÓN');
        const testEmail = `test${Date.now()}@example.com`;
        
        try {
            // Registro
            const registerResponse = await axios.post(`${API_BASE}/auth/register`, {
                nombre: 'Usuario Test Final',
                email: testEmail,
                password: '123456'
            });
            console.log('   ✅ Registro: OK');
            resultados.exitos++;
        } catch (error) {
            console.log('   ❌ Registro: FALLÓ -', error.response?.data?.message);
            resultados.errores++;
        }

        try {
            // Login
            const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
                email: testEmail,
                password: '123456'
            });
            authToken = loginResponse.data.token;
            userId = loginResponse.data.user.id;
            console.log('   ✅ Login: OK - Token obtenido');
            resultados.exitos++;
            resultados.detalles.push('✅ Sistema de autenticación funcionando');
        } catch (error) {
            console.log('   ❌ Login: FALLÓ -', error.response?.data?.message);
            resultados.errores++;
        }

        // 3. VERIFICACIÓN DE TOKEN
        console.log('3. ✅ VERIFICACIÓN DE TOKEN');
        try {
            const verifyResponse = await axios.get(`${API_BASE}/auth/verify`, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            console.log('   ✅ Token: VÁLIDO');
            resultados.exitos++;
        } catch (error) {
            console.log('   ❌ Token: INVÁLIDO -', error.response?.data?.message);
            resultados.errores++;
        }

        // 4. PERFIL DE USUARIO
        console.log('4. 👤 PERFIL DE USUARIO');
        try {
            const profileResponse = await axios.get(`${API_BASE}/usuario/profile`, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            console.log('   ✅ Perfil: OK -', profileResponse.data.data.nombre);
            resultados.exitos++;
            resultados.detalles.push('✅ Gestión de perfil funcionando');
        } catch (error) {
            console.log('   ❌ Perfil: FALLÓ -', error.response?.data?.message);
            resultados.errores++;
        }

        // 5. SISTEMA DE RECETAS
        console.log('5. 🍳 SISTEMA DE RECETAS');
        
        // Crear receta
        try {
            const recetaData = {
                nombre: 'Receta Final de Prueba',
                categoria: 'Postres',
                descripcion: 'Receta de prueba para revisión final',
                preparacion: 'Paso 1: Preparar. Paso 2: Cocinar.',
                ingredientes: [
                    { nombre: 'Ingrediente A', cantidad: 2, unidad_medida: 'tazas' },
                    { nombre: 'Ingrediente B', cantidad: 1, unidad_medida: 'cucharada' }
                ]
            };

            const recetaResponse = await axios.post(`${API_BASE}/recetas`, recetaData, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            recetaId = recetaResponse.data.receta.id_receta;
            console.log('   ✅ Crear receta: OK - ID:', recetaId);
            resultados.exitos++;
        } catch (error) {
            console.log('   ❌ Crear receta: FALLÓ -', error.response?.data?.message);
            resultados.errores++;
        }

        // Listar recetas
        try {
            const recetasResponse = await axios.get(`${API_BASE}/recetas`, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            console.log('   ✅ Listar recetas: OK -', recetasResponse.data.recetas.length, 'encontradas');
            resultados.exitos++;
        } catch (error) {
            console.log('   ❌ Listar recetas: FALLÓ -', error.response?.data?.message);
            resultados.errores++;
        }

        // 6. SISTEMA DE FAVORITOS
        console.log('6. ❤️ SISTEMA DE FAVORITOS');
        
        try {
            await axios.post(`${API_BASE}/favoritos/${recetaId}`, {}, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            console.log('   ✅ Agregar favorito: OK');
            resultados.exitos++;
        } catch (error) {
            console.log('   ❌ Agregar favorito: FALLÓ -', error.response?.data?.message);
            resultados.errores++;
        }

        try {
            const favResponse = await axios.get(`${API_BASE}/favoritos`, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            console.log('   ✅ Listar favoritos: OK -', favResponse.data.data.length, 'favoritos');
            resultados.exitos++;
            resultados.detalles.push('✅ Sistema de favoritos funcionando');
        } catch (error) {
            console.log('   ❌ Listar favoritos: FALLÓ -', error.response?.data?.message);
            resultados.errores++;
        }

        // 7. BÚSQUEDA
        console.log('7. 🔍 SISTEMA DE BÚSQUEDA');
        try {
            const searchResponse = await axios.get(`${API_BASE}/recetas/search?q=prueba`, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            console.log('   ✅ Búsqueda: OK -', searchResponse.data.recetas.length, 'resultados');
            resultados.exitos++;
            resultados.detalles.push('✅ Sistema de búsqueda funcionando');
        } catch (error) {
            console.log('   ❌ Búsqueda: FALLÓ -', error.response?.data?.message);
            resultados.errores++;
        }

    } catch (error) {
        console.log('❌ Error general:', error.message);
        resultados.errores++;
    }

    // RESULTADO FINAL
    console.log('\n' + '='.repeat(60));
    console.log('📊 RESUMEN FINAL DE LA REVISIÓN');
    console.log('='.repeat(60));
    console.log(`✅ Pruebas exitosas: ${resultados.exitos}`);
    console.log(`❌ Pruebas fallidas: ${resultados.errores}`);
    console.log(`📈 Tasa de éxito: ${((resultados.exitos / (resultados.exitos + resultados.errores)) * 100).toFixed(1)}%`);
    
    console.log('\n🔧 DETALLES:');
    resultados.detalles.forEach(detalle => console.log('   ', detalle));

    console.log('\n' + '='.repeat(60));
    if (resultados.errores === 0) {
        console.log('🎉 ¡BACKEND 100% FUNCIONAL!');
        console.log('🚀 Listo para proceder con el FRONTEND');
    } else {
        console.log('⚠️  Hay problemas que necesitan corrección antes del frontend');
    }
    console.log('='.repeat(60));
}

testFinal();