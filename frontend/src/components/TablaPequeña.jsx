import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";

function TablaSimpleConPaginacion({
  titulo,
  columnas,
  datos,
  porPagina = 5,
  placeholderBusqueda = "Buscar...",
  mostrarControles = false,
  onBuscar,
}) {
  const [paginaActual, setPaginaActual] = useState(1);
  const [busquedaInput, setBusquedaInput] = useState("");

  const indiceUltimo = paginaActual * porPagina;
  const indicePrimero = indiceUltimo - porPagina;
  const datosPagina = datos.slice(indicePrimero, indiceUltimo);
  const totalPaginas = Math.ceil(datos.length / porPagina);

  const siguientePagina = () => {
    if (paginaActual < totalPaginas) setPaginaActual(paginaActual + 1);
  };

  const anteriorPagina = () => {
    if (paginaActual > 1) setPaginaActual(paginaActual - 1);
  };

  const HandleBuscar = () => {
    if (onBuscar) onBuscar(busquedaInput);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      {/* Título */}
      {titulo && (
        <h3 className="text-sm font-semibold text-gray-700 mb-2">{titulo}</h3>
      )}

      {/* Barra de búsqueda (opcional) */}
      {mostrarControles && (
        <div className="relative w-full sm:w-1/3 mb-3">
          <input
            type="text"
            placeholder={placeholderBusqueda}
            value={busquedaInput}
            onChange={(e) => {
              setBusquedaInput(e.target.value);
              if (onBuscar) onBuscar(e.target.value);
            }}
            className="w-full px-3 py-1.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition text-sm"
          />
          <button
            onClick={HandleBuscar}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-green-600 hover:text-green-800 transition"
          >
            <Search size={18} />
          </button>
        </div>
      )}

      {/* Tabla */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white/60 backdrop-blur-sm">
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="bg-gray-100 text-gray-700 text-xs uppercase">
            <tr>
              {columnas.map((col, idx) => (
                <th
                  key={idx}
                  className="px-4 py-2 font-semibold tracking-wide text-gray-700"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="sync">
              {datosPagina.length > 0 ? (
                datosPagina.map((fila, idx) => (
                  <motion.tr
                    key={idx}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className={`hover:bg-gray-50 transition ${
                      idx % 2 === 0 ? "bg-white/80" : "bg-gray-50/50"
                    }`}
                  >
                    {Object.values(fila).map((valor, i) => (
                      <td key={i} className="px-4 py-2 text-gray-700">
                        {valor}
                      </td>
                    ))}
                  </motion.tr>
                ))
              ) : (
                <motion.tr
                  key="no-data"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <td
                    colSpan={columnas.length}
                    className="text-center py-4 text-gray-400 italic"
                  >
                    No hay registros.
                  </td>
                </motion.tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {datos.length > porPagina && (
        <div className="flex justify-between items-center mt-3">
          <button
            onClick={anteriorPagina}
            disabled={paginaActual === 1}
            className="px-3 py-1 bg-gray-100 rounded disabled:opacity-50 text-sm"
          >
            Anterior
          </button>
          <span className="text-gray-600 text-sm">
            Página {paginaActual} de {totalPaginas}
          </span>
          <button
            onClick={siguientePagina}
            disabled={paginaActual === totalPaginas}
            className="px-3 py-1 bg-gray-100 rounded disabled:opacity-50 text-sm"
          >
            Siguiente
          </button>
        </div>
      )}
    </motion.div>
  );
}

export default TablaSimpleConPaginacion;
