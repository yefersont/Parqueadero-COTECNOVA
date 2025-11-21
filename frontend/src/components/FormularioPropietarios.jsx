import { useState, useEffect } from "react";
import { createPropietario, updatePropietario } from "../api/propietarios";
import { motion } from "framer-motion";
import { User, Phone, CreditCard } from "lucide-react";
import { useRegistro } from "../context/RegistroContext";
import Swal from "sweetalert2";

function FormularioPropietario({ valoresIniciales = {}, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    Cedula_propietario: "",
    Nombre_propietario: "",
    Apellido_propietario: "",
    Telefono_propietario: "",
    Rol: "",
  });

  const { setIdPropietario } = useRegistro();

  // Cargar valores para edición
  useEffect(() => {
    if (valoresIniciales && Object.keys(valoresIniciales).length > 0) {
      setForm((prev) => ({
        ...prev,
        ...valoresIniciales,
        Rol: valoresIniciales?.rol?.idRol
          ? String(valoresIniciales.rol.idRol)
          : String(valoresIniciales.Rol ?? ""),
      }));
    }
  }, [valoresIniciales]);

  const mostrarAlertaCedulaDuplicada = () => {
    Swal.fire({
      title: "Cédula ya registrada",
      text: "Ya existe un propietario con esta cédula. Verifica la información.",
      icon: "error",
      timer: 2500,
      showConfirmButton: false,
      position: "center",
      background: "#f9fafb",
      color: "#2c3e50",
    });
  };

  // Manejo de cambios
  const handleChange = (e) => {
    const { name, value } = e.target;
    let nuevoValor = value;

    if (name === "Nombre_propietario" || name === "Apellido_propietario") {
      nuevoValor = value.replace(/[^a-zA-Z\s]/g, "");
    }

    if (name === "Telefono_propietario" || name === "Cedula_propietario") {
      nuevoValor = value.replace(/\D/g, "");
    }

    if (name === "Rol") {
      nuevoValor = parseInt(nuevoValor, 10) || "";
    }

    setForm({ ...form, [name]: nuevoValor });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Detectar si es edición (igual que el formulario de vehículo)
    const esEdicion = Boolean(valoresIniciales?.idPropietario);
    if (esEdicion) {
      // Actualizar propietario existente
      updatePropietario(valoresIniciales.idPropietario, form)
        .then((res) => {
          console.log("Propietario actualizado:", res.data);
          if (onSubmit) onSubmit(res.data);
        })
        .catch((err) => {
          console.error("Error al actualizar propietario:", err);
          console.log("Datos enviados:", form);
          mostrarAlertaCedulaDuplicada();
        });
    } else {
      // Crear nuevo propietario
      createPropietario(form)
        .then((res) => {
          console.log("Propietario creado:", res.data);
          setIdPropietario(res.data.idPropietario);
          if (onSubmit) onSubmit(res.data);
        })
        .catch((err) => {
          console.error("Error al crear propietario:", err);
          console.log("Datos enviados:", form);
        });
    }
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
        {/* Cédula */}
        <div className="relative">
          <CreditCard
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            name="Cedula_propietario"
            value={form.Cedula_propietario}
            onChange={handleChange}
            placeholder="Cédula"
            className="pl-10 w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm 
                       focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 
                       transition duration-300 placeholder-gray-400"
          />
        </div>

        {/* Nombre */}
        <div className="relative">
          <User
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            name="Nombre_propietario"
            value={form.Nombre_propietario}
            onChange={handleChange}
            placeholder="Nombre"
            className="pl-10 w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm 
                       focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 
                       transition duration-300 placeholder-gray-400"
          />
        </div>

        {/* Apellido */}
        <div className="relative">
          <User
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            name="Apellido_propietario"
            value={form.Apellido_propietario}
            onChange={handleChange}
            placeholder="Apellido"
            className="pl-10 w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm 
                       focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 
                       transition duration-300 placeholder-gray-400"
          />
        </div>

        {/* Teléfono */}
        <div className="relative">
          <Phone
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="tel"
            name="Telefono_propietario"
            value={form.Telefono_propietario}
            onChange={handleChange}
            placeholder="Teléfono"
            className="pl-10 w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm 
                       focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 
                       transition duration-300 placeholder-gray-400"
          />
        </div>

        {/* Rol */}
        <div className="md:col-span-2">
          <select
            name="Rol"
            value={form.Rol}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm bg-white 
                       focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 
                       transition duration-300"
          >
            <option value="">Seleccione un rol</option>
            <option value="1">Estudiante</option>
            <option value="2">Docente</option>
            <option value="3">Administrativo</option>
            <option value="4">Trabajador</option>
          </select>
        </div>
      </div>

      {/* Botones */}
      <div className="flex justify-end gap-3 pt-4">
        <motion.button
          type="button"
          onClick={onCancel}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="px-5 py-2 rounded-md bg-gray-200 text-gray-700 
                     hover:bg-gray-300 transition-colors duration-150"
        >
          Cancelar
        </motion.button>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="px-5 py-2 rounded-md bg-green-600 text-white 
                     hover:bg-green-700 transition-colors duration-150"
        >
          Guardar
        </motion.button>
      </div>
    </motion.form>
  );
}

export default FormularioPropietario;
