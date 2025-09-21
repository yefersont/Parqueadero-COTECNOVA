import { useState, useEffect } from "react";
import { createPropietario } from "../api/propietarios";
import Swal from "sweetalert2";

function FormularioPropietario({ valoresIniciales = {}, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    Cedula_propietario: "",
    Nombre_propietario: "",
    Apellido_propietario: "",
    Telefono_propietario: "",
    Rol: "",
  });

  useEffect(() => {
    if (valoresIniciales && Object.keys(valoresIniciales).length > 0) {
      setForm((prev) => ({ ...prev, ...valoresIniciales }));
    }
  }, [valoresIniciales]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    let nuevoValor = value;

    // Validar solo letras y espacios para nombre y apellido
    if (name === "Nombre_propietario" || name === "Apellido_propietario") {
      nuevoValor = value.replace(/[^a-zA-Z\s]/g, ""); // elimina cualquier cosa que no sea letra o espacio
    }

    if (name === "Telefono_propietario" || name === "Cedula_propietario") {
      nuevoValor = value.replace(/\D/g, ""); // elimina cualquier cosa que no sea número
    }

    if (name === "Rol" || name === "Cedula_propietario") {
      nuevoValor = parseInt(nuevoValor, 10) || "";
    }

    setForm({ ...form, [name]: nuevoValor });
  };

  const mostrarAlerta = () => {
    Swal.fire({
      title: "Registro exitoso",
      text: "El propietario ha sido registrado correctamente. Selecciona la acción que deseas realizar a continuación:",
      icon: "success",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Finalizar",
      denyButtonText: "Registrar nuevo vehículo",
      cancelButtonText: "Vincular vehículo existente",
      confirmButtonColor: "#2c3e50", // gris oscuro elegante
      denyButtonColor: "#27ae60", // verde profesional
      cancelButtonColor: "#2980b9", // azul serio
      reverseButtons: true, // invierte el orden para que quede más natural
      allowOutsideClick: false, // obliga al usuario a decidir
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("✔️ Acción: Finalizar");
        // Acción para cerrar flujo o refrescar tabla
      } else if (result.isDenied) {
        console.log("🚗 Acción: Registrar nuevo vehículo");
        // Redirigir a formulario de vehículo nuevo
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        console.log("📋 Acción: Vincular vehículo existente");
        // Redirigir a vincular vehículo existente
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createPropietario(form)
      .then((res) => {
        console.log("Propietario creado:", res.data);
        mostrarAlerta();
        if (onSubmit) onSubmit(res.data);
      })
      .catch((err) => {
        console.error("Error al crear propietario:", err);
        console.log("Datos que envío:", form);
      });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4 md:p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cédula */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Cédula
          </label>
          <input
            type="text"
            name="Cedula_propietario"
            value={form.Cedula_propietario}
            onChange={handleChange}
            placeholder="Número de cédula"
            className="block w-full px-4 py-2 border rounded-lg shadow-sm 
                       focus:outline-none focus:ring-2 focus:ring-green-500 
                       focus:border-green-500 transition"
          />
        </div>

        {/* Nombre */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Nombre
          </label>
          <input
            type="text"
            name="Nombre_propietario"
            value={form.Nombre_propietario}
            onChange={handleChange}
            placeholder="Nombre del propietario"
            className="block w-full px-4 py-2 border rounded-lg shadow-sm 
                       focus:outline-none focus:ring-2 focus:ring-green-500 
                       focus:border-green-500 transition"
          />
        </div>

        {/* Apellido */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Apellido
          </label>
          <input
            type="text"
            name="Apellido_propietario"
            value={form.Apellido_propietario}
            onChange={handleChange}
            placeholder="Apellido del propietario"
            className="block w-full px-4 py-2 border rounded-lg shadow-sm 
                       focus:outline-none focus:ring-2 focus:ring-green-500 
                       focus:border-green-500 transition"
          />
        </div>

        {/* Teléfono */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Teléfono
          </label>
          <input
            type="tel"
            name="Telefono_propietario"
            value={form.Telefono_propietario}
            onChange={handleChange}
            placeholder="Número de teléfono"
            className="block w-full px-4 py-2 border rounded-lg shadow-sm 
                       focus:outline-none focus:ring-2 focus:ring-green-500 
                       focus:border-green-500 transition"
          />
        </div>

        {/* Rol */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Rol
          </label>
          <select
            name="Rol"
            value={form.Rol}
            onChange={handleChange}
            className="block w-full px-4 py-2 border rounded-lg shadow-sm 
                       bg-white focus:outline-none focus:ring-2 
                       focus:ring-green-500 focus:border-green-500 transition"
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
      <div className="flex justify-end gap-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg shadow 
                     hover:bg-gray-300 transition"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded-lg shadow 
                     hover:bg-green-700 transition"
        >
          Guardar
        </button>
      </div>
    </form>
  );
}

export default FormularioPropietario;
