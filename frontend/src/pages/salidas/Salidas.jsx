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

  const columnas = [
    "Nombre",
    "Vehiculo",
    "Fecha y hora de ingreso",
    "Fecha y hora salida",
  ];

  const datos = salidas.map((i) => ({
    Nombre:
      i.ingreso.propietario.Nombre_propietario +
      " " +
      i.ingreso.propietario.Apellido_propietario,
    Vehiculo: i.ingreso.vehiculo.Placa_vehiculo,
    "Fecha y hora de ingreso":
      i.ingreso.fecha_ingreso + " - " + i.ingreso.hora_ingreso,
    "Fecha y hora salida": i.fecha_salida + " - " + i.hora_salida,
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
