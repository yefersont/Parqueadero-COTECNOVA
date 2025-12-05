import axios from 'axios';

// const API_URL = 'http://127.0.0.1:8000/api';
const API_URL = import.meta.env.VITE_API_URL;

// Crear instancia de axios
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Interceptor para agregar el token a todas las peticiones
api.interceptors.request.use(
  (config) => {
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

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido o expirado
      // Solo redirigir si NO estamos ya en la página de login
      if (window.location.pathname !== '/login') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
