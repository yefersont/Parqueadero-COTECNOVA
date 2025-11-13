// src/components/Navbar.jsx
import { Link } from "react-router-dom";
import { User } from "lucide-react";
import { motion } from "framer-motion";

function Navbar() {
  return (
    <header className="bg-[#198754] shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo + Título */}
        <Link
          to="/inicio"
          className="flex items-center gap-4 group cursor-pointer"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="relative"
          >
            <img
              src="/cotecnova.png"
              alt="Logo Cotecnova"
              className="h-12 w-auto drop-shadow-lg transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-white/20 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col"
          >
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-widest text-white drop-shadow-sm uppercase select-none">
              COTECNOVA
            </h1>
            {/* Línea decorativa fija */}
            <div className="w-16 h-[3px] bg-white rounded-full mt-1"></div>
          </motion.div>
        </Link>

        {/* Menú principal */}
        <nav className="flex items-center gap-6">
          {[
            { name: "Inicio", to: "/inicio" },
            { name: "Propietarios", to: "/propietario" },
            { name: "Vehículos", to: "/vehiculos" },
            { name: "Ingresos", to: "/ingresos" },
            { name: "Salidas", to: "/salidas" },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-white text-lg font-medium relative group"
            >
              {item.name}
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full rounded-full"></span>
            </Link>
          ))}

          {/* Dropdown usuario */}
          <div className="relative group">
            <button className="flex items-center gap-2 text-white text-lg font-medium hover:text-green-100 transition duration-300">
              <User className="w-5 h-5" />
              <span>Usuario</span>
              <svg
                className="w-5 h-5 transition-transform duration-300 group-hover:rotate-180"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-md opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transform transition-all duration-200 origin-top">
              <Link
                to="/logout"
                className="block px-5 py-2 text-gray-700 hover:bg-gray-100 rounded-t-lg transition"
              >
                Cerrar sesión
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
