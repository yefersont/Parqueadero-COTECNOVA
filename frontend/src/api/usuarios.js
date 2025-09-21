import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/usuarios";

export const getUsuarios = () => axios.get(API_URL);
export const getUsuario = (id) => axios.get(`${API_URL}/${id}`);
export const createUsuario = (data) => axios.post(API_URL, data);
export const updateUsuario = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const deleteUsuario = (id) => axios.delete(`${API_URL}/${id}`);
