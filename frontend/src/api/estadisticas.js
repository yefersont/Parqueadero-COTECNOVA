import api from "./axios";

export const getDashboardStats = () => api.get("/estadisticas/dashboard");
