<?php

namespace App\Http\Controllers;

use App\Models\Ingreso;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Log;


class IngresoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $ingresos = Ingreso::with('propietario.rol', 'vehiculo', 'salidas')->get();
        return response()->json($ingresos);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            // Validación estricta con mensajes personalizados
            $validated = $request->validate([
                'Propietario_idPropietario' => 'required|integer|min:1|exists:propietario,idPropietario',
                'Vehiculo_idVehiculo' => 'required|integer|min:1|exists:vehiculo,idVehiculo',
            ], [
                'Propietario_idPropietario.required' => 'El ID del propietario es requerido',
                'Propietario_idPropietario.integer' => 'El ID del propietario debe ser un número entero',
                'Propietario_idPropietario.min' => 'El ID del propietario debe ser mayor a 0',
                'Propietario_idPropietario.exists' => 'El propietario no existe en el sistema',
                'Vehiculo_idVehiculo.required' => 'El ID del vehículo es requerido',
                'Vehiculo_idVehiculo.integer' => 'El ID del vehículo debe ser un número entero',
                'Vehiculo_idVehiculo.min' => 'El ID del vehículo debe ser mayor a 0',
                'Vehiculo_idVehiculo.exists' => 'El vehículo no existe en el sistema',
            ]);

            // Verificar ingresos pendientes
            $ingresoPendiente = Ingreso::where('Propietario_idPropietario', $validated['Propietario_idPropietario'])
                ->whereDoesntHave('salidas')
                ->latest('fecha_ingreso')
                ->first();

            if ($ingresoPendiente) {
                // \Log::warning('Intento de crear ingreso con ingreso pendiente', [
                //     'propietario_id' => $validated['Propietario_idPropietario'],
                //     'vehiculo_id' => $validated['Vehiculo_idVehiculo'],
                //     'ingreso_pendiente_id' => $ingresoPendiente->idIngreso,
                //     'usuario' => auth()->user()->idUsuario ?? 'No autenticado',
                //     'ip' => $request->ip(),
                //     'timestamp' => now()
                // ]);

                return response()->json([
                    'error' => 'Ingreso pendiente',
                    'message' => 'El propietario ya tiene un ingreso sin salida registrada.'
                ], 422);
            }

            $ingreso = Ingreso::create([
                'Propietario_idPropietario' => $validated['Propietario_idPropietario'],
                'Vehiculo_idVehiculo' => $validated['Vehiculo_idVehiculo'],
                'fecha_ingreso' => Carbon::now()->toDateString(),
                'hora_ingreso' => Carbon::now()->format('H:i:s'),
            ]);

            // Log de ingreso creado exitosamente
            // \Log::info('Ingreso vehicular registrado', [
            //     'ingreso_id' => $ingreso->idIngreso,
            //     'propietario_id' => $validated['Propietario_idPropietario'],
            //     'vehiculo_id' => $validated['Vehiculo_idVehiculo'],
            //     'fecha' => $ingreso->fecha_ingreso,
            //     'hora' => $ingreso->hora_ingreso,
            //     'usuario' => auth()->user()->idUsuario ?? 'No autenticado',
            //     'ip' => $request->ip(),
            //     'timestamp' => now()
            // ]);

            return response()->json($ingreso, 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            // \Log::warning('Validación fallida al crear ingreso', [
            //     'errores' => $e->errors(),
            //     'datos_recibidos' => $request->all(),
            //     'ip' => $request->ip(),
            //     'timestamp' => now()
            // ]);

            return response()->json([
                'error' => 'Datos inválidos',
                'message' => $e->getMessage(),
                'errores' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            // \Log::error('Error al registrar ingreso', [
            //     'error' => $e->getMessage(),
            //     'datos_recibidos' => $request->all(),
            //     'ip' => $request->ip(),
            //     'timestamp' => now()
            // ]);

            return response()->json([
                'error' => 'Error al registrar el ingreso',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Ingreso $ingreso)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Ingreso $ingreso)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Ingreso $ingreso)
    {
        //
    }

    public function ShowToday()
    {
        try {
            $ingresos = Ingreso::with(['propietario', 'vehiculo'])
                ->whereBetween('fecha_ingreso', [
                    Carbon::today()->startOfDay(),
                    Carbon::today()->endOfDay()
                ])
                ->get();

            return response()->json([
                'total' => $ingresos->count(),
                'registros' => $ingresos
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al obtener los ingresos de hoy',
                'message' => $e->getMessage()
            ], 500);
        }
    }





    public function getIngresosPorRangoFechas(Request $request)
    {
        try {
            // Validar formato de fechas (ISO 27001: A.14.2.5 - Validación de entrada)
            $validated = $request->validate([
                'inicio' => 'required|date|date_format:Y-m-d',
                'fin' => 'required|date|date_format:Y-m-d|after_or_equal:inicio',
            ]);

            $Ingresos = Ingreso::with('propietario.rol', 'vehiculo', 'salidas')
                ->whereBetween('fecha_ingreso', [$validated['inicio'], $validated['fin']])
                ->get();

            return response()->json($Ingresos);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'error' => 'Datos inválidos',
                'message' => 'Las fechas deben estar en formato YYYY-MM-DD y la fecha fin debe ser posterior o igual a la fecha inicio',
                'errores' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al obtener los ingresos por rango de fechas',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
