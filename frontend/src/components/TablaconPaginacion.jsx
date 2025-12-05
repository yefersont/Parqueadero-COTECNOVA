import { use, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function TablaConPaginacion({
  columnas,
  datos,
  porPagina = 9,
  titulo,
  placeholderBusqueda = "Buscar...",
  textoBoton = "Nuevo",
  onNuevo,
  onBuscar,
  mostrarControles = true,
  onRowClick,
  extraControls = null,
}) {
  const [paginaActual, setPaginaActual] = useState(1);
  const [busquedaInput, setBusquedaInput] = useState("");
  const { isAdmin } = useAuth();

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
    <div className="flex justify-center my-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="w-[95%] max-w-7xl bg-white rounded-2xl shadow-lg border border-gray-200/60 overflow-hidden"
      >
        {/* Header Section */}
        {titulo && (
          <div className="px-6 pt-5 pb-4 border-b border-gray-100 bg-gradient-to-br from-gray-50/50 to-white">
            <motion.h1
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="text-xl font-bold text-gray-900 tracking-tight"
            >
              {titulo}
            </motion.h1>
          </div>
        )}

        {/* Controls Section */}
        <div className="px-6 py-3">
          {mostrarControles && (
            <div className="flex flex-wrap justify-between items-center gap-2 my-4">
              {/* Search and Button */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* Search Input */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder={placeholderBusqueda}
                    value={busquedaInput}
                    onChange={(e) => {
                      setBusquedaInput(e.target.value);
                      if (onBuscar) onBuscar(e.target.value);
                    }}
                    className="w-56 pl-9 pr-4 py-2 rounded-xl border border-gray-300 bg-white text-sm 
                    focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 
                    placeholder:text-gray-400 transition-all duration-200 shadow-sm"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>

                {/* New Button */}
                {isAdmin() && onNuevo && (
                  <motion.button
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onNuevo}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 
                    hover:from-emerald-700 hover:to-emerald-800 text-white rounded-xl 
                    font-medium text-sm shadow-md hover:shadow-lg transition-all duration-200 
                    whitespace-nowrap"
                  >
                    {textoBoton}
                  </motion.button>
                )}
              </div>

              {/* Extra Controls */}
              {extraControls && (
                <div className="flex items-center gap-2">{extraControls}</div>
              )}
            </div>
          )}

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-sm text-gray-600 mb-3 font-medium text-right"
          >
            Mostrando{" "}
            <span className="text-emerald-600 font-semibold">
              {datosPagina.length}
            </span>{" "}
            de{" "}
            <span className="text-gray-900 font-semibold">{datos.length}</span>{" "}
            registros
          </motion.p>

          {/* Table */}
          <div className="overflow-hidden rounded-xl border border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100/50">
                  <tr>
                    {columnas.map((col, idx) => (
                      <th
                        key={idx}
                        className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-100">
                  <AnimatePresence mode="sync">
                    {datosPagina.map((fila, idx) => (
                      <motion.tr
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2, delay: idx * 0.02 }}
                        className="hover:bg-emerald-50/50 cursor-pointer transition-colors duration-150 group"
                        onClick={() => onRowClick && onRowClick(fila)}
                      >
                        {Object.entries(fila).map(([key, valor], i) =>
                          key !== "idPropietario" && key !== "idVehiculo" ? (
                            <td
                              key={i}
                              className="px-4 py-2 text-sm text-gray-800 whitespace-nowrap group-hover:text-gray-900 transition-colors"
                            >
                              {valor}
                            </td>
                          ) : null
                        )}
                      </motion.tr>
                    ))}

                    {datos.length === 0 && (
                      <motion.tr
                        key="no-data"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <td
                          colSpan={columnas.length}
                          className="text-center py-7 text-gray-400 text-sm"
                        >
                          <div className="flex flex-col items-center gap-2">
                            <svg
                              className="w-10 h-10 text-gray-300"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                              />
                            </svg>
                            <span className="font-medium text-sm">
                              No hay registros para mostrar
                            </span>
                          </div>
                        </td>
                      </motion.tr>
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {datos.length > porPagina && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100"
            >
              <button
                onClick={anteriorPagina}
                disabled={paginaActual === 1}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 
                hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed
                rounded-lg text-sm font-medium text-gray-700 transition-all duration-200 
                shadow-sm hover:shadow disabled:shadow-none"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Anterior
              </button>

              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">
                  Página{" "}
                  <span className="font-bold text-gray-900">
                    {paginaActual}
                  </span>{" "}
                  de{" "}
                  <span className="font-bold text-gray-900">
                    {totalPaginas}
                  </span>
                </span>
              </div>

              <button
                onClick={siguientePagina}
                disabled={paginaActual === totalPaginas}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 
                hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed
                rounded-lg text-sm font-medium text-gray-700 transition-all duration-200 
                shadow-sm hover:shadow disabled:shadow-none"
              >
                Siguiente
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default TablaConPaginacion;
