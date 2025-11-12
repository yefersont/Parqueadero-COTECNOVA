import { useEffect, useState } from "react";
import { getIngresos } from "../../api/ingresos";
import TablaConPaginacion from "../../components/TablaconPaginacion";
import Loader from "../../components/Loader";

function Ingresos() {
  const [ingresos, setIngresos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    getIngresos()
      .then((res) => {
        setIngresos(res.data);
        setCargando(false);
      })
      .catch((err) => console.error(err));
  }, []);

  const columnas = ["Propietario", "Vehículo", "Fecha y hora"];

  const datos = ingresos.map((i) => ({
    Propietario:
      i.propietario.Nombre_propietario +
      " " +
      i.propietario.Apellido_propietario,
    Vehículo: i.vehiculo.Placa_vehiculo,
    "Fecha y hora": i.fecha_ingreso + "   " + i.hora_ingreso,
  }));

  return cargando ? (
    <Loader texto="Cargando ingresos..." />
  ) : (
    <TablaConPaginacion
      titulo="Ingresos"
      columnas={columnas}
      datos={datos}
      placeholderBusqueda="Buscar ingreso..."
      textoBoton="Nuevo ingreso"
      onNuevo={() => console.log("Abrir modal de propietario")}
    />
  );
}

export default Ingresos;
