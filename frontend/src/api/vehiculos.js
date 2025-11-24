import api from "./axios";

const API_URL = "/vehiculos";

export const getVehiculos = () => api.get(API_URL);
export const getVehiculo = (id) => api.get(`${API_URL}/${id}`);
export const createVehiculo = (data) => api.post(API_URL, data);
export const updateVehiculo = (id, data) => api.put(`${API_URL}/${id}`, data);
export const deleteVehiculo = (id) => api.delete(`${API_URL}/${id}`);
export const getPropietarioByVehiculo = (id) =>
  api.get(`${API_URL}/propietario/${id}`);
