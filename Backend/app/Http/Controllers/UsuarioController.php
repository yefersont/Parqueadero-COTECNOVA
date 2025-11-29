<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use Illuminate\Http\Request;

class UsuarioController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $usuario = Usuario::all();
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

            // Log de creación exitosa
            \Log::info('Usuario creado exitosamente', [
                'usuario_id' => $usuario->idUsuario,
                'email' => $usuario->email,
                'rol_id' => $usuario->idRol,
                'creado_por' => auth()->user()->idUsuario ?? 'Sistema',
                'ip' => $request->ip(),
                'timestamp' => now()
            ]);

            return response()->json([
                'message' => 'Usuario creado exitosamente',
                'usuario' => $usuario
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::warning('Validación fallida al crear usuario', [
                'errores' => $e->errors(),
                'datos_recibidos' => $request->except('password'),
                'ip' => $request->ip(),
                'timestamp' => now()
            ]);

            return response()->json([
                'error' => 'Datos inválidos',
                'message' => 'Por favor, corrija los errores en el formulario',
                'errores' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Error al crear usuario', [
                'error' => $e->getMessage(),
                'ip' => $request->ip(),
                'timestamp' => now()
            ]);

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

            // Actualizar usuario
            $usuario->update($validated);

            // Log de actualización exitosa
            \Log::info('Usuario actualizado exitosamente', [
                'usuario_id' => $usuario->idUsuario,
                'email' => $usuario->email,
                'actualizado_por' => auth()->user()->idUsuario ?? 'Sistema',
                'cambios' => array_keys($validated),
                'ip' => $request->ip(),
                'timestamp' => now()
            ]);

            return response()->json([
                'message' => 'Usuario actualizado exitosamente',
                'usuario' => $usuario
            ], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::warning('Validación fallida al actualizar usuario', [
                'usuario_id' => $usuario->idUsuario,
                'errores' => $e->errors(),
                'ip' => $request->ip(),
                'timestamp' => now()
            ]);

            return response()->json([
                'error' => 'Datos inválidos',
                'message' => 'Por favor, corrija los errores en el formulario',
                'errores' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Error al actualizar usuario', [
                'usuario_id' => $usuario->idUsuario,
                'error' => $e->getMessage(),
                'ip' => $request->ip(),
                'timestamp' => now()
            ]);

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
        //
    }
}
