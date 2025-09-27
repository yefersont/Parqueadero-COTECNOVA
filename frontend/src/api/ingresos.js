import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/ingresos";

export const getIngresos = () => axios.get(API_URL);
export const getIngreso = (id) => axios.get(`${API_URL}/${id}`);
export const createIngreso = (data) => axios.post(API_URL, data);
export const updateIngreso = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const deleteIngreso = (id) => axios.delete(`${API_URL}/${id}`);
export const getIngresosHoy = () => axios.get(`${API_URL}/hoy`);
