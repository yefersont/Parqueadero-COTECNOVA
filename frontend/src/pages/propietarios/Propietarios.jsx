import { useEffect, useState } from "react";
import { getPropietarios } from "../../api/propietarios";
import TablaConPaginacion from "../../components/TablaconPaginacion";
import Loader from "../../components/Loader";
import Modal from "../../components/Modal";
import FormularioPropietario from "../../components/FormularioPropietarios";
import FormularioVehiculo from "../../components/FormularioVehiculo";
import Swal from "sweetalert2";
function Propietarios() {
  const [propietarios, setPropietarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isVehiculoOpen, setIsVehiculoOpen] = useState(false);

  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    getPropietarios()
      .then((res) => {
        setPropietarios(res.data);
        setCargando(false);
      })
      .catch((err) => console.error(err));
  }, []);

  const columnas = ["Cédula", "Nombre", "Apellido", "Teléfono", "Rol"];
  const datos = propietarios.map((i) => ({
    Cédula: i.Cedula_propietario,
    Nombre: i.Nombre_propietario,
    Apellido: i.Apellido_propietario,
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

  return cargando ? (
    <Loader texto="Cargando propietarios..." />
  ) : (
    <>
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
      />

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <h2 className="text-2xl font-bold mb-4">Agregar propietario</h2>
        <FormularioPropietario
          onSubmit={(data) => {
            console.log("Guardar propietario:", data);
            setIsOpen(false);
            mostrarAlerta();
          }}
          onCancel={() => setIsOpen(false)}
        />
      </Modal>

      <Modal isOpen={isVehiculoOpen} onClose={() => setIsVehiculoOpen(false)}>
        <h2 className="text-2xl font-bold mb-4">Registrar nuevo vehículo</h2>
        <FormularioVehiculo
          onSubmit={(vehiculo) => {
            console.log("Vehículo registrado:", vehiculo);
            setIsVehiculoOpen(false);
            // Aquí podrías refrescar la tabla de vehículos
          }}
          onCancel={() => setIsVehiculoOpen(false)}
        />
      </Modal>
    </>
  );
}

export default Propietarios;
