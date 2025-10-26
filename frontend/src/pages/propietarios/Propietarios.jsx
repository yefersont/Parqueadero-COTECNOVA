import { useEffect, useState } from "react";
import {
  getPropietarios,
  getVehiculosByPropietario,
} from "../../api/propietarios";
import { getVehiculos } from "../../api/vehiculos";
import { Car, Calendar, BadgeInfo, X } from "lucide-react";
import TablaPequeña from "../../components/TablaPequeña";
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
  const [vehiculos, setVehiculos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isVehiculoOpen, setIsVehiculoOpen] = useState(false);
  const [isAsociarOpen, setIsAsociarOpen] = useState(false);
  const [isInformationOpen, setIsInformationOpen] = useState(false);
  const { setIdPropietario } = useRegistro();
  const [busqueda, setBusqueda] = useState("");
  const [vehiculosPropietario, setVehiculosPropietario] = useState([]);
  const [idPropietarioSeleccionado, setIdPropietarioSeleccionado] =
    useState(null);
  const [ingresosPropietario, setIngresosPropietario] = useState([]);
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
  const columnas = ["Cédula", "Nombre", "Teléfono", "Rol"];
  const datos = propietarios.map((i) => ({
    idPropietario: i.idPropietario,
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
        cargarVehiculos();
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

      {/* Modal para asociar con un vehiculo existente */}
      <Modal
        isOpen={isAsociarOpen}
        onClose={() => setIsAsociarOpen(false)}
        size="lg"
      >
        <TablaConPaginacion
          titulo="Asociar vehículo existente"
          mostrarControles={false}
          placeholderBusqueda="Buscar vehículo..."
          columnas={["Placa", "Marca", "Modelo", "Tipo", "Acción"]}
          datos={vehiculos.map((v) => ({
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
                className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-3 py-1 rounded-md hover:from-blue-700 hover:to-blue-600 transition-all text-sm"
              >
                Asociar
              </button>
            ),
          }))}
          porPagina={6}
        />
      </Modal>

      {/* Modal informacion */}
      <Modal
        isOpen={isInformationOpen}
        onClose={() => setIsInformationOpen(false)}
      >
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

        <div className="mt-4 text-right border-t pt-3">
          <button
            onClick={() => setIsInformationOpen(false)}
            className="px-5 py-1.5 bg-gradient-to-r from-green-600 to-green-500 text-white text-sm font-medium rounded-md hover:from-green-700 hover:to-green-600 transition-all"
          >
            Cerrar
          </button>
        </div>
      </Modal>
    </>
  );
}

export default Propietarios;
