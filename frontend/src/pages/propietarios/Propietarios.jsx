import { useEffect, useState } from "react";
import {
  getPropietarios,
  getVehiculosByPropietario,
  deletePropietario,
} from "../../api/propietarios";
import { getVehiculos } from "../../api/vehiculos";
import {
  Car,
  Calendar,
  BadgeInfo,
  X,
  SquarePen,
  Trash2,
  Link,
  Search, // Añadido para el icono del input
} from "lucide-react";
import TablaPequeña from "../../components/TablaPequeña";
import TablaConPaginacion from "../../components/TablaconPaginacion";
import Loader from "../../components/Loader";
import Modal from "../../components/Modal";
import FormularioPropietario from "../../components/FormularioPropietarios";
import FormularioVehiculo from "../../components/FormularioVehiculo";
import { useRegistro } from "../../context/RegistroContext";
import { createVehiculoHasPropietario } from "../../api/vehiculohaspropietario";
import { motion } from "framer-motion"; // Importar motion para la animación del input

import Swal from "sweetalert2";

function Propietarios() {
  const [propietarios, setPropietarios] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  // Variable de estado para abrir el modal editar
  const [isEdit, setIsEdit] = useState(false);
  const [isVehiculoOpen, setIsVehiculoOpen] = useState(false);
  const [isAsociarOpen, setIsAsociarOpen] = useState(false);
  const [isInformationOpen, setIsInformationOpen] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [vehiculosPropietario, setVehiculosPropietario] = useState([]);
  const [PropietarioSeleccionado, setPropietarioSeleccionado] = useState(null);
  const [ingresosPropietario, setIngresosPropietario] = useState([]);

  const { idPropietario, setIdPropietario } = useRegistro();

  // filtro para busqueda en modal asociar vehiculo
  const [filtroBusqueda, setFiltroBusqueda] = useState("");

  useEffect(() => {
    cargarPropietarios();
  }, []);

  const cargarPropietarios = () => {
    getPropietarios()
      .then((res) => {
        setPropietarios(res.data);
        setCargando(false);
      })
      .catch((err) => console.error(err));
  };

  // Campos para la tabla propietarios
  const columnas = ["Cédula", "Nombre", "Teléfono", "Rol", "Acción"];

  // Datos para la tabla propietarios
  const datos = propietarios.map((i) => ({
    idPropietario: i.idPropietario,
    Cédula: i.Cedula_propietario,
    Nombre: i.Nombre_propietario + "  " + i.Apellido_propietario,
    Teléfono: i.Telefono_propietario,
    Rol: i.rol.Rol,
    Acción: (
      <div className="flex items-center gap-2 justify-center">
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
            console.log(i.idPropietario);
            editarPropietario(i);
          }}
          className=" rounded-md bg-yellow-50 hover:bg-yellow-100 text-yellow-600 hover:text-yellow-700 transition-all duration-200"
        >
          <SquarePen size={18} />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            console.log(i.idPropietario);
            eliminarPropietario(i.idPropietario);
          }}
          className="ml-2 rounded-md bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 transition-all duration-200"
        >
          <Trash2 size={18} />
        </button>
      </div>
    ),
  }));

  const datosFiltrados = datos.filter((i) =>
    Object.values(i).some((valor) =>
      String(valor).toLowerCase().includes(busqueda.toLowerCase())
    )
  );
  const confirmarEliminacionPropietario = () => {
    return Swal.fire({
      title: "¿Estás seguro?",
      // CAMBIO: El texto ahora se refiere a la eliminación del propietario.
      text: "Esta acción eliminará al propietario y toda su información asociada de forma permanente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar propietario", // Botón más específico
      cancelButtonText: "Cancelar",
      // Se mantienen los colores y estilos elegantes
      confirmButtonColor: "#e53935", // Rojo para eliminar
      cancelButtonColor: "#546e7a", // Gris/Azul para cancelar
      reverseButtons: true,
      focusCancel: true,
    });
  };

  const mostrarAlertaEliminadoPropietario = () => {
    Swal.fire({
      title: "Propietario eliminado", // CAMBIO: Título actualizado
      text: "El propietario ha sido eliminado correctamente.", // CAMBIO: Texto actualizado
      icon: "success",
      timer: 2000,
      showConfirmButton: false,
      position: "center",
      background: "#f9fafb", // Fondo gris muy claro
      color: "#2c3e50", // Color de texto oscuro
    });
  };

  const eliminarPropietario = (id) => {
    confirmarEliminacionPropietario().then((result) => {
      if (result.isConfirmed) {
        deletePropietario(id)
          .then(() => {
            mostrarAlertaEliminadoPropietario();
            cargarPropietarios();
          })
          .catch((err) => console.error(err));
      }
    });
  };

  // Alerta de registro exitoso
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
        cargarVehiculos();
      }
    });
  };

  const mostrarAlertaPropietarioActualizado = () => {
    Swal.fire({
      title: "Propietario actualizado",
      text: "Los datos del propietario se han guardado correctamente.",
      icon: "success",
      timer: 2000,
      showConfirmButton: false,
      position: "center",
      background: "#f9fafb",
      color: "#2c3e50",
    });
  };

  // Alerta de asociación exitosa
  const AlertAsociacion = () => {
    Swal.fire({
      title: "Vehiculo asociado con éxito",
      icon: "success",
      showConfirmButton: false,
      timer: 1500,
    });
  };

  // Funcion para asociar el vehiculo al propietario
  const asociar = (newVehiculo) => {
    const form = {
      Vehiculo_idVehiculo: newVehiculo,
      Propietario_idPropietario: idPropietario,
    };
    createVehiculoHasPropietario(form)
      .then((res) => {
        console.log(" Asociación creada correctamente:", res.data);
        AlertAsociacion();
      })
      .catch((err) => {
        console.error("Error al asociar vehículo y propietario:", err);
        console.log("Datos enviados:", form);
      });
  };

  // Funcion para editar un propietario
  const editarPropietario = (propietario) => {
    setPropietarioSeleccionado(propietario);
    setIsEdit(true);
  };

  // Funcion para visualizar la informacion del propietario (vehiculos e ingresos)
  const informacioPropietario = (id) => {
    setIsInformationOpen(true);

    getVehiculosByPropietario(id)
      .then((res) => {
        console.log("📦 Datos del propietario:", res.data);
        setVehiculosPropietario(res.data.vehiculos || []);
        setIngresosPropietario(res.data.ultimos_ingresos || []);
      })
      .catch((err) => {
        console.error("❌ Error al obtener los datos del propietario:", err);
        setVehiculosPropietario([]);
        setIngresosPropietario([]);
      });
  };

  // Funcion para cargar los vevhiculos disponibles
  const cargarVehiculos = () => {
    setIsAsociarOpen(true);
    getVehiculos()
      .then((res) => {
        console.log("🚗 Vehículos cargados:", res.data);
        setVehiculos(res.data);
      })
      .catch((err) => {
        console.error("❌ Error al cargar vehículos:", err);
      });
  };

  // LÓGICA DE FILTRADO PARA EL MODAL DE ASOCIACIÓN
  const vehiculosFiltrados = vehiculos.filter((v) => {
    const term = filtroBusqueda.toLowerCase();
    const placa = v.Placa_vehiculo?.toLowerCase() || "";
    const modelo = v.Modelo_vehiculo?.toLowerCase() || "";
    const marca = v.marca_vehiculo?.Marca_vehiculo?.toLowerCase() || "";
    const tipo = v.tipo_vehiculo?.Tipo_vehiculo?.toLowerCase() || "";

    return (
      placa.includes(term) ||
      modelo.includes(term) ||
      marca.includes(term) ||
      tipo.includes(term)
    );
  });

  // ------------------------------------------------------------------

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
          informacioPropietario(fila.idPropietario);
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
            cargarPropietarios();
          }}
          onCancel={() => setIsOpen(false)}
        />
      </Modal>

      {/* Moda para editar un propietario */}
      <Modal isOpen={isEdit} onClose={() => setIsEdit(false)}>
        <h2 className="text-2xl font-bold mb-4">Editar propietario</h2>
        <FormularioPropietario
          editar={true}
          valoresIniciales={PropietarioSeleccionado}
          onSubmit={(data) => {
            console.log("Editar propietario", data);
            setIsEdit(false);
            mostrarAlertaPropietarioActualizado();
            cargarPropietarios();
          }}
          onCancel={() => setIsEdit(false)}
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

      {/* Modal para asociar con un vehiculo existente (MODIFICADO) */}
      <Modal
        isOpen={isAsociarOpen}
        onClose={() => setIsAsociarOpen(false)}
        size="lg"
      >
        {/* Contenedor con padding para el estilo minimalista/elegante */}
        <div className="p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 border-b pb-2 border-gray-100">
            Asociar vehículo existente
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
              placeholder="Buscar por Placa, Marca o Modelo..."
              value={filtroBusqueda}
              onChange={(e) => setFiltroBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:border-blue-600 focus:ring-1 focus:ring-blue-300 focus:outline-none transition-colors text-base"
            />
          </motion.div>

          <TablaConPaginacion
            titulo=""
            mostrarControles={false}
            // CAMBIO: Pasa los datos FILTRADOS
            datos={vehiculosFiltrados.map((v) => ({
              Placa: v.Placa_vehiculo,
              Marca: v.marca_vehiculo?.Marca_vehiculo || "—",
              Modelo: v.Modelo_vehiculo,
              Tipo: v.tipo_vehiculo?.Tipo_vehiculo || "—",
              Acción: (
                <button
                  onClick={() => {
                    Swal.fire({
                      title: `¿Asociar el vehículo ${v.Placa_vehiculo}?`,
                      icon: "question",
                      showCancelButton: true,
                      confirmButtonText: "Sí, asociar",
                      cancelButtonText: "Cancelar",
                      confirmButtonColor: "#27ae60",
                      cancelButtonColor: "#c0392b",
                    }).then((result) => {
                      if (result.isConfirmed) {
                        asociar(v.idVehiculo);
                        setIsAsociarOpen(false);
                      }
                    });
                  }}
                  className="bg-blue-600 text-white px-3.5 py-1.5 rounded-lg hover:bg-blue-700 transition-all text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  Asociar
                </button>
              ),
            }))}
            columnas={["Placa", "Marca", "Modelo", "Tipo", "Acción"]}
            porPagina={4}
          />
        </div>
      </Modal>

      {/* Modal informacion  */}
      <Modal
        isOpen={isInformationOpen}
        onClose={() => setIsInformationOpen(false)}
        size="lg" // Cambiado a 'lg' para dar espacio a dos TablasPequeñas
      >
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 border-b pb-2 border-gray-100">
            Información del Propietario
          </h2>

          <TablaPequeña
            titulo="Vehículos asociados"
            columnas={["Placa", "Marca", "Modelo", "Tipo"]}
            datos={vehiculosPropietario.map((v) => ({
              Placa: v.Placa_vehiculo,
              Marca: v.marca_vehiculo?.Marca_vehiculo || "—",
              Modelo: v.Modelo_vehiculo,
              Tipo: v.tipo_vehiculo?.Tipo_vehiculo || "—",
            }))}
            porPagina={3}
          />

          <TablaPequeña
            titulo="Últimos ingresos"
            columnas={["Vehículo", "Fecha ingreso", "Hora ingreso", "Salida"]}
            datos={ingresosPropietario.map((i) => ({
              Vehículo: i.vehiculo?.Placa_vehiculo || "—",
              "Fecha ingreso": i.fecha_ingreso,
              "Hora ingreso": i.hora_ingreso,
              Salida: i.salidas
                ? `${i.salidas.fecha_salida} ${i.salidas.hora_salida}`
                : "Pendiente",
            }))}
            porPagina={3}
          />

          <div className="mt-6 text-right border-t pt-4">
            <button
              onClick={() => setIsInformationOpen(false)}
              className="px-5 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-all focus:outline-none focus:ring-2 focus:ring-green-300"
            >
              Cerrar
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default Propietarios;
