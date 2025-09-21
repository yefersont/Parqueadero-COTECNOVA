import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";

function TablaConPaginacion({
  columnas,
  datos,
  porPagina = 7,
  titulo,
  placeholderBusqueda = "Buscar...",
  textoBoton = "Nuevo registro",
  onNuevo,
  deshabilitarFechas = false,
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
    <div className="flex justify-center mt-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-[80%] max-w-4xl bg-white p-6 rounded-2xl shadow-md"
      >
        {titulo && (
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold mb-4 text-left text-gray-800"
          >
            {titulo}
          </motion.h1>
        )}

        {/*  Barra  búsqueda + filtros + botón */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
          <div className="relative w-full sm:w-1/3">
            <input
              type="text"
              placeholder={placeholderBusqueda}
              value={busquedaInput}
              onChange={(e) => {
                setBusquedaInput(e.target.value);
                if (onBuscar) onBuscar(e.target.value);
              }}
              className="px-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-400"
            />

            <button
              onClick={HandleBuscar}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-green-600 hover:text-green-800"
            >
              <Search />
            </button>
          </div>

          {/* 📅 Filtros de fecha */}
          <div className="flex gap-4">
            <div className="flex flex-col">
              <label className="text-sm text-gray-500 mb-1">Desde:</label>
              <input
                disabled={deshabilitarFechas}
                type="date"
                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm text-gray-500 mb-1">Hasta:</label>
              <input
                disabled={deshabilitarFechas}
                type="date"
                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
          </div>

          {/* ➕ Botón */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onNuevo}
            className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700"
          >
            {textoBoton}
          </motion.button>
        </div>

        {/* Contador de registros */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-gray-600 mb-2 text-right"
        >
          Mostrando {datosPagina.length} de {datos.length} registros
        </motion.p>

        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                {columnas.map((col, idx) => (
                  <th key={idx} className="px-4 py-2 text-left text-gray-600">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="sync">
                {datosPagina.map((fila, idx) => (
                  <motion.tr
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="border-t"
                  >
                    {Object.values(fila).map((valor, i) => (
                      <td key={i} className="px-4 py-2">
                        {valor}
                      </td>
                    ))}
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
                      className="text-center py-4 text-gray-500"
                    >
                      No hay registros
                    </td>
                  </motion.tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Controles de paginación */}
        {datos.length > porPagina && (
          <div className="flex justify-between items-center mt-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={anteriorPagina}
              disabled={paginaActual === 1}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Anterior
            </motion.button>

            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              key={paginaActual}
              className="text-gray-700"
            >
              Página {paginaActual} de {totalPaginas}
            </motion.span>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={siguientePagina}
              disabled={paginaActual === totalPaginas}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
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
