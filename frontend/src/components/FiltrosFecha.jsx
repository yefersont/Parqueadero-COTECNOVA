import { Funnel, BrushCleaning } from "lucide-react";

function FiltrosFecha({
  fechaInicio,
  fechaFin,
  setFechaInicio,
  setFechaFin,
  onFiltrar,
  onReset,
}) {
  return (
    <div className="flex items-start gap-4 p-4">
      {/* Fecha desde */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">
          Fecha desde
        </label>
        <input
          type="date"
          value={fechaInicio}
          max={fechaFin}
          onChange={(e) => setFechaInicio(e.target.value)}
          className="
            px-3 py-2 rounded-lg 
            bg-white 
            border border-gray-200 
            shadow-sm
            text-sm
            focus:outline-none 
            focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500
            transition-all
          "
        />
      </div>

      {/* Fecha hasta */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">
          Fecha hasta
        </label>
        <input
          type="date"
          value={fechaFin}
          min={fechaInicio}
          onChange={(e) => setFechaFin(e.target.value)}
          className="
            px-3 py-2 rounded-lg 
            bg-white 
            border border-gray-200 
            shadow-sm
            text-sm
            focus:outline-none 
            focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500
            transition-all
          "
        />
      </div>

      {/* Botón Filtrar */}
      <button
        onClick={onFiltrar}
        className="
    bg-gray-200 text-gray-700 
    px-3 py-2 rounded-xl 
    hover:bg-gray-300 
    transition-all shadow
    flex items-center justify-center
    gap-2
    mt-[22px]
  "
        title="Aplicar filtros"
      >
        Filtrar <Funnel size={15} />
      </button>

      {/* Botón Limpiar */}
      <button
        onClick={() => onReset()}
        className="
    bg-gray-200 text-gray-700 
    px-3 py-2 rounded-xl 
    hover:bg-gray-300 
    transition-all shadow
    flex items-center justify-center
    gap-2
    mt-[22px]
    ml-1
  "
        title="Limpiar filtros"
      >
        <BrushCleaning size={15} />
      </button>
    </div>
  );
}

export default FiltrosFecha;
