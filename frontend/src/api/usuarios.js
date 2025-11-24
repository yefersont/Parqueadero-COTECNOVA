import api from "./axios";

const API_URL = "/usuarios";

export const getUsuarios = () => api.get(API_URL);
export const getUsuario = (id) => api.get(`${API_URL}/${id}`);
export const createUsuario = (data) => api.post(API_URL, data);
export const updateUsuario = (id, data) => api.put(`${API_URL}/${id}`, data);
export const deleteUsuario = (id) => api.delete(`${API_URL}/${id}`);
