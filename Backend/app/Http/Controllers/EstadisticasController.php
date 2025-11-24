<?php

namespace App\Http\Controllers;

use App\Models\Ingreso;
use App\Models\Salida;
use App\Models\Vehiculo;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class EstadisticasController extends Controller
{
    public function dashboard()
    {
        try {
            // 1. Vehículos actualmente en el parqueadero (ingresos sin salida)
            $vehiculosActuales = Ingreso::whereDoesntHave('salidas')->count();

            // 2. Total de ingresos hoy
            $ingresosHoy = Ingreso::whereDate('fecha_ingreso', Carbon::today())->count();

            // 3. Total de salidas hoy
            $salidasHoy = Salida::whereDate('fecha_salida', Carbon::today())->count();

            // 4. Tiempo promedio de estadía (en minutos)
            $tiempoPromedioMinutos = $this->calcularTiempoPromedio();

            // 5. Distribución por tipo de vehículo (vehículos actuales)
            $distribucionTipos = Ingreso::whereDoesntHave('salidas')
                ->with('vehiculo.tipo_vehiculo')
                ->get()
                ->groupBy('vehiculo.tipo_vehiculo.Tipo_vehiculo')
                ->map(function ($group, $tipo) {
                    return [
                        'tipo' => $tipo ?? 'Sin tipo',
                        'cantidad' => $group->count()
                    ];
                })
                ->values();

            // 6. Ingresos por día (últimos 7 días)
            $ingresosPorDia = [];
            for ($i = 6; $i >= 0; $i--) {
                $fecha = Carbon::today()->subDays($i);
                $cantidad = Ingreso::whereDate('fecha_ingreso', $fecha)->count();
                
                // Configurar locale a español para nombres de días
                $fecha->locale('es');
                
                $ingresosPorDia[] = [
                    'fecha' => $fecha->format('Y-m-d'),
                    'dia' => ucfirst($fecha->formatLocalized('%a')), // Lun, Mar, Mié, etc.
                    'cantidad' => $cantidad
                ];
            }

            // 7. Propietarios más frecuentes (top 15)
            $propietariosFrecuentes = Ingreso::select('Propietario_idPropietario', DB::raw('count(*) as visitas'))
                ->with('propietario')
                ->groupBy('Propietario_idPropietario')
                ->orderBy('visitas', 'desc')
                ->limit(15)
                ->get()
                ->map(function ($item) {
                    return [
                        'nombre' => $item->propietario->Nombre_propietario . ' ' . $item->propietario->Apellido_propietario,
                        'visitas' => $item->visitas
                    ];
                });

            return response()->json([
                'vehiculos_actuales' => $vehiculosActuales,
                'ingresos_hoy' => $ingresosHoy,
                'salidas_hoy' => $salidasHoy,
                'tiempo_promedio_minutos' => $tiempoPromedioMinutos,
                'distribucion_tipos' => $distribucionTipos,
                'ingresos_por_dia' => $ingresosPorDia,
                'propietarios_frecuentes' => $propietariosFrecuentes
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al obtener estadísticas',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    private function calcularTiempoPromedio()
    {
        // Calcular el tiempo promedio de estadía de los últimos 30 días
        $salidas = Salida::with('ingreso')
            ->whereDate('fecha_salida', '>=', Carbon::today()->subDays(30))
            ->get();

        if ($salidas->isEmpty()) {
            return 0;
        }

        $totalMinutos = 0;
        $contador = 0;

        foreach ($salidas as $salida) {
            $ingreso = $salida->ingreso;
            if ($ingreso) {
                $fechaHoraIngreso = Carbon::parse($ingreso->fecha_ingreso . ' ' . $ingreso->hora_ingreso);
                $fechaHoraSalida = Carbon::parse($salida->fecha_salida . ' ' . $salida->hora_salida);
                
                $diferenciaMinutos = $fechaHoraIngreso->diffInMinutes($fechaHoraSalida);
                $totalMinutos += $diferenciaMinutos;
                $contador++;
            }
        }

        return $contador > 0 ? round($totalMinutos / $contador) : 0;
    }
}
