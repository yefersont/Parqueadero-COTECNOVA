// src/pages/Home.jsx
import { useState, useEffect } from "react";
import { Car, LogIn, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { getPropietarios } from "../../api/propietarios";
import { createIngreso, getIngresosHoy } from "../../api/ingresos";
import Swal from "sweetalert2";
function Home() {
  const [ccIngreso, setCcIngreso] = useState("");
  const [ccSalida, setCcSalida] = useState("");
  const [vehiculosIngreso, setVehiculosIngreso] = useState([]);
  const [vehiculosSalida, setVehiculosSalida] = useState([]);
  const [propietarios, setPropietarios] = useState([]);
  const [vehiculoSeleccionadoIngreso, setVehiculoSeleccionadoIngreso] =
    useState("");
  const [vehiculoSeleccionadoSalida, setVehiculoSeleccionadoSalida] =
    useState("");
  const [ingresosHoy, setIngresosHoy] = useState([]);
  const [ccIngresoInput, setCcIngresoInput] = useState("");
  const [idPropietarioIngreso, setIdPropietarioIngreso] = useState("");

  // const [ccSalidaInput, setCcSalidaInput] = useState("");
  // const [idPropietarioSalida, setIdPropietarioSalida] = useState("");

  // Cargar propietarios desde el backend
  const fetchPropietarios = async () => {
    try {
      const response = await getPropietarios();
      setPropietarios(response.data);
      console.log("Propietarios cargados:", response.data);
    } catch (error) {
      console.error("Error fetching propietarios:", error);
    }
  };

  const fetchIngresosHoy = async () => {
    try {
      const response = await getIngresosHoy();
      setIngresosHoy(response.data);
      console.log("Ingresos de hoy cargados:", response.data);
    } catch (error) {
      console.error("Error fetching ingresos hoy:", error);
    }
  };

  const mostrarAlerta = () => {
    Swal.fire({
      title: "Ingreso registrado con éxito",
      icon: "success",
      showConfirmButton: false,
      timer: 1500,
    });
  };

  // Buscar propietario para ingresos
  const handleBuscarIngreso = () => {
    if (ccIngresoInput.trim() !== "") {
      const propietario = propietarios.find(
        (p) => String(p.Cedula_propietario) === ccIngresoInput
      );
      if (propietario) {
        setIdPropietarioIngreso(propietario.idPropietario); // guarda el id
        setVehiculosIngreso(propietario.vehiculos);
      } else {
        setIdPropietarioIngreso(""); // limpia si no existe
        setVehiculosIngreso([]);
      }
    } else {
      setIdPropietarioIngreso("");
      setVehiculosIngreso([]);
    }
  };

  // Registrar ingreso
  const handleRegistrarIngreso = async () => {
    if (!idPropietarioIngreso || !vehiculoSeleccionadoIngreso) {
      console.warn(
        "⚠️ Debes ingresar la identificación y seleccionar un vehículo."
      );
      return;
    }
    const ingresoData = {
      Propietario_idPropietario: idPropietarioIngreso,
      Vehiculo_idVehiculo: parseInt(vehiculoSeleccionadoIngreso),
    };

    try {
      const { data } = await createIngreso(ingresoData);
      console.log("✅ Ingreso registrado:", data);
      mostrarAlerta();
      fetchIngresosHoy();
      setCcIngresoInput("");
      setVehiculoSeleccionadoIngreso("");
      setVehiculosIngreso([]);
    } catch (error) {
      console.error("❌ Error registrando ingreso:", error);
      const errorMsg =
        error.response?.data?.message || "Ocurrió un error inesperado";
      console.warn(`Error: ${errorMsg}`);
    }
  };

  // Buscar propietario para salidas
  const handleBuscarSalida = () => {
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

  // Registrar salida (aquí iría la petición real al backend)
  const handleRegistrarSalida = () => {
    if (ccSalida && vehiculoSeleccionadoSalida) {
      console.log("Registrando salida:", {
        cedula: ccSalida,
        vehiculo: vehiculoSeleccionadoSalida,
      });
      // Aquí puedes llamar a tu API
    } else {
      alert("Debes ingresar la identificación y seleccionar un vehículo.");
    }
  };

  useEffect(() => {
    fetchPropietarios();
    fetchIngresosHoy();
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
                <p className="text-xl font-bold text-gray-800">{ingresosHoy}</p>
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
              value={ccIngresoInput}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value)) {
                  setCcIngresoInput(value);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleBuscarIngreso();
                }
              }}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 mb-4"
              whileFocus={{ scale: 1.02 }}
            />
            {/* SELECT arriba del botón */}
            <div className="mb-4">
              {vehiculosIngreso.length > 0 ? (
                <motion.select
                  value={vehiculoSeleccionadoIngreso}
                  onChange={(e) =>
                    setVehiculoSeleccionadoIngreso(e.target.value)
                  }
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
              onClick={
                vehiculosIngreso.length > 0
                  ? handleRegistrarIngreso
                  : handleBuscarIngreso
              }
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
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleBuscarSalida();
                }
              }}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 mb-4"
              whileFocus={{ scale: 1.02 }}
            />

            {/* SELECT arriba del botón */}
            <div className="mb-4">
              {vehiculosSalida.length > 0 ? (
                <motion.select
                  value={vehiculoSeleccionadoSalida}
                  onChange={(e) =>
                    setVehiculoSeleccionadoSalida(e.target.value)
                  }
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
              onClick={
                vehiculosSalida.length > 0
                  ? handleRegistrarSalida
                  : handleBuscarSalida
              }
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
            >
              {vehiculosSalida.length > 0 ? (
                <>
                  Registrar Salida <LogOut />
                </>
              ) : (
                <>
                  Buscar <Car />
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Home;
