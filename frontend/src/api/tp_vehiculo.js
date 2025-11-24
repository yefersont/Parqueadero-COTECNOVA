import api from "./axios";

const API_URL = "/tp_vehiculos";
export const getTiposVehiculos = () => api.get(API_URL);
export const getTipoVehiculo = (id) => api.get(`${API_URL}/${id}`);
export const createTipoVehiculo = (data) => api.post(API_URL, data);
export const updateTipoVehiculo = (id, data) =>
  api.put(`${API_URL}/${id}`, data);
export const deleteTipoVehiculo = (id) => api.delete(`${API_URL}/${id}`);
