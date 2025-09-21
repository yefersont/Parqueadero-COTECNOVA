import { useEffect, useState } from "react";
import { getVehiculos } from "../../api/vehiculos";
import TablaConPaginacion from "../../components/TablaconPaginacion";
import Loader from "../../components/Loader";
function Vehiculos() {
  const [vehiculos, setVehiculos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    getVehiculos()
      .then((res) => {
        setVehiculos(res.data);
        setCargando(false);
      })
      .catch((err) => console.error(err));
  }, []);

  const columnas = ["Tipo", "Marca", "Placa", "Modelo"];

  const datos = vehiculos.map((i) => ({
    Tipo: i.tipo_vehiculo.Tipo_vehiculo,
    Marca: i.Marca_vehiculo,
    Placa: i.Placa_vehiculo,
    Modelo: i.Modelo_vehiculo,
  }));

  const datosFiltrados = datos.filter((i) =>
    Object.values(i).some((valor) =>
      String(valor).toLowerCase().includes(busqueda.toLowerCase())
    )
  );

  return cargando ? (
    <Loader texto="Cargando vehículos..." />
  ) : (
    <TablaConPaginacion
      titulo="Vehículos"
      columnas={columnas}
      datos={datosFiltrados}
      placeholderBusqueda="Buscar..."
      textoBoton="Nuevo vehículo"
      onNuevo={() => setIsOpen(true)}
      onBuscar={(valor) => {
        setBusqueda(valor);
        console.log("Buscar propietario:", valor);
      }}
      deshabilitarFechas={true}
    />
  );
}

export default Vehiculos;
