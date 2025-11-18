import { useEffect, useState } from "react";
import { getIngresos, getIngresosPorRangoFechas } from "../../api/ingresos";
import TablaConPaginacion from "../../components/TablaconPaginacion";
import Loader from "../../components/Loader";
import FiltrosFecha from "../../components/FiltrosFecha";

function Ingresos() {
  const [ingresos, setIngresos] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Filtros
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  useEffect(() => {
    getIngresos()
      .then((res) => {
        setIngresos(res.data);
        setCargando(false);
      })
      .catch((err) => console.error(err));
  }, []);

  const columnas = ["Propietario", "Vehículo", "Fecha", "Hora"];

  const datos = ingresos.map((i) => ({
    Propietario:
      i.propietario.Nombre_propietario +
      " " +
      i.propietario.Apellido_propietario,
    Vehículo: i.vehiculo.Placa_vehiculo,
    Fecha: i.fecha_ingreso,
    Hora: i.hora_ingreso,
  }));

  const filtrarPorFechas = () => {
    if (!fechaInicio || !fechaFin) {
      alert("Por favor, ingrese ambas fechas para filtrar.");
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
    setCargando(true);
    getIngresos()
      .then((res) => {
        setIngresos(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setCargando(false));
  };

  return cargando ? (
    <Loader texto="Cargando ingresos..." />
  ) : (
    <div className="flex flex-col gap-4">
      {/* Filtros */}
      <FiltrosFecha
        fechaInicio={fechaInicio}
        fechaFin={fechaFin}
        setFechaInicio={setFechaInicio}
        setFechaFin={setFechaFin}
        onFiltrar={() => filtrarPorFechas()}
        onReset={limpiarCampos}
      />
      {/* Tabla */}
      <TablaConPaginacion
        titulo="Ingresos"
        columnas={columnas}
        datos={datos}
        placeholderBusqueda="Buscar ingreso..."
        textoBoton="Nuevo ingreso"
        onNuevo={() => console.log("Abrir modal de propietario")}
      />
    </div>
  );
}

export default Ingresos;
