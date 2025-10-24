import api from './api';

export const recetasService = {
  // Obtener todas las recetas del usuario
  getRecetas: async () => {
    const response = await api.get('/recetas');
    return response.data;
  },

  // Obtener receta por ID
  getRecetaById: async (id) => {
    const response = await api.get(`/recetas/${id}`);
    return response.data;
  },

  // Crear nueva receta
  createReceta: async (recetaData) => {
    const response = await api.post('/recetas', recetaData);
    return response.data;
  },

  // Actualizar receta
  updateReceta: async (id, recetaData) => {
    const response = await api.put(`/recetas/${id}`, recetaData);
    return response.data;
  },

  // Eliminar receta
  deleteReceta: async (id) => {
    const response = await api.delete(`/recetas/${id}`);
    return response.data;
  },

  // Buscar recetas
  searchRecetas: async (termino) => {
    const response = await api.get(`/recetas/search?q=${termino}`);
    return response.data;
  }
};

export const favoritosService = {
  // Obtener favoritos
  getFavoritos: async () => {
    const response = await api.get('/favoritos');
    return response.data;
  },

  // Agregar a favoritos
  addFavorito: async (idReceta) => {
    const response = await api.post(`/favoritos/${idReceta}`);
    return response.data;
  },

  // Eliminar de favoritos
  removeFavorito: async (idReceta) => {
    const response = await api.delete(`/favoritos/${idReceta}`);
    return response.data;
  },

  // Verificar si es favorito
  checkFavorito: async (idReceta) => {
    const response = await api.get(`/favoritos/${idReceta}/check`);
    return response.data;
  }
};

export const categoriasService = {
  // Obtener todas las categorías
  getCategorias: async () => {
    const response = await api.get('/categorias');
    return response.data;
  },

  // Obtener recetas por categoría
  getRecetasByCategoria: async (idCategoria) => {
    const response = await api.get(`/categorias/${idCategoria}/recetas`);
    return response.data;
  }
};