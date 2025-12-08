import { useEffect, useState } from "react";
import { getUsuarios } from "../../api/usuarios";
import TablaConPaginacion from "../../components/TablaconPaginacion";
import Loader from "../../components/Loader";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Hash,
  Lock,
  Clock,
  CalendarCheck,
  Briefcase,
} from "lucide-react";

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [Cargando, setCargando] = useState(true);

  // ===============================
  // 🔹 Funciones internas del componente
  // ===============================

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    try {
      return new Date(timestamp).toLocaleString("es-CO", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Fecha inválida";
    }
  };

  const ROLE_COLORS = {
    Administrador: "indigo",
    Administrativo: "violet",
    Docente: "blue",
    Estudiante: "green",
  };

  const getRoleInfo = (rol) => {
    if (!rol || !rol.Rol) return { name: "Sin Rol", color: "gray" };
    const color = ROLE_COLORS[rol.Rol] || "gray";
    return { name: rol.Rol, color };
  };

  // ===============================
  // 🔹 Componente interno: Tarjeta móvil
  // ===============================
  const UserMobileCard = ({ u }) => {
    const isLocked = u.locked_until !== null;
    const role = getRoleInfo(u.rol);

    const DetailRow = ({
      icon: Icon,
      label,
      value,
      color = "text-gray-900",
    }) => (
      <p className="flex items-center justify-between py-1 border-b border-gray-200 last:border-b-0">
        <span className="flex items-center text-gray-600 font-medium text-sm">
          <Icon className="w-4 h-4 mr-2 text-gray-400" /> {label}
        </span>
        <span className={`font-semibold text-sm ${color}`}>{value}</span>
      </p>
    );

    return (
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="p-5 rounded-xl bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all"
      >
        {/* Header */}
        <div className="flex justify-between items-start pb-4 border-b border-gray-100 mb-3">
          <div>
            <h3 className="text-lg font-bold text-gray-800">{u.Nombres}</h3>
            <span
              className={`px-3 py-1 mt-1 inline-block text-xs font-semibold rounded-full bg-${role.color}-100 text-${role.color}-800`}
            >
              {role.name}
            </span>
          </div>

          {isLocked ? (
            <div className="flex items-center text-xs font-semibold text-red-600 bg-red-100 px-2 py-1 rounded-full">
              <Lock className="w-4 h-4 mr-1" />
              Bloqueado
            </div>
          ) : (
            <div className="flex items-center text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">
              <CalendarCheck className="w-4 h-4 mr-1" />
              Activo
            </div>
          )}
        </div>

        {/* Detalles */}
        <div className="space-y-1.5">
          <DetailRow icon={Briefcase} label="Usuario" value={u.user_usuario} />
          <DetailRow icon={Mail} label="Email" value={u.email} />
          <DetailRow icon={Hash} label="Cédula" value={u.Cedula_usuario} />
          <DetailRow
            icon={Clock}
            label="Último acceso"
            value={formatDate(u.last_access_at_format)}
          />
          <DetailRow
            icon={Lock}
            label="Intentos fallidos"
            value={u.failed_attempts}
            color={u.failed_attempts > 0 ? "text-red-500" : "text-gray-500"}
          />
        </div>
      </motion.div>
    );
  };

  // ===============================
  // 🔹 Carga inicial
  // ===============================
  useEffect(() => {
    getUsuarios()
      .then((res) => {
        setUsuarios(res.data);
        setCargando(false);
      })
      .catch(() => setCargando(false));

    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ===============================
  // 🔹 Columnas de tabla
  // ===============================
  const columnas = isMobile
    ? [""]
    : ["ID", "Nombres", "Usuario", "Email", "Cédula", "Rol", "Último Acceso"];

  // ===============================
  // 🔹 Datos para tabla
  // ===============================
  const data = usuarios.map((u) => {
    if (isMobile) return { Usuario: <UserMobileCard u={u} /> };

    const role = getRoleInfo(u.rol);

    return {
      idUsuario: u.idUsuario,
      Nombres: u.Nombres,
      user_usuario: u.user_usuario,
      email: u.email,
      Cedula_usuario: u.Cedula_usuario,
      Rol: role.name,
      "Último Acceso": formatDate(u.last_access_at_format),
    };
  });

  // ===============================
  // 🔹 Render
  // ===============================
  return Cargando ? (
    <Loader texto="Cargando usuarios..." />
  ) : (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <TablaConPaginacion
          titulo="Gestión de Usuarios"
          columnas={columnas}
          datos={data}
          placeholderBusqueda="Buscar usuario..."
          deshabilitarFechas={true}
        />
      </motion.div>
    </div>
  );
}

export default Usuarios;
