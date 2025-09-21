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
        //
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
}
