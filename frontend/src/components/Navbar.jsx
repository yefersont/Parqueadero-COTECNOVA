// src/components/Navbar.jsx
import { Link } from "react-router-dom";
import { User, ChevronDown, LogOut, X, Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

// Definición de colores clave
const BRAND_BG = "bg-green-800";
const BRAND_ACCENT = "bg-green-600";
const BRAND_TEXT = "text-white";

// --- Subcomponente para los enlaces del menú ---
const NavLink = ({ to, name, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { name: "Inicio", to: "/inicio" },
    { name: "Estadisticas", to: "/estadisticas" },
    { name: "Propietarios", to: "/propietario" },
    { name: "Vehículos", to: "/vehiculos" },
    { name: "Ingresos", to: "/ingresos" },

    // { name: "Salidas", to: "/salidas" },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

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

        {/* Menú principal - Desktop */}
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
              <span className="hidden md:inline">
                {user?.Nombres || "Usuario"}
              </span>
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
          <button
            onClick={toggleMobileMenu}
            className="text-white p-2 rounded-md hover:bg-green-700 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Menú móvil */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={closeMobileMenu}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-72 bg-gradient-to-br from-green-800 via-green-900 to-emerald-900 shadow-2xl z-50 lg:hidden overflow-y-auto backdrop-blur-md"
            >
              <div className="flex flex-col min-h-full relative">
                {/* Decorative gradient orbs */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 left-0 w-32 h-32 bg-green-400/20 rounded-full blur-2xl"></div>

                {/* Header del menú móvil */}
                <div className="relative flex items-center justify-between p-6 border-b border-white/10 backdrop-blur-sm bg-white/5">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 backdrop-blur-md p-2 rounded-lg">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <span className="text-white font-bold text-sm block">
                        {user?.Nombres || "Usuario"}
                      </span>
                      <span className="text-green-200 text-xs">
                        {user?.rol?.Descripcion || ""}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={closeMobileMenu}
                    className="text-white p-2 rounded-lg hover:bg-white/10 transition-all duration-200 active:scale-95"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Links del menú */}
                <nav className="flex-1 px-4 py-6 space-y-1 relative">
                  {menuItems.map((item, index) => (
                    <motion.div
                      key={item.to}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        to={item.to}
                        onClick={closeMobileMenu}
                        className="group block px-4 py-3.5 text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-200 relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 to-emerald-500/10 translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                        <span className="relative flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-400 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                          {item.name}
                        </span>
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                {/* Footer del menú móvil */}
                <div
                  className="
  relative 
  p-6 pb-8 
  border-t border-white/10 
  space-y-2 
  bg-gradient-to-t from-black/20 to-transparent 
  backdrop-blur-sm
  mt-20 
"
                >
                  <Link
                    to="/perfil"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 px-4 py-3 text-white rounded-xl hover:bg-white/10 transition-all duration-200 group"
                  >
                    <div className="bg-white/20 p-2 rounded-lg group-hover:bg-white/30 transition-colors">
                      <User className="w-4 h-4" />
                    </div>
                    <span className="font-medium">Mi Perfil</span>
                  </Link>
                  <button
                    onClick={() => {
                      closeMobileMenu();
                      logout();
                    }}
                    className="flex items-center gap-3 px-4 py-3 text-red-200 hover:text-white hover:bg-red-500/20 rounded-xl transition-all duration-200 w-full text-left group"
                  >
                    <div className="bg-red-500/20 p-2 rounded-lg group-hover:bg-red-500/30 transition-colors">
                      <LogOut className="w-4 h-4" />
                    </div>
                    <span className="font-medium">Cerrar sesión</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;
