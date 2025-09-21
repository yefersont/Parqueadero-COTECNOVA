import { useEffect, useState } from "react";
import { getPropietarios } from "../../api/propietarios";
import TablaConPaginacion from "../../components/TablaconPaginacion";
import Loader from "../../components/Loader";
import Modal from "../../components/Modal";
import FormularioPropietario from "../../components/FormularioPropietarios";

function Propietarios() {
  const [propietarios, setPropietarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    getPropietarios()
      .then((res) => {
        setPropietarios(res.data);
        setCargando(false);
      })
      .catch((err) => console.error(err));
  }, []);

  const columnas = ["Cédula", "Nombre", "Apellido", "Teléfono", "Rol"];
  const datos = propietarios.map((i) => ({
    Cédula: i.Cedula_propietario,
    Nombre: i.Nombre_propietario,
    Apellido: i.Apellido_propietario,
    Teléfono: i.Telefono_propietario,
    Rol: i.rol.Rol,
  }));

  const datosFiltrados = datos.filter((i) =>
    Object.values(i).some((valor) =>
      String(valor).toLowerCase().includes(busqueda.toLowerCase())
    )
  );

  return cargando ? (
    <Loader texto="Cargando propietarios..." />
  ) : (
    <>
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
      />

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <h2 className="text-2xl font-bold mb-4">Agregar propietario</h2>
        <FormularioPropietario
          onSubmit={(data) => {
            console.log("Guardar propietario:", data);
            setIsOpen(false);
          }}
          onCancel={() => setIsOpen(false)}
        />
      </Modal>
    </>
  );
}

export default Propietarios;
