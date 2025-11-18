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
    <div className="flex items-end gap-4 bg-transparent px-2 py-2">
      <div className="flex flex-col">
        <label className="text-sm text-gray-700">Fecha desde</label>
        <input
          type="date"
          value={fechaInicio}
          min={fechaFin}
          onChange={(e) => setFechaInicio(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-1 focus:outline-none"
        />
      </div>
      <div className="flex flex-col">
        <label className="text-sm text-gray-700">Fecha hasta</label>
        <input
          type="date"
          value={fechaFin}
          min={fechaInicio} // 👈 esta es la magia
          onChange={(e) => setFechaFin(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-1 focus:outline-none"
        />
      </div>
      {/* Botón Filtrar */}
      <button
        onClick={onFiltrar}
        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        title="Aplicar filtros"
      >
        <Funnel size={15} />
      </button>
      <button
        onClick={() => onReset()}
        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        title="Limpiar filtros"
      >
        <BrushCleaning size={15} />
      </button>
    </div>
  );
}

export default FiltrosFecha;
