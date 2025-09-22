// src/pages/Home.jsx
import { useState } from "react";
import { Car, Users, MoveRight } from "lucide-react";
import { motion } from "framer-motion";
import Loader from "../../components/Loader";
function Home() {
  const [cc, setCc] = useState("");
  const [vehiculos, setVehiculos] = useState([]);
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState("");
  const handleIngresar = () => {
    if (cc.trim() !== "") {
      setVehiculos(["Carro rojo", "Moto azul", "Camioneta blanca"]);
    } else {
      setVehiculos([]);
    }
  };

  return (
    <div className="bg-gradient-to-rh-full px-6 py-8">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* --- Estadísticas arriba --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white shadow-md rounded-xl p-6 flex items-center space-x-4 hover:shadow-lg transition"
          >
            <div className="p-3 bg-green-100 text-green-600 rounded-full">
              <Car size={28} />
            </div>
            <div>
              <h3 className="text-sm text-gray-500">Vehículos Registrados</h3>
              <p className="text-2xl font-bold text-gray-800">128</p>
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-white shadow-md rounded-xl p-6 flex items-center space-x-4 hover:shadow-lg transition"
          >
            <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
              <Users size={28} />
            </div>
            <div>
              <h3 className="text-sm text-gray-500">Propietarios</h3>
              <p className="text-2xl font-bold text-gray-800">56</p>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-2xl shadow-xl w-full p-10 grid grid-cols-1 md:grid-cols-2 gap-10"
        >
          {/* Panel izquierdo: login con CC */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="flex flex-col justify-center"
          >
            <h1 className="text-3xl font-bold text-gray-800 mb-5">
              Sistema de Control Vehicular
            </h1>
            <p className="text-gray-600 mb-5 text-base">
              Ingresa tu número de identificación para continuar
            </p>

            <motion.input
              type="text"
              placeholder="Número de identificación"
              value={cc}
              onChange={(e) => setCc(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 mb-5 text-base"
              whileFocus={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            />

            <motion.button
              onClick={handleIngresar}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="w-full bg-[#198754] text-white py-3 rounded-lg font-semibold text-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
            >
              Buscar <MoveRight />
            </motion.button>
          </motion.div>

          {/* Panel derecho: info usuario */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="flex flex-col items-center justify-center bg-gray-50 rounded-xl p-6"
          >
            <motion.div
              initial={{ rotate: -20, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="w-24 h-24 bg-[#198754] text-white rounded-full flex items-center justify-center"
            >
              <Car size={40} />
            </motion.div>

            <h2 className="mt-4 text-xl font-semibold text-gray-700 text-center">
              Aquí aparecerán tus vehículos
            </h2>

            {vehiculos.length > 0 ? (
              <motion.select
                value={vehiculoSeleccionado}
                onChange={(e) => setVehiculoSeleccionado(e.target.value)}
                className="mt-4 w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-base"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <option value="">Selecciona un vehículo</option>
                {vehiculos.map((v, index) => (
                  <motion.option
                    key={index}
                    value={v}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {v}
                  </motion.option>
                ))}
              </motion.select>
            ) : (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="text-gray-500 text-base text-center mt-3"
              >
                No hay vehículos registrados aún
              </motion.p>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default Home;
