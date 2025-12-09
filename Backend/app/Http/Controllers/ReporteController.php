<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\Ingreso;
use App\Models\Salida;
use Carbon\Carbon;
use App\Traits\LogsActivity;

class ReporteController extends Controller
{
    use LogsActivity;

    /**
     * Descargar reporte de ingresos en PDF (ISO 27001 A.12.4.1)
     */
    public function descargarIngresos(Request $request)
    {
        $ingresos = Ingreso::with(['propietario', 'vehiculo', 'salidas'])
            ->whereDate('fecha_ingreso', Carbon::today())
            ->get()
            ->map(function ($ingreso) {
                return [
                    'nombre' => $ingreso->propietario->Nombre_propietario,
                    'apellido' => $ingreso->propietario->Apellido_propietario,
                    'cedula' => $ingreso->propietario->Cedula_propietario,
                    'placa' => $ingreso->vehiculo->Placa_vehiculo,
                    'tipo' => $ingreso->vehiculo->Tipo_vehiculo,
                    'fecha_ingreso' => $ingreso->fecha_ingreso,
                    'hora_ingreso' => $ingreso->hora_ingreso,
                    'fecha_salida' => $ingreso->salidas->fecha_salida ?? '',
                    'hora_salida' => $ingreso->salidas->hora_salida ?? '',
                ];
            });

        // Registrar exportación en audit log (ISO 27001 A.12.4.1)
        $this->logActivity(
            action: 'EXPORT_PDF',
            model: 'Ingreso',
            description: "Exportación de reporte PDF de ingresos - Fecha: " . Carbon::today()->format('Y-m-d') . " - Total registros: " . $ingresos->count(),
            userId: $request->user()?->idUsuario
        );

        $pdf = Pdf::loadView('reportes.ingresos', compact('ingresos'));
        return $pdf->stream('reporte_ingresos.pdf');
    }
}
