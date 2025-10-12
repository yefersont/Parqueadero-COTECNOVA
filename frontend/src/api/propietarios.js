import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/propietarios";

export const getPropietarios = () => axios.get(API_URL);
export const getPropietario = (id) => axios.get(`${API_URL}/${id}`);
export const createPropietario = (data) => axios.post(API_URL, data);
export const updatePropietario = (id, data) =>
  axios.put(`${API_URL}/${id}`, data);
export const deletePropietario = (id) => axios.delete(`${API_URL}/${id}`);
export const getVehiculosByPropietario = (id) =>
  axios.get(`${API_URL}/vehiculos/${id}`);
