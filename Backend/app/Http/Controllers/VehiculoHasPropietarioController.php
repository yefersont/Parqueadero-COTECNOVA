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
    public function destroy(VehiculoHasPropietario $vehiculoHasPropietario)
    {
        //
    }
}
