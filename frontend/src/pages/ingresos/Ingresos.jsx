import { useEffect, useState } from "react";
import { getIngresos, getIngresosPorRangoFechas } from "../../api/ingresos";
import TablaConPaginacion from "../../components/TablaconPaginacion";
import Loader from "../../components/Loader";
import FiltrosFecha from "../../components/FiltrosFecha";
import Swal from "sweetalert2";

function Ingresos() {
  const [ingresos, setIngresos] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Para la busqueda
  const [busqueda, setBusqueda] = useState("");

  const [ingresosOriginales, setIngresosOriginales] = useState([]);

  // Filtros
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  useEffect(() => {
    getIngresos()
      .then((res) => {
        setIngresos(res.data);
        setIngresosOriginales(res.data); // ← COPIA ORIGINAL
        setCargando(false);
      })
      .catch((err) => console.error(err));
  }, []);

  const columnas = ["Propietario", "Vehículo", "Fecha", "Hora"];

  const datos = ingresos.map((i) => ({
    Propietario: `${i.propietario?.Nombre_propietario ?? ""} ${
      i.propietario?.Apellido_propietario ?? ""
    }`,
    Vehículo: i.vehiculo?.Placa_vehiculo ?? "",
    Fecha: i.fecha_ingreso ?? "",
    Hora: i.hora_ingreso ?? "",
  }));

  const datosFiltrados = datos.filter((i) =>
    Object.values(i).some((valor) =>
      String(valor).toLowerCase().includes(busqueda.toLowerCase())
    )
  );

  const alertFechaInvalida = () => {
    Swal.fire({
      title: "Faltan datos",
      text: "Por favor, ingrese ambas fechas para filtrar.",
      icon: "warning",
      confirmButtonText: "Entendido",
      confirmButtonColor: "#16a34a",
      background: "#ffffff",
    });
  };

  const filtrarPorFechas = () => {
    if (!fechaInicio || !fechaFin) {
      alertFechaInvalida();
      return;
    }
    setCargando(true);
    getIngresosPorRangoFechas(fechaInicio, fechaFin)
      .then((res) => {
        setIngresos(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setCargando(false));
  };

  const limpiarCampos = () => {
    setFechaInicio("");
    setFechaFin("");

    // Restauras los datos originales
    setIngresos(ingresosOriginales);
  };

  return cargando ? (
    <Loader texto="Cargando ingresos..." />
  ) : (
    <div className="flex flex-col gap-4">
      {/* Tabla */}
      <TablaConPaginacion
        titulo="Ingresos"
        columnas={columnas}
        datos={datosFiltrados}
        placeholderBusqueda="Buscar ingreso..."
        textoBoton="Nuevo ingreso"
        onBuscar={setBusqueda}
        onNuevo={() => console.log("Abrir modal de propietario")}
        extraControls={
          <FiltrosFecha
            fechaInicio={fechaInicio}
            fechaFin={fechaFin}
            setFechaInicio={setFechaInicio}
            setFechaFin={setFechaFin}
            onFiltrar={filtrarPorFechas}
            onReset={limpiarCampos}
          />
        }
      />
    </div>
  );
}

export default Ingresos;
