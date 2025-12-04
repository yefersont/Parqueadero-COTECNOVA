<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Usuario;
use Illuminate\Support\Facades\Hash;
use App\Models\PasswordResetToken;
use App\Mail\ResetPasswordMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

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
            \Log::warning('Intento de login fallido - Usuario no existe', [
                'email' => $request->email,
                'ip' => $request->ip(),
                'timestamp' => now()
            ]);

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

    /**
     * Solicitar recuperación de contraseña (ISO 27001 A.9.4.3)
     */
    public function forgotPassword(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|email'
            ]);

            // Verificar que el usuario existe
            $usuario = Usuario::where('email', $request->email)->first();

            if (!$usuario) {
                Log::warning('Solicitud de recuperación para email no registrado', [
                    'email' => $request->email,
                    'ip' => $request->ip(),
                    'timestamp' => now()
                ]);

                // Por seguridad, no revelamos si el email existe o no
                return response()->json([
                    'message' => 'Si el correo existe en nuestro sistema, recibirás un enlace de recuperación.'
                ], 200);
            }

            // Generar token único
            $token = PasswordResetToken::createToken($request->email);

            // Construir URL de reset (frontend)
            $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');
            $resetUrl = "{$frontendUrl}/reset-password/{$token}?email=" . urlencode($request->email);

            // Enviar email
            Mail::to($request->email)->send(new ResetPasswordMail($resetUrl, $usuario->Nombres));

            Log::info('Email de recuperación enviado', [
                'usuario_id' => $usuario->idUsuario,
                'email' => $usuario->email,
                'ip' => $request->ip(),
                'timestamp' => now()
            ]);

            return response()->json([
                'message' => 'Si el correo existe en nuestro sistema, recibirás un enlace de recuperación.'
            ], 200);

        } catch (\Exception $e) {
            Log::error('Error al procesar solicitud de recuperación', [
                'error' => $e->getMessage(),
                'email' => $request->email ?? 'N/A',
                'ip' => $request->ip(),
                'timestamp' => now()
            ]);

            return response()->json([
                'error' => 'Error al procesar la solicitud',
                'message' => 'Por favor, intenta nuevamente más tarde.'
            ], 500);
        }
    }

    /**
     * Restablecer contraseña con token (ISO 27001 A.9.4.3)
     */
    public function resetPassword(Request $request)
    {
        try {
            // Validación con política de contraseñas robusta
            $validated = $request->validate([
                'email' => 'required|email',
                'token' => 'required|string',
                'password' => [
                    'required',
                    'string',
                    'min:8',
                    'confirmed',
                    'regex:/[a-z]/',
                    'regex:/[A-Z]/',
                    'regex:/[0-9]/',
                    'regex:/[@$!%*#?&]/',
                ],
            ], [
                'password.required' => 'La contraseña es requerida',
                'password.min' => 'La contraseña debe tener al menos 8 caracteres',
                'password.confirmed' => 'Las contraseñas no coinciden',
                'password.regex' => 'La contraseña debe contener al menos una mayúscula, una minúscula, un número y un símbolo especial (@$!%*#?&)',
            ]);

            // Verificar que el token es válido
            if (!PasswordResetToken::isValid($request->email, $request->token)) {
                Log::warning('Intento de reset con token inválido o expirado', [
                    'email' => $request->email,
                    'ip' => $request->ip(),
                    'timestamp' => now()
                ]);

                return response()->json([
                    'error' => 'Token inválido o expirado',
                    'message' => 'El enlace de recuperación ha expirado o es inválido. Solicita uno nuevo.'
                ], 400);
            }

            // Buscar usuario
            $usuario = Usuario::where('email', $request->email)->first();

            if (!$usuario) {
                return response()->json([
                    'error' => 'Usuario no encontrado'
                ], 404);
            }

            // Actualizar contraseña
            $usuario->password = $request->password; // El mutator se encarga del hash
            $usuario->save();

            // Invalidar el token
            PasswordResetToken::invalidate($request->email);

            // Resetear intentos fallidos si los hubiera
            $usuario->resetFailedAttempts();

            Log::info('Contraseña restablecida exitosamente', [
                'usuario_id' => $usuario->idUsuario,
                'email' => $usuario->email,
                'ip' => $request->ip(),
                'timestamp' => now()
            ]);

            return response()->json([
                'message' => 'Contraseña restablecida exitosamente. Ya puedes iniciar sesión.'
            ], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'error' => 'Datos inválidos',
                'message' => 'Por favor, corrija los errores en el formulario',
                'errores' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error al restablecer contraseña', [
                'error' => $e->getMessage(),
                'email' => $request->email ?? 'N/A',
                'ip' => $request->ip(),
                'timestamp' => now()
            ]);

            return response()->json([
                'error' => 'Error al restablecer la contraseña',
                'message' => 'Por favor, intenta nuevamente más tarde.'
            ], 500);
        }
    }

    /**
     * Verificar si un token de reset es válido
     */
    public function verifyResetToken(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'token' => 'required|string'
        ]);

        $isValid = PasswordResetToken::isValid($request->email, $request->token);

        return response()->json([
            'valid' => $isValid
        ], $isValid ? 200 : 400);
    }
}
