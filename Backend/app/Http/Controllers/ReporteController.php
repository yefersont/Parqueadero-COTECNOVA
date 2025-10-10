<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\Ingreso;
use App\Models\Salida;
use Carbon\Carbon;

class ReporteController extends Controller
{
    //
    public function descargarIngresos()
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

        $pdf = Pdf::loadView('reportes.ingresos', compact('ingresos'));
        return $pdf->stream('reporte_ingresos.pdf');
    }
}
