<?php

namespace App\Http\Controllers;

use App\Models\Salida;
use App\Models\Ingreso;
use Illuminate\Http\Request;
use Carbon\Carbon;

class SalidaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $salida = Salida::with('ingreso.propietario', 'ingreso.vehiculo')->get();
        return response()->json($salida);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            // Validación estricta
            $validated = $request->validate([
                'Propietario_idPropietario' => 'required|integer|min:1|exists:propietario,idPropietario',
            ], [
                'Propietario_idPropietario.required' => 'El ID del propietario es requerido',
                'Propietario_idPropietario.integer' => 'El ID del propietario debe ser un número entero',
                'Propietario_idPropietario.min' => 'El ID del propietario debe ser mayor a 0',
                'Propietario_idPropietario.exists' => 'El propietario no existe en el sistema',
            ]);

            // Buscar el último ingreso de ese propietario sin salida
            $ultimoIngreso = Ingreso::where('Propietario_idPropietario', $validated['Propietario_idPropietario'])
                ->whereDoesntHave('salidas')
                ->latest('fecha_ingreso')
                ->first();

            if (!$ultimoIngreso) {
                \Log::warning('Intento de registrar salida sin ingreso activo', [
                    'propietario_id' => $validated['Propietario_idPropietario'],
                    'usuario' => auth()->user()->idUsuario ?? 'No autenticado',
                    'ip' => $request->ip(),
                    'timestamp' => now()
                ]);
                
                return response()->json([
                    'error' => 'No se encontró un ingreso activo para este propietario.'
                ], 404);
            }

            $salida = Salida::create([
                'Ingresos_idIngresos' => $ultimoIngreso->idIngresos,
                'fecha_salida' => Carbon::now()->toDateString(),
                'hora_salida' => Carbon::now()->format('H:i:s'),
            ]);

            // Log de salida exitosa
            \Log::info('Salida vehicular registrada', [
                'salida_id' => $salida->idSalidas,
                'ingreso_id' => $ultimoIngreso->idIngresos,
                'propietario_id' => $validated['Propietario_idPropietario'],
                'vehiculo_id' => $ultimoIngreso->Vehiculo_idVehiculo,
                'fecha' => $salida->fecha_salida,
                'hora' => $salida->hora_salida,
                'usuario' => auth()->user()->idUsuario ?? 'No autenticado',
                'ip' => $request->ip(),
                'timestamp' => now()
            ]);

            return response()->json($salida, 201);
            
        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::warning('Validación fallida al crear salida', [
                'errores' => $e->errors(),
                'datos_recibidos' => $request->all(),
                'ip' => $request->ip(),
                'timestamp' => now()
            ]);
            
            return response()->json([
                'error' => 'Datos inválidos',
                'message' => $e->getMessage(),
                'errores' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Error al registrar salida', [
                'error' => $e->getMessage(),
                'datos_recibidos' => $request->all(),
                'ip' => $request->ip(),
                'timestamp' => now()
            ]);
            
            return response()->json([
                'error' => 'Error al registrar la salida',
                'message' => $e->getMessage()
            ], 500);
        }
    }


    /**
     * Display the specified resource.
     */
    public function show(Salida $salida)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Salida $salida)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Salida $salida)
    {
        //
    }
    public function ShowToday()
    {
        try {
            $salidas = Salida::with(['ingreso.propietario', 'ingreso.vehiculo'])
                ->whereBetween('fecha_salida', [
                    Carbon::today()->startOfDay(),
                    Carbon::today()->endOfDay()
                ])
                ->get();

            return response()->json([
                'total' => $salidas->count(),
                'registros' => $salidas
            ]);
        } catch (\Illuminate\Database\QueryException $e) {
            return response()->json([
                'error' => 'Error en la consulta de la base de datos',
                'message' => $e->getMessage()
            ], 500);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al obtener las salidas de hoy',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
