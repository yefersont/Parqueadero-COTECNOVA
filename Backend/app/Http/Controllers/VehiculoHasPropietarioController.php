<?php

namespace App\Http\Controllers;

use App\Models\VehiculoHasPropietario;
use Illuminate\Http\Request;

class VehiculoHasPropietarioController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        $request->validate([
            'Vehiculo_idVehiculo'  => 'required|integer',
            'Propietario_idPropietario' => 'required|integer'
        ]);
        $asociar = VehiculoHasPropietario::create($request->all());
        return response()->json([
            'message' => 'Propietario y vehiculo asociado',
            'date' => $asociar
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(VehiculoHasPropietario $vehiculoHasPropietario)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, VehiculoHasPropietario $vehiculoHasPropietario)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($idVehiculo, $idPropietario)
    {
        // Eliminar directamente usando query builder (funciona mejor con claves compuestas)
        $deleted = VehiculoHasPropietario::where('Vehiculo_idVehiculo', $idVehiculo)
            ->where('Propietario_idPropietario', $idPropietario)
            ->delete();

        if (!$deleted) {
            return response()->json([
                'message' => 'La relación entre el vehículo y el propietario no existe'
            ], 404);
        }

        return response()->json([
            'message' => 'Vehículo desligado del propietario exitosamente'
        ], 200);
    }
}
