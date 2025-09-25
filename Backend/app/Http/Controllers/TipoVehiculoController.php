<?php

namespace App\Http\Controllers;

use App\Models\TipoVehiculo;
use Illuminate\Http\Request;

class TipoVehiculoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $tiposVehiculos = TipoVehiculo::all();
        return response()->json($tiposVehiculos);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(TipoVehiculo $tipoVehiculo)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, TipoVehiculo $tipoVehiculo)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TipoVehiculo $tipoVehiculo)
    {
        //
    }
}
