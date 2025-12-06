import axios from "axios";

// URL base del backend
const API_URL = "http://localhost:3000/api";

// Crear instancia de Axios
const api = axios.create({
  baseURL: API_URL,
});

// Interceptor para enviar siempre el token si existe
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* =====================================================
   🔥  CONFIGURACIÓN DEL SITIO (NUEVO)
===================================================== */

// Obtener configuración del sitio (logo, colores, redes, footer, etc.)
api.getConfiguracion = async () => {
  return api.get("/configuracion");
};

// Actualizar configuración del sitio
api.updateConfiguracion = async (formData) => {
  return api.put("/configuracion", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

/* =====================================================
   🔥  AUTENTICACIÓN
===================================================== */

// Login
api.login = (data) => api.post("/auth/login", data);

// Registro de usuario
api.register = (data) => api.post("/auth/register", data);

// Solicitud de restablecimiento de contraseña
api.forgotPassword = (data) => api.post("/auth/forgot-password", data);

// Restablecer la contraseña con token
api.resetPassword = (token, data) =>
  api.post(`/auth/reset-password/${token}`, data);

/* =====================================================
   🔥  CATEGORÍAS
===================================================== */

api.getCategorias = () => api.get("/categorias");
api.createCategoria = (data) => api.post("/categorias", data);
api.updateCategoria = (id, data) => api.put(`/categorias/${id}`, data);
api.deleteCategoria = (id) => api.delete(`/categorias/${id}`);

/* =====================================================
   🔥  INGREDIENTES GLOBALES
===================================================== */

api.getIngredientes = () => api.get("/ingredientes");
api.createIngrediente = (data) => api.post("/ingredientes", data);
api.updateIngrediente = (id, data) => api.put(`/ingredientes/${id}`, data);
api.deleteIngrediente = (id) => api.delete(`/ingredientes/${id}`);

/* =====================================================
   🔥  UNIDADES DE MEDIDA
===================================================== */

api.getUnidades = () => api.get("/unidades");
api.createUnidad = (data) => api.post("/unidades", data);
api.updateUnidad = (id, data) => api.put(`/unidades/${id}`, data);
api.deleteUnidad = (id) => api.delete(`/unidades/${id}`);

export default api;
