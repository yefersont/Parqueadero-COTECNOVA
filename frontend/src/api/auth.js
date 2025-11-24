import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// Configurar axios para incluir credenciales (cookies/tokens) si es necesario
axios.defaults.withCredentials = true;

export const loginRequest = async (credentials) => {
  return await axios.post(`${API_URL}/login`, credentials);
};

export const logoutRequest = async () => {
  // Obtener token del localStorage si lo guardamos ahí
  const token = localStorage.getItem('token');
  
  return await axios.post(`${API_URL}/logout`, {}, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const verifyTokenRequest = async (token) => {
  return await axios.get(`${API_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};
