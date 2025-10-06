// src/pages/Home.jsx
import { useState, useEffect } from "react";
import { Car, LogIn, LogOut, AlertCircle, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { getPropietarios } from "../../api/propietarios";
import { createIngreso, getIngresosHoy } from "../../api/ingresos";
import { getSalidasHoy, createSalida } from "../../api/salidas";
import Modal from "../../components/Modal";
import Swal from "sweetalert2";
import TablaConPaginacion from "../../components/TablaconPaginacion";
function Home() {
  const [ccIngreso, setCcIngreso] = useState("");
  const [ccSalida, setCcSalida] = useState("");
  const [vehiculosIngreso, setVehiculosIngreso] = useState([]);
  const [propietarios, setPropietarios] = useState([]);
  const [vehiculoSeleccionadoIngreso, setVehiculoSeleccionadoIngreso] =
    useState("");
  const [ingresosHoy, setIngresosHoy] = useState([]);
  const [salidasHoy, setSalidasHoy] = useState([]);
  const [ccIngresoInput, setCcIngresoInput] = useState("");
  const [idPropietarioIngreso, setIdPropietarioIngreso] = useState("");
  const [ccSalidaInput, setCcSalidaInput] = useState("");
  const [idPropietarioSalida, setIdPropietarioSalida] = useState("");
  const [errorNotification, setErrorNotification] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenSalidas, setIsModalOpenSalidas] = useState(false);

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
  const fetchSalidasHoy = async () => {
    try {
      const response = await getSalidasHoy();
      setSalidasHoy(response.data);
      console.log("Salidas de hoy cargados:", response.data);
    } catch (error) {
      console.error("Error fetching salidas hoy:", error);
    }
  };

  const mostrarAlertaIngreso = () => {
    Swal.fire({
      title: "Ingreso registrado con éxito",
      icon: "success",
      showConfirmButton: false,
      timer: 1500,
    });
  };

  const mostrarAlertaSalida = () => {
    Swal.fire({
      title: "Salida registrada con éxito",
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
        if (propietario.vehiculos && propietario.vehiculos.length > 0) {
          setIdPropietarioIngreso(propietario.idPropietario);
          setVehiculosIngreso(propietario.vehiculos);
          setCcIngreso(""); // limpia el error
        } else {
          setIdPropietarioIngreso(propietario.idPropietario);
          setVehiculosIngreso([]);
          setCcIngreso("El propietario no tiene vehículos registrados");
        }
      } else {
        setIdPropietarioIngreso("");
        setVehiculosIngreso([]);
        setCcIngreso("Identificación no encontrada");
      }
    } else {
      setIdPropietarioIngreso("");
      setVehiculosIngreso([]);
      setCcIngreso("");
    }
  };

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
      mostrarAlertaIngreso();
      fetchIngresosHoy();
      setCcIngresoInput("");
      setVehiculoSeleccionadoIngreso("");
      setVehiculosIngreso([]);
    } catch (error) {
      console.error("❌ Error registrando ingreso:", error);
      const errorMsg =
        error.response?.data?.message || "Ocurrió un error inesperado";
      console.warn(`Error: ${errorMsg}`);
      setErrorNotification(errorMsg);
    }
  };
  const handleRegistrarSalida = async () => {
    if (!ccSalidaInput.trim()) {
      console.warn("⚠️ Debes ingresar una cédula válida.");
      return;
    }
    const propietario = propietarios.find(
      (p) => String(p.Cedula_propietario) === ccSalidaInput
    );

    if (!propietario) {
      console.warn("⚠️ El propietario no existe.");
      return;
    }

    try {
      const salidaData = {
        Propietario_idPropietario: propietario.idPropietario,
      };

      const { data } = await createSalida(salidaData);
      console.log("✅ Salida registrada:", data);

      mostrarAlertaSalida();
      fetchSalidasHoy();
      setCcSalidaInput("");
    } catch (error) {
      console.error("❌ Error registrando salida:", error);
      const errorMsg =
        error.response?.data?.message ||
        "No se pudo registrar la salida si el propietario no tiene ingresos activos";
      console.warn(`Error: ${errorMsg}`);
      setErrorNotification(errorMsg);
    }
  };
  const handleBuscarSalida = () => {
    if (ccSalidaInput.trim() !== "") {
      const propietario = propietarios.find(
        (p) => String(p.Cedula_propietario) === ccSalidaInput
      );

      if (propietario) {
        setIdPropietarioSalida(propietario.idPropietario);
        setCcSalida("");
        handleRegistrarSalida();
      } else {
        setIdPropietarioSalida("");
        setCcSalida("Identificación no encontrada");
      }
    } else {
      setIdPropietarioSalida("");
      setCcSalida("");
      setCcSalidaInput("");
    }
  };

  const handleClickIngresos = () => {
    setIsModalOpen(true);
  };

  const handleClickSalidas = () => {
    setIsModalOpenSalidas(true);
  };

  useEffect(() => {
    fetchPropietarios();
    fetchIngresosHoy();
    fetchSalidasHoy();
    if (errorNotification) {
      const timer = setTimeout(() => setErrorNotification(""), 4500);
      return () => clearTimeout(timer);
    }
  }, [errorNotification]);

  // Tabla modal de ingresos de hoy

  const columnasIngresos = [
    "Propietario",
    "Telefono",
    "Vehículo",
    "Fecha",
    "Hora",
  ];

  const datosIngresos = ingresosHoy.registros?.map((i) => ({
    Propietario:
      i.propietario.Nombre_propietario +
      " " +
      i.propietario.Apellido_propietario,
    Telefono: i.propietario.Telefono_propietario,
    Vehículo: i.vehiculo.Placa_vehiculo,
    Fecha: i.fecha_ingreso,
    Hora: i.hora_ingreso,
  }));

  // Tabla modal de salidas de hoy
  const columnasSalidas = [
    "Propietario",
    "Cédula",
    "Teléfono",
    "Vehículo",
    "Fecha y hora ingreso",
    "Fecha y hora Salida",
  ];

  const datosSalidas = salidasHoy?.registros?.map((s) => ({
    Propietario: `${s.ingreso.propietario.Nombre_propietario} ${s.ingreso.propietario.Apellido_propietario}`,
    Cédula: s.ingreso.propietario.Cedula_propietario,
    Teléfono: s.ingreso.propietario.Telefono_propietario,
    Vehículo: s.ingreso.vehiculo.Placa_vehiculo,
    "Fecha Ingreso": s.ingreso.fecha_ingreso + "  " + s.ingreso.hora_ingreso,
    "Fecha Salida": s.fecha_salida + "   " + s.hora_salida,
  }));

  return (
    <div className="bg-gradient-to-r from-green-50 to-gray-100 h-[85vh] flex items-center justify-center px-6 py-6">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* -------------------- Notificación de error ------------------------ */}

        {errorNotification && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed top-20 left-0 w-full bg-red-100 text-red-700 border-t border-b border-red-300 
             py-3 shadow-md z-50 flex items-center justify-center gap-2 text-center"
          >
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="font-semibold">{errorNotification}</span>
          </motion.div>
        )}

        {/* ---------- Panel de Ingresos ---------- */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-xl p-8 flex flex-col"
        >
          {/* Estadística */}
          <div
            onClick={handleClickIngresos}
            className="flex items-center gap-4 bg-green-50 rounded-xl p-4 mb-8 cursor-pointer transition-all duration-300 hover:shadow-lg hover:bg-green-100 hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="bg-green-600 text-white p-3 rounded-full transition-transform duration-300 group-hover:rotate-6">
              <LogIn size={24} />
            </div>
            <div>
              <h3 className="text-sm text-gray-600">Ingresos Hoy</h3>
              <p className="text-2xl font-bold text-gray-900">
                {ingresosHoy.total}
              </p>
            </div>
          </div>

          {/* Formulario */}
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Ingresos Vehiculares
          </h2>
          <motion.input
            type="text"
            placeholder="Número de identificación"
            value={ccIngresoInput}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*$/.test(value)) setCcIngresoInput(value);
            }}
            onKeyDown={(e) => e.key === "Enter" && handleBuscarIngreso()}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none mb-4 transition-colors"
            whileFocus={{ scale: 1.02 }}
          />
          {ccIngreso && (
            <div
              className={`flex items-center gap-2 mt-2 mb-4 px-3 py-2 rounded-lg text-sm font-medium shadow-sm 
    ${
      ccIngreso === "Identificación no encontrada" ||
      ccIngreso === "El propietario no tiene vehículos registrados"
        ? "bg-red-100 text-red-600 border border-red-300"
        : "bg-green-100 text-green-700 border border-green-300"
    }`}
            >
              {ccIngreso === "Identificación no encontrada" ? (
                <AlertCircle className="w-4 h-4" />
              ) : (
                <CheckCircle className="w-4 h-4" />
              )}
              <span>{ccIngreso}</span>
            </div>
          )}
          {/* Select */}
          {vehiculosIngreso.length > 0 && (
            <motion.select
              value={vehiculoSeleccionadoIngreso}
              onChange={(e) => setVehiculoSeleccionadoIngreso(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 mb-4"
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
          )}

          {/* Botón */}
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
        </motion.div>

        {/* ---------- Panel de Salidas ---------- */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-xl p-8 flex flex-col"
        >
          {/* Estadística */}
          <div
            onClick={handleClickSalidas}
            className="flex items-center gap-4 bg-red-50 rounded-xl p-4 mb-8 cursor-pointer transition-all duration-300 hover:shadow-lg hover:bg-red-100 hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="bg-red-600 text-white p-3 rounded-full transition-transform duration-300 group-hover:rotate-6">
              <LogOut size={24} />
            </div>
            <div>
              <h3 className="text-sm text-gray-600">Salidas Hoy</h3>
              <p className="text-2xl font-bold text-gray-900">
                {salidasHoy.total}
              </p>
            </div>
          </div>

          {/* Formulario */}
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Salidas Vehiculares
          </h2>
          <motion.input
            type="text"
            placeholder="Número de identificación"
            value={ccSalidaInput}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*$/.test(value)) setCcSalidaInput(value);
            }}
            onKeyDown={(e) => e.key === "Enter" && handleBuscarSalida()}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:outline-none mb-4 transition-colors"
            whileFocus={{ scale: 1.02 }}
          />

          {/* Mensaje dinámico igual al de Ingresos */}
          {ccSalida && (
            <div
              className={`flex items-center gap-2 mt-2 mb-4 px-3 py-2 rounded-lg text-sm font-medium shadow-sm 
      ${
        ccSalida === "Identificación no encontrada"
          ? "bg-red-100 text-red-600 border border-red-300"
          : "bg-green-100 text-green-700 border border-green-300"
      }`}
            >
              {ccSalida === "Identificación no encontrada" ? (
                <AlertCircle className="w-4 h-4" />
              ) : (
                <CheckCircle className="w-4 h-4" />
              )}
              <span>{ccSalida}</span>
            </div>
          )}

          {/* Botón */}
          <motion.button
            onClick={handleRegistrarSalida}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
          >
            Registrar Salida <LogOut />
          </motion.button>
        </motion.div>
      </div>

      {/* modal ingresos de  hoy */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          size="xl"
        >
          <TablaConPaginacion
            titulo="Ingresos Hoy"
            columnas={columnasIngresos}
            datos={datosIngresos}
            mostrarControles={false}
          />
        </Modal>
      )}

      {/* modal saldias de  hoy */}
      {isModalOpenSalidas && (
        <Modal
          isOpen={isModalOpenSalidas}
          onClose={() => setIsModalOpenSalidas(false)}
          size="xl"
        >
          <TablaConPaginacion
            titulo="Salidas Hoy"
            columnas={columnasSalidas}
            datos={datosSalidas}
            mostrarControles={false}
          />
        </Modal>
      )}
    </div>
  );
}

export default Home;
