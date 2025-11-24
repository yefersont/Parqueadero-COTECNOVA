<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EsAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Verificar que el usuario esté autenticado
        if (!$request->user()) {
            return response()->json([
                'message' => 'No autenticado'
            ], 401);
        }

        // Verificar que el usuario tenga un rol asignado
        if (!$request->user()->idRol) {
            return response()->json([
                'message' => 'Usuario sin rol asignado'
            ], 403);
        }

        // Cargar la relación del rol si no está cargada
        $usuario = $request->user();
        if (!$usuario->relationLoaded('rol')) {
            $usuario->load('rol');
        }

        // Verificar que el rol sea Administrativo
        if (!$usuario->rol || strcasecmp($usuario->rol->Rol, 'Administrativo') !== 0) {
            return response()->json([
                'message' => 'Acceso denegado. Solo los administradores pueden realizar esta acción.'
            ], 403);
        }

        return $next($request);
    }
}
