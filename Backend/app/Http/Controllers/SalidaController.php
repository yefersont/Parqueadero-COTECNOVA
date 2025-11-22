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
            $request->validate([
                'Propietario_idPropietario' => 'required|integer',
            ]);

            // Buscar el último ingreso de ese propietario y vehículo
            $ultimoIngreso = Ingreso::where('Propietario_idPropietario', $request->Propietario_idPropietario)
                ->whereDoesntHave('salidas')
                ->latest('fecha_ingreso')
                ->first();

            if (!$ultimoIngreso) {
                return response()->json(['error' => 'No se encontró un ingreso activo para este vehículo.'], 404);
            }

            $salida = Salida::create([
                'Ingresos_idIngresos' => $ultimoIngreso->idIngresos,
                'fecha_salida' => Carbon::now()->toDateString(),
                'hora_salida' => Carbon::now()->format('H:i:s'),
            ]);

            return response()->json($salida, 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => 'Datos inválidos', 'message' => $e->getMessage()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al registrar la salida', 'message' => $e->getMessage()], 500);
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
