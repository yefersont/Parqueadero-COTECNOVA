import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/marcavehiculos";

export const getMarcasVehiculos = () => axios.get(API_URL);
export const getMarcaVehiculo = (id) => axios.get(`${API_URL}/${id}`);
export const createMarcaVehiculo = (data) => axios.post(API_URL, data);
export const updateMarcaVehiculo = (id, data) =>
  axios.put(`${API_URL}/${id}`, data);
export const deleteMarcaVehiculo = (id) => axios.delete(`${API_URL}/${id}`);
