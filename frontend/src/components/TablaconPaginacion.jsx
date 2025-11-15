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
  mostrarFiltrosFecha = true, // 🔥 NUEVO PROP
  onBuscar,
  mostrarControles = true,
  onRowClick,
}) {
  const [paginaActual, setPaginaActual] = useState(1);
  const [busquedaInput, setBusquedaInput] = useState("");

  // Filtros
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  // Filtrar datos por fecha
  const datosFiltrados = datos.filter((fila) => {
    if (!mostrarFiltrosFecha) return true;

    const fecha = new Date(fila["Fecha y hora"]?.split(" ")[0]);

    if (fechaInicio && fecha < new Date(fechaInicio)) return false;
    if (fechaFin && fecha > new Date(fechaFin)) return false;

    return true;
  });

  // Paginación
  const indiceUltimo = paginaActual * porPagina;
  const indicePrimero = indiceUltimo - porPagina;
  const datosPagina = datosFiltrados.slice(indicePrimero, indiceUltimo);
  const totalPaginas = Math.ceil(datosFiltrados.length / porPagina);

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
      <div
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
            className="text-2xl md:text-3xl font-semibold mb-6 text-gray-900 font-[Inter]"
          >
            {titulo}
          </motion.h1>
        )}

        {/* 🔥 CONTROLES: filtros + búsqueda + botón */}
        {mostrarControles && (
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            {/* ------ CONTROLES DE LA DERECHA ------- */}
            <div className="flex flex-wrap items-end gap-3 ml-auto">
              {/* Filtros de fecha elegantes SIN borde */}
              {mostrarFiltrosFecha && (
                <div className="flex items-end gap-4 px-2 pb-1">
                  {/* Fecha desde */}
                  <div className="flex flex-col translate-y-[4px]">
                    <label className="text-[12px] font-medium text-gray-700 mb-1">
                      Fecha desde
                    </label>
                    <input
                      type="date"
                      value={fechaInicio}
                      onChange={(e) => setFechaInicio(e.target.value)}
                      className="px-3 py-2.5 rounded-lg bg-gray-50 
          border border-gray-300 text-gray-700 text-sm shadow-inner
          focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500
          transition-all"
                    />
                  </div>

                  {/* Fecha hasta */}
                  <div className="flex flex-col translate-y-[4px]">
                    <label className="text-[12px] font-medium text-gray-700 mb-1">
                      Fecha hasta
                    </label>
                    <input
                      type="date"
                      value={fechaFin}
                      onChange={(e) => setFechaFin(e.target.value)}
                      className="px-3 py-2.5 rounded-lg bg-gray-50 
          border border-gray-300 text-gray-700 text-sm shadow-inner
          focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500
          transition-all"
                    />
                  </div>

                  {/* Botón Filtrar */}
                  <button
                    onClick={() => setPaginaActual(1)}
                    className="px-5 py-2.5 rounded-lg bg-green-600 text-white font-semibold
        hover:bg-green-700 transition-all shadow-sm active:scale-95 translate-y-[4px]"
                  >
                    Filtrar
                  </button>
                </div>
              )}

              {/* Barra de búsqueda */}
              <div className="relative w-48 translate-y-[4px]">
                <input
                  type="text"
                  placeholder={placeholderBusqueda}
                  value={busquedaInput}
                  onChange={(e) => {
                    setBusquedaInput(e.target.value);
                    if (onBuscar) onBuscar(e.target.value);
                  }}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 
        bg-white shadow-sm text-sm
        focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                />
                <button
                  onClick={HandleBuscar}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600 hover:text-green-700"
                >
                  <Search size={18} />
                </button>
              </div>

              {/* Botón Nuevo */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onNuevo}
                className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 
      transition font-semibold shadow-sm whitespace-nowrap translate-y-[4px]"
              >
                {textoBoton}
              </motion.button>
            </div>
          </div>
        )}

        {/* Contador */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-gray-600 mb-2 text-right"
        >
          Mostrando {datosPagina.length} de {datosFiltrados.length} registros
        </motion.p>

        {/* TABLA */}
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
                    className="hover:bg-green-50 transition cursor-pointer"
                    onClick={() => onRowClick && onRowClick(fila)}
                  >
                    {Object.entries(fila).map(([key, valor], i) =>
                      key !== "idPropietario" && key !== "idVehiculo" ? (
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

                {datosFiltrados.length === 0 && (
                  <motion.tr
                    key="no-data"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
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
        {datosFiltrados.length > porPagina && (
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={anteriorPagina}
              disabled={paginaActual === 1}
              className="px-4 py-2 bg-gray-100 rounded disabled:opacity-50"
            >
              Anterior
            </button>

            <span className="text-gray-700">
              Página {paginaActual} de {totalPaginas}
            </span>

            <button
              onClick={siguientePagina}
              disabled={paginaActual === totalPaginas}
              className="px-4 py-2 bg-gray-100 rounded disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default TablaConPaginacion;
