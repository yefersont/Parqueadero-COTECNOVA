import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/salidas";

export const getSalidas = () => axios.get(API_URL);
export const getSalida = (id) => axios.get(`${API_URL}/${id}`);
export const createSalida = (data) => axios.post(API_URL, data);
export const updateSalida = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const deleteSalida = (id) => axios.delete(`${API_URL}/${id}`);
