import { useEffect, useState } from "react";
import { getIngresos, getIngresosPorRangoFechas } from "../../api/ingresos";
import TablaConPaginacion from "../../components/TablaconPaginacion";
import Loader from "../../components/Loader";
import FiltrosFecha from "../../components/FiltrosFecha";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { generarPDFIngresos } from "../../utils/pdfGenerator";

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
        console.log(res.data);
        setIngresos(res.data);
        setIngresosOriginales(res.data);
        setCargando(false);
      })
      .catch((err) => console.error(err));
  }, []);

  const columnas = [
    "Propietario",
    "cedula Propietario",
    "Rol Propietario",
    "Vehículo",
    "Fecha Ingreso",
    "Hora Ingreso",
    "Fecha Salida",
    "Hora Salida",
  ];

  const datos = ingresos.map((i) => ({
    Propietario: `${i.propietario?.Nombre_propietario ?? ""} ${
      i.propietario?.Apellido_propietario ?? ""
    }`,
    Cedula: i.propietario?.Cedula_propietario ?? "",
    Rol: i.propietario?.rol?.Rol ?? "",
    Vehículo: i.vehiculo?.Placa_vehiculo ?? "",
    Fecha: i.fecha_ingreso ?? "",
    Hora: i.hora_ingreso ?? "",
    FechaSalida: i.salidas?.fecha_salida ?? "--/--/--",
    HoraSalida: i.salidas?.hora_salida ?? "--/--/--",
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

  const exportarPDF = () => {
    if (datosFiltrados.length === 0) {
      Swal.fire({
        title: "Sin datos",
        text: "No hay datos para exportar.",
        icon: "info",
        confirmButtonText: "Entendido",
      });
      return;
    }

    generarPDFIngresos(datosFiltrados);
  };

  return cargando ? (
    <Loader texto="Cargando ingresos..." />
  ) : (
    <div className="flex flex-col gap-4">
      <TablaConPaginacion
        titulo="Ingresos"
        porPagina={8}
        columnas={columnas}
        datos={datosFiltrados}
        placeholderBusqueda="Buscar ingreso..."
        textoBoton="Nuevo ingreso"
        onBuscar={setBusqueda}
        onNuevo={() => console.log("Abrir modal de ingreso")}
        extraControls={
          <div className="flex w-full justify-between items-center">
            {/* Filtros a la izquierda */}
            <FiltrosFecha
              fechaInicio={fechaInicio}
              fechaFin={fechaFin}
              setFechaInicio={setFechaInicio}
              setFechaFin={setFechaFin}
              onFiltrar={filtrarPorFechas}
              onReset={limpiarCampos}
            />

            {/* Botones de exportación a la derecha */}
            <div className="flex gap-2 mt-5">
              {/* Botón Excel */}
              <button
                onClick={exportarExcel}
                className="
          bg-gray-200 text-gray-700 
          px-4 py-2 rounded-xl 
          hover:bg-gray-300 
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

              {/* Botón PDF */}
              <button
                onClick={exportarPDF}
                className="
          bg-gray-200 text-gray-700 
          px-4 py-2 rounded-xl 
          hover:bg-gray-300 
          transition-all shadow
          flex items-center gap-2
        "
                title="Exportar a PDF"
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
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                Exportar PDF
              </button>
            </div>
          </div>
        }
      />
    </div>
  );
}

export default Ingresos;
