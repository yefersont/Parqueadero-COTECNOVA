import { useEffect, useState } from "react";
import { getSalidas } from "../../api/salidas";
import TablaConPaginacion from "../../components/TablaconPaginacion";
import Loader from "../../components/Loader";
function Salidas() {
  const [salidas, setSalidas] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    getSalidas()
      .then((res) => {
        setSalidas(res.data);
        setCargando(false);
      })
      .catch((err) => console.error(err));
  }, []);

  const columnas = ["ID Ingreso", "Fecha de salida", "Hora de salida"];

  const datos = salidas.map((i) => ({
    "ID Ingreso": i.Ingresos_idIngresos,
    "Fecha de salida": i.fecha_salida,
    "Hora de salida": i.hora_salida,
  }));

  return cargando ? (
    <Loader texto="Cargando salidas..." />
  ) : (
    <TablaConPaginacion
      titulo="Salidas"
      columnas={columnas}
      datos={datos}
      placeholderBusqueda="Buscar salida..."
      textoBoton="Nueva salida"
      onNuevo={() => console.log("Abrir modal de propietario")}
    />
  );
}

export default Salidas;
