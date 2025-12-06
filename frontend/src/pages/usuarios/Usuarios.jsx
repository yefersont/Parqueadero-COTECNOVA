import { useEffect, useState } from "react";
import { getUsuarios } from "../../api/usuarios";
import TablaConPaginacion from "../../components/TablaConPaginacion";

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    getUsuarios()
      .then((res) => {
        setUsuarios(res.data);
        console.log(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  const columnas = ["ID", "Nombres", "Usuario", "Email", "Cédula"];

  const data = usuarios.map((usuario) => ({
    idUsuario: usuario.idUsuario,
    Nombres: usuario.Nombres,
    user_usuario: usuario.user_usuario,
    email: usuario.email,
    Cedula_usuario: usuario.Cedula_usuario,
  }));

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <TablaConPaginacion
        titulo="Usuarios"
        columnas={columnas}
        datos={data}
        placeholderBusqueda="Buscar usuario..."
        deshabilitarFechas={true}
      />
    </div>
  );
}

export default Usuarios;
