import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";

function TablaConPaginacion({
  columnas,
  datos,
  porPagina = 5,
  titulo,
  placeholderBusqueda = "Buscar...",
  textoBoton = "Nuevo registro",
  onNuevo,
  deshabilitarFechas = false,
  onBuscar,
  mostrarControles = true,
  onRowClick,
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
    <div className="flex justify-center mt-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-[90%] max-w-6xl bg-white p-6 rounded-2xl"
      >
        {titulo && (
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="text-2xl md:text-3xl font-bold mb-4 text-gray-800"
          >
            {titulo}
          </motion.h1>
        )}

        {/* Barra búsqueda + filtros + botón */}
        {mostrarControles && (
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            {/* Input de búsqueda */}
            <div className="relative w-full sm:w-1/3">
              <input
                type="text"
                placeholder={placeholderBusqueda}
                value={busquedaInput}
                onChange={(e) => {
                  setBusquedaInput(e.target.value);
                  if (onBuscar) onBuscar(e.target.value);
                }}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              />
              <button
                onClick={HandleBuscar}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-green-600 hover:text-green-800 transition"
              >
                <Search size={20} />
              </button>
            </div>

            {/* Filtros de fecha */}
            <div className="flex gap-4 flex-wrap">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-500 mb-1">
                  Desde
                </label>
                <input
                  disabled={deshabilitarFechas}
                  type="date"
                  className={`px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition ${
                    deshabilitarFechas
                      ? "bg-gray-100 cursor-not-allowed opacity-60"
                      : ""
                  }`}
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-500 mb-1">
                  Hasta
                </label>
                <input
                  disabled={deshabilitarFechas}
                  type="date"
                  className={`px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition ${
                    deshabilitarFechas
                      ? "bg-gray-100 cursor-not-allowed opacity-60"
                      : ""
                  }`}
                />
              </div>
            </div>

            {/* Botón Nuevo */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onNuevo}
              className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
            >
              {textoBoton}
            </motion.button>
          </div>
        )}

        {/* Contador */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-gray-600 mb-2 text-right"
        >
          Mostrando {datosPagina.length} de {datos.length} registros
        </motion.p>

        {/* Tabla sin sombra */}
        <div className="overflow-x-auto rounded-xl">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                {columnas.map((col, idx) => (
                  <th
                    key={idx}
                    className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
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
                    transition={{ duration: 0.2 }}
                    className="hover:bg-green-50 transition-all duration-200 cursor-pointer"
                    onClick={() => {
                      if (typeof onRowClick === "function") onRowClick(fila);
                    }}
                  >
                    {Object.entries(fila).map(([key, valor], i) =>
                      key !== "idPropietario" ? (
                        <td
                          key={i}
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-600"
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
                    exit={{ opacity: 0 }}
                  >
                    <td
                      colSpan={columnas.length}
                      className="text-center py-6 text-gray-400 italic"
                    >
                      No hay registros
                    </td>
                  </motion.tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {datos.length > porPagina && (
          <div className="flex justify-between items-center mt-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={anteriorPagina}
              disabled={paginaActual === 1}
              className="px-4 py-2 bg-gray-100 rounded disabled:opacity-50"
            >
              Anterior
            </motion.button>

            <span className="text-gray-700">
              Página {paginaActual} de {totalPaginas}
            </span>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={siguientePagina}
              disabled={paginaActual === totalPaginas}
              className="px-4 py-2 bg-gray-100 rounded disabled:opacity-50"
            >
              Siguiente
            </motion.button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default TablaConPaginacion;
