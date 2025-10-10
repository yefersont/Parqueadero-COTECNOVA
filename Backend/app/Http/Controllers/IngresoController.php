<?php

namespace App\Http\Controllers;

use App\Models\Ingreso;
use Illuminate\Http\Request;
use Carbon\Carbon;


class IngresoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $ingresos = Ingreso::with('propietario', 'vehiculo')->get();
        return response()->json($ingresos);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $request->validate([
                'Propietario_idPropietario' => 'required|integer',
                'Vehiculo_idVehiculo' => 'required|integer',
            ]);
            $ingresoPendiente = Ingreso::where('Propietario_idPropietario', $request->Propietario_idPropietario)
                ->whereDoesntHave('salidas')
                ->latest('fecha_ingreso')
                ->first();
            if ($ingresoPendiente) {
                return response()->json([
                    'error' => 'Ingreso pendiente',
                    'message' => 'El propietario ya tiene un ingreso sin salida registrada.'
                ], 422);
            }
            $ingreso = Ingreso::create([
                'Propietario_idPropietario' => $request->Propietario_idPropietario,
                'Vehiculo_idVehiculo' => $request->Vehiculo_idVehiculo,
                'fecha_ingreso' => Carbon::now()->toDateString(),
                'hora_ingreso' => Carbon::now()->format('H:i:s'),
            ]);
            return response()->json($ingreso, 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'error' => 'Datos inválidos',
                'message' => $e->getMessage()
            ], 422);
        } catch (\Exception $e) {
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
            // Obtener todos los ingresos de hoy
            $ingresos = Ingreso::with('propietario', 'vehiculo')
                ->whereDate('fecha_ingreso', Carbon::today())->get();
            $total = $ingresos->count();

            return response()->json([
                'total' => $total,
                'registros' => $ingresos
            ]);
        } catch (\Illuminate\Database\QueryException $e) {
            return response()->json([
                'error' => 'Error en la consulta de la base de datos',
                'message' => $e->getMessage()
            ], 500);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al obtener los ingresos de hoy',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
