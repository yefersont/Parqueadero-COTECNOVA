import { useEffect, useState } from "react";
import { Edit2Icon, Link, X, SquarePen } from "lucide-react";
import { getVehiculos, getPropietarioByVehiculo } from "../../api/vehiculos";
import TablaConPaginacion from "../../components/TablaconPaginacion";
import TablaPequeña from "../../components/TablaPequeña";
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
  // Estado para modal editar vehículo
  const [isEdit, setIsEdit] = useState(false);
  // Estado para modal información vehículo
  const [isInformationOpen, setIsInformationOpen] = useState(false);
  // Variables de estado para alamcenar propietarios de un vehículo
  const [propietariosVehiculo, setPropietariosVehiculo] = useState([]);
  // Estado para vehículo seleccionado al editar
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(null);

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
  const columnas = ["Tipo", "Marca", "Placa", "Modelo", "Acciones"];

  // Mapear datos de vehículos para la tabla
  const datos = vehiculos.map((i) => ({
    idVehiculo: i.idVehiculo,
    Tipo: i.tipo_vehiculo.Tipo_vehiculo,
    Marca: i.marca_vehiculo.Marca_vehiculo,
    Placa: i.Placa_vehiculo,
    Modelo: i.Modelo_vehiculo,
    Acciones: (
      <>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIdPropietario(i.idPropietario);
            cargarVehiculos();
          }}
          className="mr-2 rounded-md bg-green-50 hover:bg-green-100 text-green-600 hover:text-green-700 transition-all duration-200"
        >
          <Link size={18} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            console.log("Editar vehículo:", i.idVehiculo);
            editVehiculo(i);
            console.log(i);
          }}
          className="ml-2 rounded-md bg-yellow-50 hover:bg-green-100 text-yellow-600 hover:text-yellow-700 transition-all duration-200"
        >
          <SquarePen size={18} />
        </button>
      </>
    ),
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
  const informacionVehiculo = (id) => {
    setIsInformationOpen(true);
    setPropietariosVehiculo([]);
    getPropietarioByVehiculo(id)
      .then((res) => {
        console.log("Propietario del vehículo:", res.data.propietarios || []);
        setPropietariosVehiculo(res.data.propietarios || []);
      })
      .catch((err) => {
        console.error(err);
        setPropietariosVehiculo([]);
      });
  };

  const editVehiculo = (vehiculo) => {
    setVehiculoSeleccionado(vehiculo);
    setIsEdit(true);
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
        onRowClick={(fila) => {
          informacionVehiculo(fila.idVehiculo);
        }}
      />

      {/* Modal para agregar un vehiculo */}
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

      {/* Modal para editar un vehículo */}
      <Modal isOpen={isEdit} onClose={() => setIsEdit(false)}>
        <h2 className="text-2xl font-bold mb-4">Editar Vehículo</h2>
        <FormularioVehiculo
          editar={true}
          valoresIniciales={vehiculoSeleccionado}
          onSubmit={(data) => {
            console.log("Editar vehículo:", data);
            setIsEdit(false);
          }}
          onCancel={() => setIsEdit(false)}
        />
      </Modal>

      {/* Modal informacion del vehiculo */}
      <Modal
        isOpen={isInformationOpen}
        onClose={() => setIsInformationOpen(false)}
        size="md"
      >
        <div className="flex flex-col items-start justify-between gap-4">
          {/* Encabezado elegante */}
          <div className="w-full flex items-center justify-between border-b pb-3">
            <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
              <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                Propietarios del Vehículo
              </span>
            </h2>
          </div>

          {/* Tabla */}
          <TablaPequeña
            columnas={["Cédula", "Nombre", "Apellido", "Teléfono"]}
            datos={propietariosVehiculo.map((p) => ({
              Cédula: p.Cedula_propietario,
              Nombre: p.Nombre_propietario,
              Apellido: p.Apellido_propietario,
              Teléfono: p.Telefono_propietario,
            }))}
            porPagina={3}
          />

          {/* Pie de modal */}
          <div className="w-full flex justify-end border-t pt-3">
            <button
              onClick={() => setIsInformationOpen(false)}
              className="px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-md shadow-sm hover:from-blue-700 hover:to-blue-600 transition-all text-sm font-medium"
            >
              Cerrar
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default Vehiculos;
