<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Usuario;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $usuario = Usuario::where('email', $request->email)->first();

        // Verificar si el usuario existe
        if (!$usuario) {
            // Log de intento fallido sin usuario
            // \Log::warning('Intento de login fallido - Usuario no existe', [
            //     'email' => $request->email,
            //     'ip' => $request->ip(),
            //     'timestamp' => now()
            // ]);

            return response()->json([
                'message' => 'Credenciales incorrectas'
            ], 401);
        }

        // Verificar si la cuenta está bloqueada
        if ($usuario->isLocked()) {
            // Calcular minutos restantes correctamente
            $minutosRestantes = max(1, ceil(now()->diffInMinutes($usuario->locked_until, false)));

            \Log::warning('Intento de login en cuenta bloqueada', [
                'usuario_id' => $usuario->idUsuario,
                'email' => $usuario->email,
                'ip' => $request->ip(),
                'intentos_fallidos' => $usuario->failed_attempts,
                'bloqueado_hasta' => $usuario->locked_until,
                'timestamp' => now()
            ]);

            return response()->json([
                'message' => 'Cuenta bloqueada temporalmente por múltiples intentos fallidos. Intente nuevamente en ' . $minutosRestantes . ' minuto(s).'
            ], 403);
        }

        // Verificar contraseña
        if (!Hash::check($request->password, $usuario->password)) {
            // Incrementar intentos fallidos
            $usuario->incrementFailedAttempts();

            \Log::warning('Intento de login fallido - Contraseña incorrecta', [
                'usuario_id' => $usuario->idUsuario,
                'email' => $usuario->email,
                'ip' => $request->ip(),
                'intentos_fallidos' => $usuario->failed_attempts,
                'timestamp' => now()
            ]);

            return response()->json([
                'message' => 'Contraseña incorrecta'
            ], 401);
        }

        // Login exitoso - resetear intentos fallidos
        $usuario->resetFailedAttempts();

        // Cargar la relación del rol
        $usuario->load('rol');

        $tokenResult = $usuario->createToken('auth_token');
        // Asignar expiración de 6 horas
        $tokenResult->accessToken->expires_at = now()->addHours(6);
        $tokenResult->accessToken->save();
        $token = $tokenResult->plainTextToken;

        // Log de login exitoso
        \Log::info('Login exitoso', [
            'usuario_id' => $usuario->idUsuario,
            'email' => $usuario->email,
            'rol' => $usuario->rol->Descripcion,
            'ip' => $request->ip(),
            'timestamp' => now()
        ]);

        return response()->json([
            'message' => 'Login exitoso',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $usuario
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout exitoso'
        ]);
    }

    public function me(Request $request)
    {

        $user = $request->user()->load('rol');
        return response()->json($user);
    }
}
