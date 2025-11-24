import api from './axios';

export const loginRequest = async (credentials) => {
  return await api.post('/login', credentials);
};

export const logoutRequest = async () => {
  return await api.post('/logout');
};

export const verifyTokenRequest = async (token) => {
  return await api.get('/me');
};

