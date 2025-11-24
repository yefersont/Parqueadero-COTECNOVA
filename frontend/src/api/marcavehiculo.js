import api from "./axios";

const API_URL = "/marcavehiculos";

export const getMarcasVehiculos = () => api.get(API_URL);
export const getMarcaVehiculo = (id) => api.get(`${API_URL}/${id}`);
export const createMarcaVehiculo = (data) => api.post(API_URL, data);
export const updateMarcaVehiculo = (id, data) =>
  api.put(`${API_URL}/${id}`, data);
export const deleteMarcaVehiculo = (id) => api.delete(`${API_URL}/${id}`);
