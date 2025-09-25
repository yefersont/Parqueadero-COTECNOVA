import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CreditCard, Truck, Edit3, Hash } from "lucide-react";
import { getTiposVehiculos } from "../api/tp_vehiculo";
import { getMarcasVehiculos } from "../api/marcavehiculo";
import { createVehiculo } from "../api/vehiculos";

// Formulario para registrar o editar vehículos
function FormularioVehiculo({ valoresIniciales = {}, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    Placa_vehiculo: valoresIniciales.Placa_vehiculo || "",
    Marca_vehiculo: valoresIniciales.Marca_vehiculo || "",
    Modelo_vehiculo: valoresIniciales.Modelo_vehiculo || "",
    Tipo_vehiculo: valoresIniciales.Tipo_vehiculo || "",
  });

  // Estados para tipos y marcas de vehículos
  const [tiposVehiculos, setTiposVehiculos] = useState([]);
  const [marcasVehiculos, setMarcasVehiculos] = useState([]);

  // Cargar tipos y marcas de vehículos al montar el componente
  useEffect(() => {
    getTiposVehiculos()
      .then((res) => setTiposVehiculos(res.data))
      .catch((err) =>
        console.error("Error al cargar tipos de vehículos:", err)
      );

    getMarcasVehiculos()
      .then((res) => setMarcasVehiculos(res.data))
      .catch((err) =>
        console.error("Error al cargar marcas de vehículos:", err)
      );
  }, []);

  //  Ajustar campos si el tipo es "Bicicleta"
  useEffect(() => {
    const tipoSeleccionado = tiposVehiculos.find(
      (t) => String(t.idTipo_vehiculo) === String(form.Tipo_vehiculo)
    );
    if (tipoSeleccionado?.Tipo_vehiculo === "Bicicleta") {
      setForm((prev) => ({
        ...prev,
        Marca_vehiculo: 21,
        Modelo_vehiculo: "No aplica.",
        Placa_vehiculo: "No aplica.",
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        Marca_vehiculo: "",
        Modelo_vehiculo: "",
        Placa_vehiculo: "",
      }));
    }
  }, [form.Tipo_vehiculo, tiposVehiculos]);

  // Manejo de cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]:
        name === "Tipo_vehiculo" || name === "Marca_vehiculo"
          ? parseInt(value, 10)
          : value,
    });
  };

  // Manejo del envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    createVehiculo(form)
      .then((res) => {
        console.log("Vehículo creado:", res.data);
        if (onSubmit) onSubmit(res.data);
      })
      .catch((err) => {
        console.error("Error al crear vehículo:", err);
        console.log("Datos que envío:", form);
      });
  };

  // Determinar si el tipo seleccionado es "Bicicleta"
  const isBicicleta =
    tiposVehiculos.find(
      (t) => String(t.idTipo_vehiculo) === String(form.Tipo_vehiculo)
    )?.Tipo_vehiculo === "Bicicleta";

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 p-4 md:p-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tipo */}
        <div className="relative">
          <CreditCard
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <select
            name="Tipo_vehiculo"
            value={form.Tipo_vehiculo}
            onChange={handleChange}
            className="pl-10 w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm
               focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400
               transition duration-300 placeholder-gray-400"
          >
            <option value="">Seleccione un tipo</option>
            {tiposVehiculos.map((tipo) => (
              <option key={tipo.idTipo_vehiculo} value={tipo.idTipo_vehiculo}>
                {tipo.Tipo_vehiculo}
              </option>
            ))}
          </select>
        </div>

        {/* Marca */}
        <div className="relative">
          <Truck
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            size={18}
          />
          <select
            name="Marca_vehiculo"
            value={form.Marca_vehiculo}
            onChange={handleChange}
            disabled={isBicicleta}
            className="pl-10 w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm
               focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400
               transition duration-300 text-gray-700 disabled:bg-gray-100 disabled:text-gray-400"
          >
            <option value="">Seleccione una marca</option>
            {/* Siempre mostrar "No aplica" */}
            <option value="21">No aplica.</option>
            {marcasVehiculos.map((marca) => (
              <option
                key={marca.idMarca_vehiculo}
                value={marca.idMarca_vehiculo}
              >
                {marca.Marca_vehiculo}
              </option>
            ))}
          </select>
        </div>

        {/* Modelo */}
        <div className="relative">
          <Edit3
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            name="Modelo_vehiculo"
            value={form.Modelo_vehiculo}
            onChange={handleChange}
            placeholder="Modelo"
            disabled={isBicicleta}
            className="pl-10 w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm
                       focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400
                       transition duration-300 placeholder-gray-400 disabled:bg-gray-100 disabled:text-gray-400"
          />
        </div>

        {/* Placa */}
        <div className="relative">
          <Hash
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            name="Placa_vehiculo"
            value={form.Placa_vehiculo}
            onChange={handleChange}
            placeholder="Placa"
            disabled={isBicicleta}
            className="pl-10 w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm
                       focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400
                       transition duration-300 placeholder-gray-400 disabled:bg-gray-100 disabled:text-gray-400"
          />
        </div>
      </div>

      {/* Botones */}
      <div className="flex justify-end gap-3 pt-4">
        <motion.button
          type="button"
          onClick={onCancel}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="px-5 py-2 rounded-md bg-gray-200 text-gray-700 font-normal
                     hover:bg-gray-300 transition-colors duration-150"
        >
          Cancelar
        </motion.button>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="px-5 py-2 rounded-md bg-green-600 text-white font-normal
                     hover:bg-green-700 transition-colors duration-150"
        >
          Guardar
        </motion.button>
      </div>
    </motion.form>
  );
}

export default FormularioVehiculo;
