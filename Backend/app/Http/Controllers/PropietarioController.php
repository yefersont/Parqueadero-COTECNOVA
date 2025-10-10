<?php

namespace App\Http\Controllers;

use App\Models\Propietario;
use Illuminate\Http\Request;

class PropietarioController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $propietarios = Propietario::with('rol', 'vehiculos')->get();
        return response()->json($propietarios);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        try {
            $request->validate([
                'Cedula_propietario' => 'required|unique:propietario,Cedula_propietario',
                'Nombre_propietario' => 'required|string|max:100',
                'Apellido_propietario' => 'required|string|max:100',
                'Telefono_propietario' => 'required|string|max:15',
                'Rol' => 'required|exists:rol,idRol',
            ]);

            $propietario = Propietario::create($request->all());
            return response()->json([
                'message' => 'Propietario creado exitosamente',
                'idPropietario' => $propietario->idPropietario
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al crear el propietario',
                'detalle' => $e->getMessage()
            ], 500);
        }
    }
    /**
     * Display the specified resource.
     */
    public function show(Request $request)
    {
        $busqueda = $request->query('q');

        if (!$busqueda) {
            return response()->json(['error' => 'Debe enviar un término de búsqueda'], 400);
        }

        $propietarios = Propietario::with('rol')
            ->where('Nombre_propietario', 'like', "%{$busqueda}%")
            ->orWhere('Apellido_propietario', 'like', "%{$busqueda}%")
            ->get();

        if ($propietarios->isEmpty()) {
            return response()->json(['message' => 'No se encontraron resultados'], 404);
        }

        return response()->json($propietarios);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Propietario $propietario)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Propietario $propietario)
    {
        //
    }
}
