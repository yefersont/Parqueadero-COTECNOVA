<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use Illuminate\Http\Request;
use App\Traits\LogsActivity;

class UsuarioController extends Controller
{
    use LogsActivity;
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $usuario = Usuario::with('rol')->get();
        return response()->json($usuario);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            // Validación estricta con política de contraseñas robustas (ISO 27001)
            $validated = $request->validate([
                'Cedula_usuario' => 'required|unique:usuario,Cedula_usuario',
                'idRol' => 'required|exists:rol,idRol',
                'Nombres' => 'required|string|max:100',
                'email' => 'required|email|unique:usuario,email',
                'user_usuario' => 'required|string|max:50|unique:usuario,user_usuario',
                'password' => [
                    'required',
                    'string',
                    'min:8',                           // Mínimo 8 caracteres
                    'regex:/[a-z]/',                   // Al menos una minúscula
                    'regex:/[A-Z]/',                   // Al menos una mayúscula
                    'regex:/[0-9]/',                   // Al menos un número
                    'regex:/[@$!%*#?&]/',             // Al menos un símbolo especial
                ],
            ], [
                'password.required' => 'La contraseña es requerida',
                'password.min' => 'La contraseña debe tener al menos 8 caracteres',
                'password.regex' => 'La contraseña debe contener al menos una mayúscula, una minúscula, un número y un símbolo especial (@$!%*#?&)',
            ]);

            // Crear usuario
            $usuario = Usuario::create($validated);

            // Registrar en audit log
            $this->logActivity(
                action: 'USER_CREATED',
                model: 'Usuario',
                modelId: $usuario->idUsuario,
                newValues: array_merge($usuario->toArray(), ['password' => '[REDACTED]']),
                description: "Usuario creado: {$usuario->email} (Rol: {$usuario->idRol})"
            );

            return response()->json([
                'message' => 'Usuario creado exitosamente',
                'usuario' => $usuario
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            // \Log::warning('Validación fallida al crear usuario', [
            //     'errores' => $e->errors(),
            //     'datos_recibidos' => $request->except('password'),
            //     'ip' => $request->ip(),
            //     'timestamp' => now()
            // ]);

            return response()->json([
                'error' => 'Datos inválidos',
                'message' => 'Por favor, corrija los errores en el formulario',
                'errores' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            // \Log::error('Error al crear usuario', [
            //     'error' => $e->getMessage(),
            //     'ip' => $request->ip(),
            //     'timestamp' => now()
            // ]);

            return response()->json([
                'error' => 'Error al crear el usuario',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Usuario $usuario)
    {
        //
        return response()->json($usuario);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Usuario $usuario)
    {
        try {
            // Validación estricta (la contraseña es opcional al actualizar)
            $validated = $request->validate([
                'Cedula_usuario' => 'sometimes|unique:usuario,Cedula_usuario,' . $usuario->idUsuario . ',idUsuario',
                'idRol' => 'sometimes|exists:rol,idRol',
                'Nombres' => 'sometimes|string|max:100',
                'email' => 'sometimes|email|unique:usuario,email,' . $usuario->idUsuario . ',idUsuario',
                'user_usuario' => 'sometimes|string|max:50|unique:usuario,user_usuario,' . $usuario->idUsuario . ',idUsuario',
                'password' => [
                    'sometimes',
                    'string',
                    'min:8',
                    'regex:/[a-z]/',
                    'regex:/[A-Z]/',
                    'regex:/[0-9]/',
                    'regex:/[@$!%*#?&]/',
                ],
            ], [
                'password.min' => 'La contraseña debe tener al menos 8 caracteres',
                'password.regex' => 'La contraseña debe contener al menos una may úscula, una minúscula, un número y un símbolo especial (@$!%*#?&)',
            ]);

            // Guardar valores anteriores para audit log
            $oldValues = $usuario->getOriginal();
            $cambiosRealizados = array_keys($validated);

            // Actualizar usuario
            $usuario->update($validated);

            // Registrar en audit log
            $this->logActivity(
                action: 'USER_UPDATED',
                model: 'Usuario',
                modelId: $usuario->idUsuario,
                oldValues: array_merge($oldValues, ['password' => '[REDACTED]']),
                newValues: array_merge($usuario->toArray(), ['password' => '[REDACTED]']),
                description: "Usuario actualizado: {$usuario->email} (Cambios: " . implode(', ', $cambiosRealizados) . ")"
            );

            return response()->json([
                'message' => 'Usuario actualizado exitosamente',
                'usuario' => $usuario
            ], 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            // \Log::warning('Validación fallida al actualizar usuario', [
            //     'usuario_id' => $usuario->idUsuario,
            //     'errores' => $e->errors(),
            //     'ip' => $request->ip(),
            //     'timestamp' => now()
            // ]);

            return response()->json([
                'error' => 'Datos inválidos',
                'message' => 'Por favor, corrija los errores en el formulario',
                'errores' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            // \Log::error('Error al actualizar usuario', [
            //     'usuario_id' => $usuario->idUsuario,
            //     'error' => $e->getMessage(),
            //     'ip' => $request->ip(),
            //     'timestamp' => now()
            // ]);

            return response()->json([
                'error' => 'Error al actualizar el usuario',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Usuario $usuario)
    {
        try {
            // Guardar datos antes de eliminar
            $usuarioData = $usuario->toArray();

            $usuario->delete();

            // Registrar en audit log
            $this->logActivity(
                action: 'USER_DELETED',
                model: 'Usuario',
                modelId: $usuarioData['idUsuario'],
                oldValues: array_merge($usuarioData, ['password' => '[REDACTED]']),
                description: "Usuario eliminado: {$usuarioData['email']}"
            );

            return response()->json([
                'message' => 'Usuario eliminado exitosamente'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al eliminar el usuario',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
