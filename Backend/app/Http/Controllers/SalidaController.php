<?php

namespace App\Http\Controllers;

use App\Models\Salida;
use Illuminate\Http\Request;

class SalidaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $salida = Salida::all();
        return response()->json($salida);
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
}
