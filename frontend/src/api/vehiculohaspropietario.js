import api from "./axios";

const API_URL = "/asociar";

export const getVehiculoHasPropietario = () => api.get(API_URL);
export const createVehiculoHasPropietario = (data) => api.post(API_URL, data);
export const deleteVehiculoHasPropietario = (idVehiculo, idPropietario) =>
  api.delete(`${API_URL}/${idVehiculo}/${idPropietario}`);
