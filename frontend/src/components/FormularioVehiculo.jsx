import React, { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, Truck, Edit3, Hash } from "lucide-react"; // puedes usar íconos apropiados

function FormularioVehiculo({ valoresIniciales = {}, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    Placa_vehiculo: valoresIniciales.Placa_vehiculo || "",
    Marca_vehiculo: valoresIniciales.Marca_vehiculo || "",
    Modelo_vehiculo: valoresIniciales.Modelo_vehiculo || "",
    Tipo_vehiculo: valoresIniciales.Tipo_vehiculo || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    setForm({
      Placa_vehiculo: "",
      Marca_vehiculo: "",
      Modelo_vehiculo: "",
      Tipo_vehiculo: "",
    });
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 p-4 md:p-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            className="pl-10 w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm
                       focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400
                       transition duration-300 placeholder-gray-400"
          />
        </div>

        {/* Marca */}
        <div className="relative">
          <Truck
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            name="Marca_vehiculo"
            value={form.Marca_vehiculo}
            onChange={handleChange}
            placeholder="Marca"
            className="pl-10 w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm
                       focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400
                       transition duration-300 placeholder-gray-400"
          />
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
            className="pl-10 w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm
                       focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400
                       transition duration-300 placeholder-gray-400"
          />
        </div>

        {/* Tipo */}
        <div className="relative">
          <CreditCard
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            name="Tipo_vehiculo"
            value={form.Tipo_vehiculo}
            onChange={handleChange}
            placeholder="Tipo"
            className="pl-10 w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm
                       focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400
                       transition duration-300 placeholder-gray-400"
          />
        </div>
      </div>

      {/* Botones */}
      <div className="flex justify-end gap-3 pt-4">
        {/* Cancelar */}
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

        {/* Guardar */}
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
