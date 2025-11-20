import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor para requests normales (JSON)
api.interceptors.request.use(
  (config) => {
    // Solo agregar Content-Type si no es FormData
    if (!(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ✅ Exportar articulosAPI (recomendado)
export const articulosAPI = {
  // Obtener todos los artículos
  getArticulos: () => api.get('/articulos'),
  
  // Obtener artículo por ID
  getArticuloById: (id) => api.get(`/articulos/${id}`),
  
  // Crear nuevo artículo (CON FormData para imagen)
  createArticulo: (formData) => api.post('/articulos', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  
  // Marcar como vendido
  marcarVendido: (id) => api.patch(`/articulos/${id}/vendido`),
  
  // Obtener categorías
  getCategorias: () => api.get('/articulos/categorias'),
  
  // Obtener estadísticas
  getEstadisticas: () => api.get('/articulos/estadisticas'),
};

// ✅ Mantener productAPI para compatibilidad
export const productAPI = {
  getProducts: () => api.get('/articulos'),
  getProductById: (id) => api.get(`/articulos/${id}`),
  createProduct: (productData) => {
    // Si es FormData (con imagen), usar multipart
    if (productData instanceof FormData) {
      return api.post('/articulos', productData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }
    // Si es JSON normal
    return api.post('/articulos', productData);
  },
  deleteProduct: (id) => api.delete(`/articulos/${id}`),
  getUserProducts: () => api.get('/articulos'),
};

// Para verificar que el backend está funcionando
export const testAPI = {
  testConnection: () => api.get('/'),
};

export default api;