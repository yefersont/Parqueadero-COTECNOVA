// src/components/Footer.jsx
function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-[#000000] text-white shadow-md py-3 z-50">
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between text-sm">
        {/* Texto principal */}
        <p className="text-center sm:text-left font-medium tracking-wide">
          &copy; {new Date().getFullYear()} COTECNOVA — Todos los derechos
          reservados
        </p>

        {/* Enlaces adicionales */}
        <div className="flex items-center gap-4 mt-2 sm:mt-0">
          <a href="#" className="hover:text-green-200 transition duration-300">
            Políticas de Privacidad
          </a>
          <span className="text-gray-300">|</span>
          <a href="#" className="hover:text-green-200 transition duration-300">
            Términos de Uso
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
