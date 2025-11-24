  // src/components/Navbar.jsx
import { Link } from "react-router-dom";
import { User, ChevronDown, LogOut } from "lucide-react";
import { motion } from "framer-motion";

// Definición de colores clave
const BRAND_BG = "bg-green-800";
const BRAND_ACCENT = "bg-green-600";
const BRAND_TEXT = "text-white";

// --- Subcomponente para los enlaces del menú ---
const NavLink = ({ to, name }) => (
  <Link
    to={to}
    className="text-white font-semibold text-base relative group transition-colors duration-200 hover:text-green-200"
  >
    {name}
    <span
      className={`absolute left-0 -bottom-1 w-0 h-0.5 ${BRAND_ACCENT} transition-all duration-300 group-hover:w-full rounded-full`}
    ></span>
  </Link>
);

import { useAuth } from "../context/AuthContext";

// ... imports ...

function Navbar() {
  const { user, logout } = useAuth();

  const menuItems = [
    { name: "Inicio", to: "/inicio" },
    { name: "Dashboard", to: "/dashboard" },
    { name: "Propietarios", to: "/propietario" },
    { name: "Vehículos", to: "/vehiculos" },
    { name: "Ingresos", to: "/ingresos" },
    // { name: "Salidas", to: "/salidas" },
  ];

  return (
    <header
      className={`${BRAND_BG} border-b-2 border-green-600 shadow-xl sticky top-0 z-50`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo + Título */}
        <Link
          to="/inicio"
          className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-lg p-1 -m-1"
        >
          {/* ... logo content ... */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="relative flex-shrink-0"
          >
            <img
              src="/cotecnova.png"
              alt="Logo Cotecnova"
              className="h-10 w-auto drop-shadow-lg transition-transform duration-300 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex flex-col select-none"
          >
            <h1
              className={`text-2xl font-black tracking-widest ${BRAND_TEXT} drop-shadow-md uppercase`}
            >
              COTECNOVA
            </h1>
            <span className="text-xs font-light text-green-300 -mt-1 tracking-wide">
              Gestión de Tráfico
            </span>
            <div className="w-10 h-0.5 bg-green-700 rounded-full mt-1 transition-all duration-300 group-hover:w-16"></div>
          </motion.div>
        </Link>

        {/* Menú principal */}
        <nav className="hidden lg:flex items-center gap-8">
          {menuItems.map((item) => (
            <NavLink key={item.to} {...item} />
          ))}

          {/* Dropdown usuario */}
          <div className="relative group ml-4">
            <button
              className={`flex items-center gap-2 text-white font-semibold text-base px-3 py-1 rounded-lg ${BRAND_ACCENT} hover:bg-green-700 transition duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white`}
            >
              <User className="w-4 h-4" />
              <span className="hidden md:inline">{user?.Nombres || "Usuario"}</span>
              <ChevronDown className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
            </button>

            {/* Dropdown Content - CORRECCIÓN DE VISIBILIDAD */}
            <div
              // CLASE CORREGIDA: Agregamos 'invisible' y 'group-hover:visible'
              className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-2xl opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transform transition-all duration-200 origin-top border border-gray-100 invisible group-hover:visible"
            >
              <Link
                to="/perfil"
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-t-lg transition"
              >
                <User className="w-4 h-4 text-green-600" />
                <span>Mi Perfil</span>
              </Link>
              <div className="border-t border-gray-100"></div>
              <button
                onClick={() => logout()}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-b-lg transition w-full text-left"
              >
                <LogOut className="w-4 h-4" />
                <span>Cerrar sesión</span>
              </button>
            </div>
          </div>
        </nav>

        {/* Botón de hamburguesa para móviles */}
        <div className="lg:hidden">
          <button className="text-white p-2 rounded-md hover:bg-green-700 transition">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
