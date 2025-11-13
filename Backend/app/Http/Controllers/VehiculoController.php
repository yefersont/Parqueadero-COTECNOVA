<?php

namespace App\Http\Controllers;

use App\Models\Vehiculo;
use Illuminate\Http\Request;

class VehiculoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $vehiculos = Vehiculo::with('Tipo_vehiculo', 'marca_vehiculo')->get();
        return response()->json($vehiculos);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $request->validate([
                'Tipo_vehiculo' => 'required|exists:tipo_vehiculo,idTipo_vehiculo',
                'Marca_vehiculo' => 'required|exists:marca_vehiculo,idMarca_vehiculo',
                'Placa_vehiculo' => 'required|string|max:45|unique:vehiculo,Placa_vehiculo',
                'Modelo_vehiculo' => 'required|string|max:45'
            ]);
            $vehiculo = Vehiculo::create($request->all());
            return response()->json([
                'message' => 'Vehiculo creado exitosamente',
                'vehiculo' => $vehiculo->idVehiculo
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al crear el vehiculo', 'message' => $e->getMessage()], 500);
        }
    }
    /**
     * Display the specified resource.
     */
    public function show(Vehiculo $vehiculo)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        try {
            // Buscar el vehículo
            $vehiculo = Vehiculo::findOrFail($id);
            // Validar los datos
            $request->validate([
                'Tipo_vehiculo' => 'required|exists:tipo_vehiculo,idTipo_vehiculo',
                'Marca_vehiculo' => 'required|exists:marca_vehiculo,idMarca_vehiculo',
                'Placa_vehiculo' => 'required|string|max:45|unique:vehiculo,Placa_vehiculo,' . $vehiculo->idVehiculo . ',idVehiculo',
                'Modelo_vehiculo' => 'required|string|max:45'
            ]);
            // Actualizar los campos
            $vehiculo->update([
                'Tipo_vehiculo' => $request->Tipo_vehiculo,
                'Marca_vehiculo' => $request->Marca_vehiculo,
                'Placa_vehiculo' => $request->Placa_vehiculo,
                'Modelo_vehiculo' => $request->Modelo_vehiculo
            ]);
            return response()->json([
                'message' => 'Vehículo actualizado exitosamente',
                'vehiculo' => $vehiculo
            ], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Vehículo no encontrado'], 404);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al actualizar el vehículo',
                'message' => $e->getMessage()
            ], 500);
        }
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Vehiculo $vehiculo)
    {
        //
        $vehiculo->delete();
        return response()->json(['message' => 'Vehículo eliminado exitosamente'], 200);
    }

    public function getPropietariosByVehiculo($vehiculoId)
    {
        // Cargar el vehículo con sus propietarios relacionados
        $vehiculo = Vehiculo::with('propietarios')->find($vehiculoId);

        if (!$vehiculo) {
            return response()->json(['message' => 'Vehículo no encontrado'], 404);
        }

        // Retornar únicamente los propietarios asociados
        return response()->json([
            'propietarios' => $vehiculo->propietarios,
        ]);
    }
}
