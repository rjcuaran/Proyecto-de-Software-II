const axios = require('axios');

class TestFavoritos {
  constructor() {
    this.API_BASE = 'http://localhost:3000/api';
    this.token = '';
    this.recetaId = null;
  }

  async ejecutarPruebas() {
    console.log('🧪 INICIANDO PRUEBAS DEL SISTEMA DE FAVORITOS\n');
    
    try {
      await this.prepararTest();
      await this.probarAgregarFavorito();
      await this.probarVerificarFavorito();
      await this.probarListarFavoritos();
      await this.probarEliminarFavorito();
      await this.probarDuplicadoFavorito();
      
      console.log('\n🎉 ¡TODAS LAS PRUEBAS DE FAVORITOS EXITOSAS!');
    } catch (error) {
      console.error('❌ Error en pruebas:', error.response?.data || error.message);
    }
  }

  async prepararTest() {
    console.log('1. 🔐 Preparando entorno de prueba...');
    
    // Registrar usuario de prueba
    const response = await axios.post(`${this.API_BASE}/auth/register`, {
      nombre: 'Test Favoritos',
      correo: 'favoritos@test.com',
      contraseña: 'test123'
    });
    
    this.token = response.data.data.token;
    console.log('✅ Usuario de prueba registrado');

    // Crear receta de prueba
    const recetaResponse = await axios.post(`${this.API_BASE}/recetas`, {
      nombre: 'Receta para Favoritos',
      categoria: 'Pruebas',
      descripcion: 'Receta de prueba para el sistema de favoritos',
      preparacion: '1. Paso uno. 2. Paso dos.',
      ingredientes: [
        { nombre: 'Ingrediente prueba', cantidad: 100, unidad_medida: 'gramos' }
      ]
    }, {
      headers: { Authorization: `Bearer ${this.token}` }
    });
    
    this.recetaId = recetaResponse.data.data.id_receta;
    console.log('✅ Receta de prueba creada. ID:', this.recetaId);
  }

  async probarAgregarFavorito() {
    console.log('\n2. ❤️ Probando agregar a favoritos...');
    
    const response = await axios.post(
      `${this.API_BASE}/favoritos/${this.recetaId}`, 
      {},
      { headers: { Authorization: `Bearer ${this.token}` } }
    );
    
    console.log('✅ Favorito agregado:', response.data.message);
    console.log('   Receta actualizada - Es favorita:', response.data.data.es_favorita);
  }

  async probarVerificarFavorito() {
    console.log('\n3. 🔍 Probando verificación de favorito...');
    
    const response = await axios.get(
      `${this.API_BASE}/favoritos/${this.recetaId}/check`,
      { headers: { Authorization: `Bearer ${this.token}` } }
    );
    
    console.log('✅ Verificación exitosa');
    console.log('   Es favorita:', response.data.data.esFavorita);
  }

  async probarListarFavoritos() {
    console.log('\n4. 📋 Probando listado de favoritos...');
    
    const response = await axios.get(
      `${this.API_BASE}/favoritos`,
      { headers: { Authorization: `Bearer ${this.token}` } }
    );
    
    console.log('✅ Listado de favoritos obtenido');
    console.log('   Total favoritos:', response.data.total);
    console.log('   Primera receta:', response.data.data[0]?.nombre);
  }

  async probarEliminarFavorito() {
    console.log('\n5. 🗑️ Probando eliminar de favoritos...');
    
    const response = await axios.delete(
      `${this.API_BASE}/favoritos/${this.recetaId}`,
      { headers: { Authorization: `Bearer ${this.token}` } }
    );
    
    console.log('✅ Favorito eliminado:', response.data.message);
    console.log('   Receta actualizada - Es favorita:', response.data.data.es_favorita);
  }

  async probarDuplicadoFavorito() {
    console.log('\n6. ⚠️ Probando duplicado de favoritos...');
    
    // Agregar primera vez
    await axios.post(
      `${this.API_BASE}/favoritos/${this.recetaId}`, 
      {},
      { headers: { Authorization: `Bearer ${this.token}` } }
    );
    
    // Intentar agregar segunda vez
    try {
      await axios.post(
        `${this.API_BASE}/favoritos/${this.recetaId}`, 
        {},
        { headers: { Authorization: `Bearer ${this.token}` } }
      );
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ Duplicado detectado correctamente:', error.response.data.message);
      } else {
        throw error;
      }
    }
    
    // Limpiar
    await axios.delete(
      `${this.API_BASE}/favoritos/${this.recetaId}`,
      { headers: { Authorization: `Bearer ${this.token}` } }
    );
  }
}

// Ejecutar pruebas
new TestFavoritos().ejecutarPruebas();