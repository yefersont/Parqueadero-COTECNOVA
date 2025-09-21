import { useEffect, useState } from "react";
import { getUsuarios } from "../../api/usuarios";

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    getUsuarios()
      .then((res) => setUsuarios(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h1>Usuarios</h1>
      <ul>
        {usuarios.map((u) => (
          <li key={u.idUsuario}>
            {u.Nombres} - {u.user_usuario}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Usuarios;
