import api from "./axios";

const API_URL = "/propietarios";

export const getPropietarios = () => api.get(API_URL);
export const getPropietario = (id) => api.get(`${API_URL}/${id}`);
export const createPropietario = (data) => api.post(API_URL, data);
export const updatePropietario = (id, data) =>
  api.put(`${API_URL}/${id}`, data);
export const deletePropietario = (id) => api.delete(`${API_URL}/${id}`);
export const getVehiculosByPropietario = (id) =>
  api.get(`${API_URL}/vehiculos/${id}`);
export const getPropietarioByCedula = (cedula) =>
  api.get(`${API_URL}/cedula/${cedula}`, {
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  });
