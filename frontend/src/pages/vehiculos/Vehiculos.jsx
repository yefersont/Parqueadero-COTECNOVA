import { useEffect, useState } from "react";
import { Edit2Icon, Link, X, SquarePen, Trash2 } from "lucide-react";
import {
  getVehiculos,
  getPropietarioByVehiculo,
  deleteVehiculo,
} from "../../api/vehiculos";
import { motion } from "framer-motion";
import { Search, UserCheck } from "lucide-react";
import { getPropietarios } from "../../api/propietarios";
import { createVehiculoHasPropietario } from "../../api/vehiculohaspropietario";
import TablaConPaginacion from "../../components/TablaconPaginacion";
import TablaPequeña from "../../components/TablaPequeña";
import Modal from "../../components/Modal";
import FormularioVehiculo from "../../components/FormularioVehiculo";
import Loader from "../../components/Loader";
import Swal from "sweetalert2";
import { useRegistro } from "../../context/RegistroContext";
import { useAuth } from "../../context/AuthContext";
function Vehiculos() {
  // Estados para vehículos y cargado
  const [vehiculos, setVehiculos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [Propietarios, setPropietarios] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  // Filtro de busqueda para propietarios
  const [filtroBusqueda, setFiltroBusqueda] = useState("");
  // Estado para modal editar vehículo
  const [isEdit, setIsEdit] = useState(false);
  // Estado para modal información vehículo
  const [isInformationOpen, setIsInformationOpen] = useState(false);
  // Variables de estado para alamcenar propietarios de un vehículo
  const [propietariosVehiculo, setPropietariosVehiculo] = useState([]);
  // Estado para vehículo seleccionado al editar
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(null);
  // Estado para abrir el modal de vincular vehiculo a propietario
  const [isAsociarOpen, setIsAsociarOpen] = useState(false);

  // Guardamos el id  del vehiculo desde el contexto
  const { idVehiculo, setVehiculoPropietario } = useRegistro();

  // Verificar si el usuario es administrador
  const { isAdmin } = useAuth();

  // Cargar vehículos al montar el componente
  useEffect(() => {
    cargarVehiculos();
  }, []);

  const cargarVehiculos = () => {
    getVehiculos()
      .then((res) => {
        setVehiculos(res.data);
        setCargando(false);
      })
      .catch((err) => console.error(err));
  };
  // Definir columnas y datos para la tabla
  const columnas = ["Tipo", "Marca", "Placa", "Modelo", "Acciones"];

  // Mapear datos de vehículos para la tabla
  const datos = vehiculos.map((i) => ({
    idVehiculo: i.idVehiculo,
    Tipo: i.tipo_vehiculo.Tipo_vehiculo,
    Marca: i.marca_vehiculo.Marca_vehiculo,
    Placa: i.Placa_vehiculo,
    Modelo: i.Modelo_vehiculo,
    Acciones: isAdmin() ? (
      <>
        <button
          onClick={(e) => {
            e.stopPropagation();
            console.log(i.idVehiculo);
            setVehiculoPropietario(i.idVehiculo);
            cargarPropietarios();
          }}
          className="mr-2 rounded-md bg-green-50 hover:bg-green-100 text-green-600 hover:text-green-700 transition-all duration-200"
          title="Vincular Propietario"
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
          title="Editar vehiculo"
        >
          <SquarePen size={18} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            eliminarVehiculo(i.idVehiculo);
          }}
          className="ml-4 rounded-md bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 transition-all duration-200"
          title="Eliminar Vehiculo"
        >
          <Trash2 size={18} />
        </button>
      </>
    ) : (
      <span className="text-gray-400 text-sm italic">Solo lectura</span>
    ),
  }));

  const cargarPropietarios = () => {
    setIsAsociarOpen(true);
    getPropietarios()
      .then((res) => {
        console.log("Propietarios cargados:", res.data);
        setPropietarios(res.data);
      })
      .catch((err) => console.error(err));
  };

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

  // Función para mostrar alerta después de actualizar un vehiculo
  const mostrarAlertaActualizado = () => {
    Swal.fire({
      title: "Vehículo actualizado",
      text: "Los datos del vehículo se han guardado correctamente.",
      icon: "success",
      timer: 2000, // se cierra automáticamente en 2 segundos
      timerProgressBar: true,
      showConfirmButton: false,
      position: "center",
      background: "#f9fafb",
      color: "#2c3e50",
    });
  };

  // Alerta para confirmar eliminación de un vehículo
  const confirmarEliminacion = () => {
    return Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará el vehículo de forma permanente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#e53935",
      cancelButtonColor: "#546e7a",
      reverseButtons: true,
      focusCancel: true,
    });
  };

  const mostrarAlertaEliminado = () => {
    Swal.fire({
      title: "Vehículo eliminado",
      text: "El vehículo ha sido eliminado correctamente.",
      icon: "success",
      timer: 2000,
      showConfirmButton: false,
      position: "center",
      background: "#f9fafb",
      color: "#2c3e50",
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

  // para abrir el modal de editar vehiculo
  const editVehiculo = (vehiculo) => {
    setVehiculoSeleccionado(vehiculo);
    setIsEdit(true);
  };

  const eliminarVehiculo = (id) => {
    confirmarEliminacion().then((result) => {
      if (result.isConfirmed) {
        deleteVehiculo(id)
          .then((res) => {
            mostrarAlertaEliminado();
            cargarVehiculos();
          })
          .catch((err) => {
            console.error("Error al eliminar vehículo:", err);
          });
      }
    });
  };

  const AlertAsociacion = () => {
    Swal.fire({
      title: "Propietario asociado con éxito",
      icon: "success",
      showConfirmButton: false,
      timer: 1500,
    });
  };

  const asociarPropietario = (newPropietario) => {
    console.log(
      "Asociando propietario:",
      newPropietario,
      "al vehículo:",
      idVehiculo
    );
    const form = {
      Vehiculo_idVehiculo: idVehiculo,
      Propietario_idPropietario: newPropietario,
    };
    createVehiculoHasPropietario(form)
      .then((res) => {
        console.log("Vehículo asociado al propietario:", res.data);
        AlertAsociacion();
      })
      .catch((err) => {
        console.error("Error al asociar vehículo al propietario:", err);
      });
  };

  const propietariosFiltrados = Propietarios.filter((p) => {
    const term = filtroBusqueda.toLowerCase();
    const cedula = String(p.Cedula_propietario);
    const nombreCompleto =
      `${p.Nombre_propietario} ${p.Apellido_propietario}`.toLowerCase();
    const rol = p.rol?.Rol?.toLowerCase() || "";
    return (
      cedula.includes(term) ||
      nombreCompleto.includes(term) ||
      rol.includes(term)
    );
  });

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
        mostrarFiltrosFecha={false}
        textoBoton={isAdmin() ? "Nuevo vehículo" : null}
        onNuevo={isAdmin() ? () => setIsOpen(true) : null}
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
        <div className="border-b pb-3 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              Agregar Vehículo
            </span>
          </h2>
        </div>
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
        <div className="border-b pb-3 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              Editar Vehículo
            </span>
          </h2>
        </div>
        <FormularioVehiculo
          editar={true}
          valoresIniciales={vehiculoSeleccionado}
          onSubmit={(data) => {
            console.log("Editar vehículo:", data);
            setIsEdit(false);
            mostrarAlertaActualizado();
            cargarVehiculos();
          }}
          onCancel={() => setIsEdit(false)}
        />
      </Modal>

      {/* Modal para Seleccionar Propietario */}
      <Modal
        isOpen={isAsociarOpen}
        onClose={() => setIsAsociarOpen(false)}
        size="lg"
      >
        <div className="p-8">
          {/* ---------- Título ---------- */}
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 border-b pb-2 border-gray-100">
            Vincular Propietario
          </h2>

          {/* ---------- Input de búsqueda ---------- */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="relative mb-6"
          >
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por Cédula, Nombre o Rol..."
              value={filtroBusqueda}
              onChange={(e) => setFiltroBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl 
                   focus:border-green-600 focus:ring-1 focus:ring-green-300 
                   focus:outline-none transition-colors text-base"
            />
          </motion.div>

          {/* ---------- Tabla ---------- */}
          <TablaConPaginacion
            titulo=""
            mostrarControles={false}
            datos={propietariosFiltrados.map((p) => ({
              Cédula: p.Cedula_propietario,
              Nombre: `${p.Nombre_propietario} ${p.Apellido_propietario}`,
              Teléfono: p.Telefono_propietario,
              Rol: p.rol?.Rol || "—",
              Acción: (
                <button
                  onClick={() => {
                    console.log("Seleccionar propietario:", p.idPropietario);
                    Swal.fire({
                      title: `¿Asociar a ${p.Nombre_propietario} ${p.Apellido_propietario}?`,
                      icon: "question",
                      showCancelButton: true,
                      confirmButtonText: "Sí, asociar",
                      cancelButtonText: "Cancelar",
                      confirmButtonColor: "#27ae60",
                      cancelButtonColor: "#c0392b",
                    }).then((result) => {
                      if (result.isConfirmed) {
                        asociarPropietario(p.idPropietario);
                        setIsAsociarOpen(false);
                      }
                    });
                  }}
                  className="bg-green-600 text-white px-3.5 py-1.5 rounded-lg 
                       hover:bg-green-700 transition-all text-sm font-semibold 
                       focus:outline-none focus:ring-2 focus:ring-green-300
                       flex items-center gap-1.5"
                >
                  <Link size={16} />
                  Asociar
                </button>
              ),
            }))}
            columnas={["Cédula", "Nombre", "Teléfono", "Rol", "Acción"]}
            porPagina={4}
          />
        </div>
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
            porPagina={6}
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
