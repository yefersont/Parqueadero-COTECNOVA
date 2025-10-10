import { useEffect, useState } from "react";
import { getPropietarios } from "../../api/propietarios";
import TablaConPaginacion from "../../components/TablaconPaginacion";
import Loader from "../../components/Loader";
import Modal from "../../components/Modal";
import FormularioPropietario from "../../components/FormularioPropietarios";
import FormularioVehiculo from "../../components/FormularioVehiculo";
import { useRegistro } from "../../context/RegistroContext";
import { createVehiculoHasPropietario } from "../../api/vehiculohaspropietario";

import Swal from "sweetalert2";
function Propietarios() {
  const [propietarios, setPropietarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isVehiculoOpen, setIsVehiculoOpen] = useState(false);
  const { setIdPropietario } = useRegistro();
  const [busqueda, setBusqueda] = useState("");
  const { idPropietario } = useRegistro();

  useEffect(() => {
    getPropietarios()
      .then((res) => {
        setPropietarios(res.data);
        setCargando(false);
      })
      .catch((err) => console.error(err));
  }, []);

  // Campos para la tabla propietarios
  const columnas = ["Cédula", "Nombre completo", "Teléfono", "Rol"];
  const datos = propietarios.map((i) => ({
    Cédula: i.Cedula_propietario,
    Nombre: i.Nombre_propietario + "  " + i.Apellido_propietario,
    Teléfono: i.Telefono_propietario,
    Rol: i.rol.Rol,
  }));

  const datosFiltrados = datos.filter((i) =>
    Object.values(i).some((valor) =>
      String(valor).toLowerCase().includes(busqueda.toLowerCase())
    )
  );

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
      confirmButtonColor: "#2c3e50",
      denyButtonColor: "#27ae60",
      cancelButtonColor: "#2980b9",
      reverseButtons: true,
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("✔️ Acción: Finalizar");
      } else if (result.isDenied) {
        console.log("🚗 Acción: Registrar nuevo vehículo");
        setIsVehiculoOpen(true); // <-- abre el modal del vehículo
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        console.log("📋 Acción: Vincular vehículo existente");
      }
    });
  };

  const AlertAsociacion = () => {
    Swal.fire({
      title: "Vehiculo asociado con éxito",
      icon: "success",
      showConfirmButton: false,
      timer: 1500,
    });
  };

  const asociar = (newVehiculo) => {
    const form = {
      Vehiculo_idVehiculo: newVehiculo,
      Propietario_idPropietario: idPropietario,
    };
    createVehiculoHasPropietario(form)
      .then((res) => {
        console.log("✅ Asociación creada correctamente:", res.data);
        AlertAsociacion();
      })
      .catch((err) => {
        console.error("Error al asociar vehículo y propietario:", err);
        console.log("Datos enviados:", form);
      });
  };

  return cargando ? (
    <Loader texto="Cargando propietarios..." />
  ) : (
    <>
      {/* Tabla */}
      <TablaConPaginacion
        titulo="Propietarios"
        columnas={columnas}
        datos={datosFiltrados}
        placeholderBusqueda="Buscar propietario..."
        textoBoton="Nuevo propietario"
        onNuevo={() => setIsOpen(true)}
        onBuscar={(valor) => {
          setBusqueda(valor);
          console.log("Buscar propietario:", valor);
        }}
        deshabilitarFechas={true}
        onRowClick={(fila) => {
          console.log("🧾 Fila seleccionada:", fila.idPropietario);
        }}
      />

      {/* Modal para Agregar un propietario */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <h2 className="text-2xl font-bold mb-4">Agregar propietario</h2>
        <FormularioPropietario
          onSubmit={(data) => {
            console.log("Guardar propietario:", data);
            const NuevoId = data.idPropietario;
            setIdPropietario(NuevoId);
            setIsOpen(false);
            mostrarAlerta();
          }}
          onCancel={() => setIsOpen(false)}
        />
      </Modal>

      {/* Modal para registrar un nuevo vehiculo */}
      <Modal isOpen={isVehiculoOpen} onClose={() => setIsVehiculoOpen(false)}>
        <h2 className="text-2xl font-bold mb-4">Registrar nuevo vehículo</h2>
        <FormularioVehiculo
          onSubmit={(vehiculo) => {
            console.log("Vehículo registrado:", vehiculo);
            setIsVehiculoOpen(false);
            asociar(vehiculo.vehiculo);
          }}
          onCancel={() => setIsVehiculoOpen(false)}
        />
      </Modal>
    </>
  );
}

export default Propietarios;
