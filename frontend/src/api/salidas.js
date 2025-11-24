import api from "./axios";

const API_URL = "/salidas";

export const getSalidas = () => api.get(API_URL);
export const getSalida = (id) => api.get(`${API_URL}/${id}`);
export const createSalida = (data) => api.post(API_URL, data);
export const updateSalida = (id, data) => api.put(`${API_URL}/${id}`, data);
export const deleteSalida = (id) => api.delete(`${API_URL}/${id}`);
export const getSalidasHoy = () => api.get(`${API_URL}/hoy`);
