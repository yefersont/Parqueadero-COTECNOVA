import api from "./axios";

const API_URL = "/ingresos";

export const getIngresos = () => api.get(API_URL);
export const getIngreso = (id) => api.get(`${API_URL}/${id}`);
export const createIngreso = (data) => api.post(API_URL, data);
export const updateIngreso = (id, data) => api.put(`${API_URL}/${id}`, data);
export const deleteIngreso = (id) => api.delete(`${API_URL}/${id}`);
export const getIngresosHoy = () => api.get(`${API_URL}/hoy`);
export const getIngresosPorFecha = (fecha) =>
  api.get(`${API_URL}/fecha/${fecha}`);
export const getIngresosPorRangoFechas = (fechaInicio, fechaFin) =>
  api.get(`${API_URL}/rango`, {
    params: { inicio: fechaInicio, fin: fechaFin },
  });

