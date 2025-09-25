// src/pages/Home.jsx
import { useState, useEffect } from "react";
import { Car, LogIn, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { getPropietarios } from "../../api/propietarios";

function Home() {
  const [ccIngreso, setCcIngreso] = useState("");
  const [ccSalida, setCcSalida] = useState("");
  const [vehiculosIngreso, setVehiculosIngreso] = useState([]);
  const [vehiculosSalida, setVehiculosSalida] = useState([]);
  const [propietarios, setPropietarios] = useState([]);

  const fetchPropietarios = async () => {
    try {
      const response = await getPropietarios();
      setPropietarios(response.data);
      console.log("Propietarios cargados:", response.data);
    } catch (error) {
      console.error("Error fetching propietarios:", error);
    }
  };

  const handleIngresar = () => {
    if (ccIngreso.trim() !== "") {
      const propietario = propietarios.find(
        (p) => String(p.Cedula_propietario) === ccIngreso
      );

      if (propietario) {
        setVehiculosIngreso(propietario.vehiculos);
      } else {
        setVehiculosIngreso([]);
      }
    } else {
      setVehiculosIngreso([]);
    }
  };

  const handleSalida = () => {
    if (ccSalida.trim() !== "") {
      const propietario = propietarios.find(
        (p) => String(p.Cedula_propietario) === ccSalida
      );

      if (propietario) {
        setVehiculosSalida(propietario.vehiculos);
      } else {
        setVehiculosSalida([]);
      }
    } else {
      setVehiculosSalida([]);
    }
  };

  useEffect(() => {
    fetchPropietarios();
  }, []);

  return (
    <div className=" bg-gradient-to-r from-green-50 to-gray-100 h-[85vh] flex items-center justify-center px-6 py-6">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* ---------------- Panel Izquierdo: INGRESOS ---------------- */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-xl p-8 flex flex-col justify-between"
        >
          {/* Estadísticas de ingresos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-green-100 rounded-xl p-4 flex items-center gap-3"
            >
              <div className="bg-green-600 text-white p-3 rounded-full">
                <LogIn size={24} />
              </div>
              <div>
                <h3 className="text-sm text-gray-600">Ingresos Hoy</h3>
                <p className="text-xl font-bold text-gray-800">25</p>
              </div>
            </motion.div>
          </div>

          {/* Formulario de ingresos */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Ingresos Vehiculares
            </h2>
            <motion.input
              type="text"
              placeholder="Número de identificación"
              value={ccIngreso}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value)) {
                  setCcIngreso(value);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleIngresar();
                }
              }}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 mb-4"
              whileFocus={{ scale: 1.02 }}
            />

            {/* SELECT arriba del botón */}
            <div className="mb-4">
              {vehiculosIngreso.length > 0 ? (
                <motion.select
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <option value="">Selecciona un vehículo</option>
                  {vehiculosIngreso.map((v) => (
                    <option key={v.idVehiculo} value={v.idVehiculo}>
                      {v.Placa_vehiculo} - {v.Modelo_vehiculo}
                    </option>
                  ))}
                </motion.select>
              ) : (
                <p className="text-gray-500 text-center">
                  No hay vehículos registrados aún
                </p>
              )}
            </div>

            <motion.button
              onClick={handleIngresar}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
            >
              {vehiculosIngreso.length > 0 ? (
                <>
                  Registrar Ingreso <LogIn />
                </>
              ) : (
                <>
                  Buscar <Car />
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* ---------------- Panel Derecho: SALIDAS ---------------- */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-xl p-8 flex flex-col justify-between"
        >
          {/* Estadísticas de salidas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-red-100 rounded-xl p-4 flex items-center gap-3"
            >
              <div className="bg-red-600 text-white p-3 rounded-full">
                <LogOut size={24} />
              </div>
              <div>
                <h3 className="text-sm text-gray-600">Salidas Hoy</h3>
                <p className="text-xl font-bold text-gray-800">18</p>
              </div>
            </motion.div>
          </div>

          {/* Formulario de salidas */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Salidas Vehiculares
            </h2>
            <motion.input
              type="text"
              placeholder="Número de identificación"
              value={ccSalida}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value)) {
                  setCcSalida(value);
                }
              }}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 mb-4"
              whileFocus={{ scale: 1.02 }}
            />

            {/* SELECT arriba del botón */}
            <div className="mb-4">
              {vehiculosSalida.length > 0 ? (
                <motion.select
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <option value="">Selecciona un vehículo</option>
                  {vehiculosSalida.map((v) => (
                    <option key={v.idVehiculo} value={v.idVehiculo}>
                      {v.Placa_vehiculo} - {v.Modelo_vehiculo}
                    </option>
                  ))}
                </motion.select>
              ) : (
                <p className="text-gray-500 text-center">
                  No hay vehículos registrados aún
                </p>
              )}
            </div>

            <motion.button
              onClick={handleSalida}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
            >
              Registrar Salida <LogOut />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Home;
