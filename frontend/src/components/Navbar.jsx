// src/components/Navbar.jsx
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <header className="bg-[#198754] shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo + título */}
        <div className="flex items-center space-x-3">
          <img
            src="/cotecnova.png"
            alt="Logo Cotecnova"
            className="h-14 w-auto"
          />
          <h1 className="text-2xl font-bold text-white">COTECNOVA</h1>
        </div>

        {/* Menú */}
        <nav className="flex items-center space-x-8">
          <Link
            to="/inicio "
            className="text-lg text-white hover:text-green-200 hover:underline transition duration-300"
          >
            Inicio
          </Link>
          <Link
            to="/propietario"
            className="text-lg text-white hover:text-green-200 hover:underline transition duration-300"
          >
            Propietarios
          </Link>
          <Link
            to="/vehiculos"
            className="text-lg text-white hover:text-green-200 hover:underline transition duration-300"
          >
            Vehículos
          </Link>
          <Link
            to="/ingresos"
            className="text-lg text-white hover:text-green-200 hover:underline transition duration-300"
          >
            Ingresos
          </Link>
          <Link
            to="/salidas"
            className="text-lg text-white hover:text-green-200 hover:underline transition duration-300"
          >
            Salidas
          </Link>

          {/* Dropdown usuario */}
          <div className="relative group">
            <button className="flex items-center text-lg text-white hover:text-green-200 transition duration-300 focus:outline-none">
              <span className="mr-1">Usuario</span>
              <svg
                className="w-5 h-5"
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
            <div className="absolute right-0 mt-2 w-44 bg-white border rounded-md shadow-lg hidden group-hover:block">
              <Link
                to="/logout"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition duration-300"
              >
                Logout
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
