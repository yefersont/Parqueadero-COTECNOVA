import { useEffect, useState } from "react";
import { getUsuarios } from "../../api/usuarios";
import TablaConPaginacion from "../../components/TablaConPaginacion";

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    getUsuarios()
      .then((res) => {
        setUsuarios(res.data);
      })
      .catch((err) => console.error(err));

    // Detectar móvil
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const columnas = isMobile
    ? ["Usuario"] // En móvil solo mostramos 1 columna (tarjeta)
    : ["ID", "Nombres", "Usuario", "Email", "Cédula", "Último Acceso"];

  // Transformar datos según vista
  const data = usuarios.map((u) => {
    const normalRow = {
      idUsuario: u.idUsuario,
      Nombres: u.Nombres,
      user_usuario: u.user_usuario,
      email: u.email,
      Cedula_usuario: u.Cedula_usuario,
      last_access_at: u.last_access_at,
    };

    // 🔥 En móvil convertimos todo en un solo bloque textual
    if (isMobile) {
      return {
        Usuario: (
          <div className="p-3 rounded-xl border bg-white shadow-sm">
            <p>
              <strong>ID:</strong> {u.idUsuario}
            </p>
            <p>
              <strong>Nombre:</strong> {u.Nombres}
            </p>
            <p>
              <strong>Usuario:</strong> {u.user_usuario}
            </p>
            <p>
              <strong>Email:</strong> {u.email}
            </p>
            <p>
              <strong>Cédula:</strong> {u.Cedula_usuario}
            </p>
            <p>
              <strong>Último acceso:</strong> {u.last_access_at}
            </p>
          </div>
        ),
      };
    }

    return normalRow;
  });

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
