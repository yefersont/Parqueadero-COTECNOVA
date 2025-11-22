import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/asociar";

export const getVehiculoHasPropietario = () => axios.get(API_URL);
export const createVehiculoHasPropietario = (data) => axios.post(API_URL, data);
export const deleteVehiculoHasPropietario = (idVehiculo, idPropietario) =>
  axios.delete(`${API_URL}/${idVehiculo}/${idPropietario}`);
