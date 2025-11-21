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
          <div className="flex w-full justify-between items-end">
            {/* Filtros a la izquierda */}
            <FiltrosFecha
              fechaInicio={fechaInicio}
              fechaFin={fechaFin}
              setFechaInicio={setFechaInicio}
              setFechaFin={setFechaFin}
              onFiltrar={filtrarPorFechas}
              onReset={limpiarCampos}
            />

            {/* Botón Excel a la derecha */}
            <button
              onClick={exportarExcel}
              className="
        bg-black text-white 
        px-4 py-2 rounded-xl 
        hover:opacity-90 
        transition-all shadow
        flex items-center gap-2
      "
              title="Exportar a Excel"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                />
              </svg>
              Exportar Excel
            </button>
          </div>
        }
      />
    </div>
  );
}

export default Ingresos;
