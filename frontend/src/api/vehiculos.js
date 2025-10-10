import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/vehiculos";

export const getVehiculos = () => axios.get(API_URL);
export const getVehiculo = (id) => axios.get(`${API_URL}/${id}`);
export const createVehiculo = (data) => axios.post(API_URL, data);
export const updateVehiculo = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const deleteVehiculo = (id) => axios.delete(`${API_URL}/${id}`);
