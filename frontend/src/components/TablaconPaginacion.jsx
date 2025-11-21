import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";

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
    <div className="flex justify-center mt-6">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-[95%] max-w-6xl bg-white p-4 rounded-xl shadow-sm border border-gray-200"
      >
        {titulo && (
          <motion.h1
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.3 }}
            className="text-xl font-semibold mb-4 text-gray-900 tracking-tight"
          >
            {titulo}
          </motion.h1>
        )}

        {mostrarControles && (
          <div className="flex flex-wrap justify-between items-center mb-2 gap-2">
            {/* IZQUIERDA → Búsqueda + Botón */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {/* Barra de búsqueda */}
              <div className="relative w-52">
                <input
                  type="text"
                  placeholder={placeholderBusqueda}
                  value={busquedaInput}
                  onChange={(e) => {
                    setBusquedaInput(e.target.value);
                    if (onBuscar) onBuscar(e.target.value);
                  }}
                  className="w-full px-2.5 py-1.5 rounded-md border border-gray-300 bg-white text-xs shadow-sm 
    focus:outline-none focus:ring-1 focus:ring-green-500"
                />
                <button
                  onClick={HandleBuscar}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-green-600 hover:text-green-700"
                >
                  <Search size={14} />
                </button>
              </div>

              {/* Botón Nuevo */}
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={onNuevo}
                className="px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 
        transition text-xs shadow-sm whitespace-nowrap"
              >
                {textoBoton}
              </motion.button>
            </div>

            {/* DERECHA → Filtros extra */}
            {extraControls && (
              <div className="flex items-center gap-2 text-xs">
                {extraControls}
              </div>
            )}
          </div>
        )}

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xs text-gray-600 mb-1 text-right"
        >
          Mostrando {datosPagina.length} de {datos.length} registros
        </motion.p>

        <div className="overflow-x-auto rounded-lg">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-xs text-gray-700 uppercase border-b border-gray-300">
              <tr>
                {columnas.map((col, idx) => (
                  <th key={idx} className="px-4 py-2 text-left font-semibold">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="bg-white">
              <AnimatePresence mode="sync">
                {datosPagina.map((fila, idx) => (
                  <motion.tr
                    key={idx}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="hover:bg-green-50 cursor-pointer transition"
                    onClick={() => onRowClick && onRowClick(fila)}
                  >
                    {Object.entries(fila).map(([key, valor], i) =>
                      key !== "idPropietario" && key !== "idVehiculo" ? (
                        <td key={i} className="px-4 py-2 text-gray-700">
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
                      className="text-center py-5 text-gray-400 italic"
                    >
                      No hay registros
                    </td>
                  </motion.tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {datos.length > porPagina && (
          <div className="flex justify-between items-center mt-3 text-sm">
            <button
              onClick={anteriorPagina}
              disabled={paginaActual === 1}
              className="px-3 py-1 bg-gray-100 rounded disabled:opacity-50"
            >
              Anterior
            </button>

            <span className="text-gray-700">
              Página {paginaActual} de {totalPaginas}
            </span>

            <button
              onClick={siguientePagina}
              disabled={paginaActual === totalPaginas}
              className="px-3 py-1 bg-gray-100 rounded disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default TablaConPaginacion;
