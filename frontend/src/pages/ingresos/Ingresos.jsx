import { useEffect, useState } from "react";
import { getIngresos, getIngresosPorRangoFechas } from "../../api/ingresos";
import TablaConPaginacion from "../../components/TablaconPaginacion";
import Loader from "../../components/Loader";
import FiltrosFecha from "../../components/FiltrosFecha";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

function Ingresos() {
  const [ingresos, setIngresos] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Para la búsqueda
  const [busqueda, setBusqueda] = useState("");

  const [ingresosOriginales, setIngresosOriginales] = useState([]);

  // Filtros
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  useEffect(() => {
    getIngresos()
      .then((res) => {
        setIngresos(res.data);
        setIngresosOriginales(res.data); // ← copia original
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

  // Filtrado por búsqueda
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
      .then((res) => setIngresos(res.data))
      .catch((err) => console.error(err))
      .finally(() => setCargando(false));
  };

  const limpiarCampos = () => {
    setFechaInicio("");
    setFechaFin("");
    setIngresos(ingresosOriginales);
  };

  const exportarExcel = () => {
    if (datosFiltrados.length === 0) {
      Swal.fire({
        title: "Sin datos",
        text: "No hay datos para exportar.",
        icon: "info",
        confirmButtonText: "Entendido",
      });
      return;
    }

    const ws = XLSX.utils.json_to_sheet(datosFiltrados);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Ingresos");

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "ingresos.xlsx");
  };

  return cargando ? (
    <Loader texto="Cargando ingresos..." />
  ) : (
    <div className="flex flex-col gap-4">
      <TablaConPaginacion
        titulo="Ingresos"
        columnas={columnas}
        datos={datosFiltrados}
        placeholderBusqueda="Buscar ingreso..."
        textoBoton="Nuevo ingreso"
        onBuscar={setBusqueda}
        onNuevo={() => console.log("Abrir modal de ingreso")}
        extraControls={
          <div className="flex gap-2 items-end">
            <FiltrosFecha
              fechaInicio={fechaInicio}
              fechaFin={fechaFin}
              setFechaInicio={setFechaInicio}
              setFechaFin={setFechaFin}
              onFiltrar={filtrarPorFechas}
              onReset={limpiarCampos}
            />
            <button
              onClick={exportarExcel}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all"
            >
              Exportar Excel
            </button>
          </div>
        }
      />
    </div>
  );
}

export default Ingresos;
