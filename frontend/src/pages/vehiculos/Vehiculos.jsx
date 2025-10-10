import { useEffect, useState } from "react";
import { getVehiculos } from "../../api/vehiculos";
import TablaConPaginacion from "../../components/TablaconPaginacion";
import Modal from "../../components/Modal";
import FormularioVehiculo from "../../components/FormularioVehiculo";
import Loader from "../../components/Loader";
import Swal from "sweetalert2";
function Vehiculos() {
  // Estados para vehículos y cargado
  const [vehiculos, setVehiculos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // Cargar vehículos al montar el componente
  useEffect(() => {
    getVehiculos()
      .then((res) => {
        setVehiculos(res.data);
        setCargando(false);
      })
      .catch((err) => console.error(err));
  }, []);

  // Definir columnas y datos para la tabla
  const columnas = ["Tipo", "Marca", "Placa", "Modelo"];

  // Mapear datos de vehículos para la tabla
  const datos = vehiculos.map((i) => ({
    Tipo: i.tipo_vehiculo.Tipo_vehiculo,
    Marca: i.marca_vehiculo.Marca_vehiculo,
    Placa: i.Placa_vehiculo,
    Modelo: i.Modelo_vehiculo,
  }));

  // Filtrar datos según la búsqueda
  const datosFiltrados = datos.filter((i) =>
    Object.values(i).some((valor) =>
      String(valor).toLowerCase().includes(busqueda.toLowerCase())
    )
  );

  // Función para mostrar alerta después de registrar un vehiculo
  const mostrarAlerta = () => {
    Swal.fire({
      title: "Registro exitoso",
      text: "El vehiculo ha sido registrado correctamente. Selecciona la acción que deseas realizar a continuación:",
      icon: "success",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Finalizar",
      denyButtonText: "Registrar otro vehículo",
      cancelButtonText: "Vincular a propietario",
      confirmButtonColor: "#2c3e50",
      denyButtonColor: "#27ae60",
      cancelButtonColor: "#2980b9",
      reverseButtons: true,
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("✔️ Acción: Finalizar");
      } else if (result.isDenied) {
        console.log("🚗 Acción: Registrar otro vehículo");
        setIsVehiculoOpen(true); // <-- abre el modal del vehículo
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        console.log("📋 Acción: Vincular a propietario");
      }
    });
  };

  // Renderizado condicional: mostrar loader o tabla
  return cargando ? (
    <Loader texto="Cargando vehículos..." />
  ) : (
    <>
      <TablaConPaginacion
        titulo="Vehículos"
        columnas={columnas}
        datos={datosFiltrados}
        placeholderBusqueda="Buscar..."
        textoBoton="Nuevo vehículo"
        onNuevo={() => setIsOpen(true)}
        onBuscar={(valor) => {
          setBusqueda(valor);
          console.log("Buscar propietario:", valor);
        }}
        deshabilitarFechas={true}
      />
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <h2 className="text-2xl font-bold mb-4">Agregar Vehiculo</h2>
        <FormularioVehiculo
          onSubmit={(data) => {
            console.log("Guardar vehiculo:", data);
            setIsOpen(false);
            mostrarAlerta();
          }}
          onCancel={() => setIsOpen(false)}
        />
      </Modal>
    </>
  );
}

export default Vehiculos;
