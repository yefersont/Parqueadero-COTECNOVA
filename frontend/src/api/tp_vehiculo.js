import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/tp_vehiculos";
export const getTiposVehiculos = () => axios.get(API_URL);
export const getTipoVehiculo = (id) => axios.get(`${API_URL}/${id}`);
export const createTipoVehiculo = (data) => axios.post(API_URL, data);
export const updateTipoVehiculo = (id, data) =>
  axios.put(`${API_URL}/${id}`, data);
export const deleteTipoVehiculo = (id) => axios.delete(`${API_URL}/${id}`);
