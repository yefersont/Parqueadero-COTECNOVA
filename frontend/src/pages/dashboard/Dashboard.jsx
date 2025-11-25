import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getDashboardStats } from "../../api/estadisticas";
import { getIngresosHoy } from "../../api/ingresos";
import { getSalidasHoy } from "../../api/salidas";
import Loader from "../../components/Loader";
import MetricCard from "../../components/MetricCard";
import Modal from "../../components/Modal";
import TablaConPaginacion from "../../components/TablaconPaginacion";
import {
  Car,
  LogIn,
  LogOut,
  Clock,
  TrendingUp,
  Users,
  BarChart3,
} from "lucide-react";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  Area,
  AreaChart,
} from "recharts";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [isModalIngresos, setIsModalIngresos] = useState(false);
  const [isModalSalidas, setIsModalSalidas] = useState(false);
  const [ingresosHoy, setIngresosHoy] = useState([]);
  const [salidasHoy, setSalidasHoy] = useState([]);

  useEffect(() => {
    cargarEstadisticas();
    // Auto-refresh cada 30 segundos
    const interval = setInterval(() => {
      cargarEstadisticas();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const cargarEstadisticas = async () => {
    try {
      const response = await getDashboardStats();
      setStats(response.data);
      
      // Cargar ingresos y salidas para modales
      const ingresosRes = await getIngresosHoy();
      setIngresosHoy(ingresosRes.data);
      
      const salidasRes = await getSalidasHoy();
      setSalidasHoy(salidasRes.data);
    } catch (error) {
      console.error("Error cargando estadísticas:", error);
    } finally {
      setCargando(false);
    }
  };

  const formatearTiempo = (minutos) => {
    if (minutos === 0) return "Sin datos";
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    return horas > 0 ? `${horas}h ${mins}min` : `${mins}min`;
  };

  const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6", "#ec4899"];

  // Tooltip personalizado elegante
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-2xl p-4">
          <p className="text-sm font-semibold text-gray-900 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p
              key={index}
              className="text-sm text-gray-600 flex items-center gap-2"
            >
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              ></span>
              {entry.name}:{" "}
              <span className="font-bold text-gray-900">{entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return cargando ? (
    <Loader texto="Cargando estadísticas..." />
  ) : (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* KPI Cards - Glassmorphism Effect */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            <MetricCard
              title="Vehículos Actuales"
              value={stats?.vehiculos_actuales || 0}
              icon={<Car className="w-6 h-6 text-white" strokeWidth={2.5} />}
              color="green"
              subtitle="En el parqueadero"
            />
            <div onClick={() => setIsModalIngresos(true)} className="cursor-pointer">
              <MetricCard
                title="Ingresos Hoy"
                value={stats?.ingresos_hoy || 0}
                icon={<LogIn className="w-6 h-6 text-white" strokeWidth={2.5} />}
                color="blue"
                subtitle="Registros de entrada"
              />
            </div>
            <div onClick={() => setIsModalSalidas(true)} className="cursor-pointer">
              <MetricCard
                title="Salidas Hoy"
                value={stats?.salidas_hoy || 0}
                icon={<LogOut className="w-6 h-6 text-white" strokeWidth={2.5} />}
                color="orange"
                subtitle="Registros de salida"
              />
            </div>
            <MetricCard
              title="Tiempo Promedio"
              value={formatearTiempo(stats?.tiempo_promedio_minutos || 0)}
              icon={<Clock className="w-6 h-6 text-white" strokeWidth={2.5} />}
              color="purple"
              subtitle="Estadía promedio"
            />
          </div>

          {/* Gráficas Premium */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Gráfica de Ingresos - Área con gradiente */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300 group overflow-hidden"
            >
              {/* Efecto de brillo sutil */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md shadow-blue-500/30">
                    <TrendingUp
                      className="w-4 h-4 text-white"
                      strokeWidth={2.5}
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Tendencia de Ingresos
                    </h3>
                    <p className="text-xs text-gray-500 font-medium">
                      Últimos 7 días
                    </p>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={stats?.ingresos_por_dia || []}>
                    <defs>
                      <linearGradient
                        id="colorIngresos"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#3b82f6"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#3b82f6"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#e5e7eb"
                      strokeOpacity={0.5}
                    />
                    <XAxis
                      dataKey="dia"
                      stroke="#9ca3af"
                      style={{ fontSize: "12px", fontWeight: "500" }}
                    />
                    <YAxis
                      stroke="#9ca3af"
                      style={{ fontSize: "12px", fontWeight: "500" }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="cantidad"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      fill="url(#colorIngresos)"
                      name="Ingresos"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Gráfica de Distribución */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300 group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md shadow-emerald-500/30">
                    <Car className="w-4 h-4 text-white" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Distribución por Tipo
                    </h3>
                    <p className="text-xs text-gray-500 font-medium">
                      Vehículos actuales
                    </p>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={stats?.distribucion_tipos || []}
                      dataKey="cantidad"
                      nameKey="tipo"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      label={({ tipo, cantidad }) => `${tipo}: ${cantidad}`}
                      labelLine={{ stroke: "#9ca3af", strokeWidth: 1 }}
                    >
                      {(stats?.distribucion_tipos || []).map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          {/* Gráfica de Propietarios Frecuentes - Full Width */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300 group overflow-hidden mb-8"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md shadow-purple-500/30">
                  <Users className="w-4 h-4 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Propietarios Más Frecuentes
                  </h3>
                  <p className="text-xs text-gray-500 font-medium">
                    Top 15 usuarios del parqueadero
                  </p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats?.propietarios_frecuentes || []}>
                  <defs>
                    <linearGradient
                      id="colorVisitas"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#10b981" stopOpacity={1} />
                      <stop
                        offset="95%"
                        stopColor="#10b981"
                        stopOpacity={0.7}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e5e7eb"
                    strokeOpacity={0.5}
                  />
                  <XAxis
                    dataKey="nombre"
                    stroke="#9ca3af"
                    style={{ fontSize: "12px", fontWeight: "500" }}
                  />
                  <YAxis
                    stroke="#9ca3af"
                    style={{ fontSize: "12px", fontWeight: "500" }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="visitas"
                    fill="url(#colorVisitas)"
                    name="Visitas"
                    radius={[12, 12, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Modales */}
      {isModalIngresos && (
        <Modal
          isOpen={isModalIngresos}
          onClose={() => setIsModalIngresos(false)}
          size="xl"
        >
          <TablaConPaginacion
            titulo="Ingresos Hoy"
            columnas={["Propietario", "Teléfono", "Vehículo", "Fecha", "Hora"]}
            datos={ingresosHoy.registros?.map((i) => ({
              Propietario: `${i.propietario.Nombre_propietario} ${i.propietario.Apellido_propietario}`,
              Teléfono: i.propietario.Telefono_propietario,
              Vehículo: i.vehiculo.Placa_vehiculo,
              Fecha: i.fecha_ingreso,
              Hora: i.hora_ingreso,
            })) || []}
            mostrarControles={false}
          />
        </Modal>
      )}

      {isModalSalidas && (
        <Modal
          isOpen={isModalSalidas}
          onClose={() => setIsModalSalidas(false)}
          size="xl"
        >
          <TablaConPaginacion
            titulo="Salidas Hoy"
            columnas={["Propietario", "Cédula", "Teléfono", "Vehículo", "Fecha y hora ingreso", "Fecha y hora Salida"]}
            datos={salidasHoy?.registros?.map((s) => ({
              Propietario: `${s.ingreso.propietario.Nombre_propietario} ${s.ingreso.propietario.Apellido_propietario}`,
              Cédula: s.ingreso.propietario.Cedula_propietario,
              Teléfono: s.ingreso.propietario.Telefono_propietario,
              Vehículo: s.ingreso.vehiculo.Placa_vehiculo,
              "Fecha Ingreso": `${s.ingreso.fecha_ingreso} ${s.ingreso.hora_ingreso}`,
              "Fecha Salida": `${s.fecha_salida} ${s.hora_salida}`,
            })) || []}
            mostrarControles={false}
          />
        </Modal>
      )}
    </>
  );
}

export default Dashboard;
