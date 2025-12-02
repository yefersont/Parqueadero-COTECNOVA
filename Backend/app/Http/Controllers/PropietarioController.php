<?php

namespace App\Http\Controllers;

use App\Models\Propietario;
use Illuminate\Http\Request;
use Exception;

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
    public function update(Request $request, $id)
    {
        try {
            // Buscar propietario
            $propietario = Propietario::findOrFail($id);

            // Validar campos
            $request->validate([
                'Cedula_propietario' => 'required|unique:propietario,Cedula_propietario,' . $id . ',idPropietario',
                'Nombre_propietario' => 'required|string|max:100',
                'Apellido_propietario' => 'required|string|max:100',
                'Telefono_propietario' => 'required|string|max:15',
                'Rol' => 'required|exists:rol,idRol',
            ]);

            // Actualizar propietario
            $propietario->update($request->all());

            return response()->json([
                'message' => 'Propietario actualizado exitosamente',
                'propietario' => $propietario
            ], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al actualizar el propietario',
                'detalle' => $e->getMessage()
            ], 500);
        }
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Propietario $propietario)
    {
        //
        try {

            $propietario->delete();
            return response()->json(['message' => 'Propieatario eliminado exitosamente']);
        } catch (Exception $e) {

            return response()->json(['error' => 'Error al eliminar el propietario', 'detalle' => $e->getMessage()], 500);
        }
    }
    public function getVehiculosByPropietario($propietarioId)
    {
        $propietario = Propietario::with([
            'vehiculos.Tipo_vehiculo',
            'vehiculos.Marca_vehiculo',
            'ingresos.salidas' => function ($query) {
                // Cargar la salida asociada a cada ingreso
            },
            'ingresos.vehiculo' => function ($query) {
                // Cargar el vehículo vinculado al ingreso
            }
        ])
            ->find($propietarioId);
        if (!$propietario) {
            return response()->json(['message' => 'Propietario no encontrado'], 404);
        }
        // Obtener solo los últimos 5 ingresos
        $ultimosIngresos = $propietario->ingresos()
            ->with(['salidas', 'vehiculo'])
            ->orderBy('fecha_ingreso', 'desc')
            ->take(5)
            ->get();
        return response()->json([
            'vehiculos' => $propietario->vehiculos,
            'ultimos_ingresos' => $ultimosIngresos
        ]);
    }

    /**
     * Get propietario by cedula
     * 
     * @param string $cedula
     * @return \Illuminate\Http\JsonResponse
     */
    public function getByCedula($cedula)
    {
        try {
            // Validación estricta para prevenir SQL injection
            if (!preg_match('/^[0-9]{6,12}$/', $cedula)) {
                // \Log::warning('Intento de búsqueda con cédula inválida', [
                //     'cedula' => $cedula,
                //     'ip' => request()->ip(),
                //     'timestamp' => now()
                // ]);
                
                return response()->json([
                    'message' => 'Formato de cédula inválido. Solo se permiten números de 6 a 12 dígitos.'
                ], 400);
            }

            // Sanitizar entrada (ya validada, pero por seguridad adicional)
            $cedula = filter_var($cedula, FILTER_SANITIZE_NUMBER_INT);

            // Buscar propietario por cédula con sus relaciones
            $propietario = Propietario::with(['rol', 'vehiculos'])
                ->where('Cedula_propietario', $cedula)
                ->first();

            if (!$propietario) {
                return response()->json([
                    'message' => 'Propietario no encontrado'
                ], 404);
            }

            // Log de búsqueda exitosa
            // \Log::info('Búsqueda de propietario por cédula exitosa', [
            //     'cedula' => $cedula,
            //     'propietario_id' => $propietario->idPropietario,
            //     'ip' => request()->ip(),
            //     'timestamp' => now()
            // ]);

            return response()->json($propietario, 200);

        } catch (\Exception $e) {
            // \Log::error('Error al buscar propietario por cédula', [
            //     'cedula' => $cedula,
            //     'error' => $e->getMessage(),
            //     'ip' => request()->ip(),
            //     'timestamp' => now()
            // ]);
            
            return response()->json([
                'error' => 'Error al buscar el propietario',
                'detalle' => $e->getMessage()
            ], 500);
        }
    }
}
