<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeaders
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Prevenir que el sitio se muestre en iframes (protección contra clickjacking)
        $response->headers->set('X-Frame-Options', 'DENY');

        // Prevenir MIME type sniffing
        $response->headers->set('X-Content-Type-Options', 'nosniff');

        // Política de referrer para proteger privacidad
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');

        // Protección XSS para navegadores antiguos
        $response->headers->set('X-XSS-Protection', '1; mode=block');

        // HSTS - Forzar HTTPS (solo en producción)
        if (config('app.env') === 'production') {
            $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
        }

        // Política de permisos (desactivar features no usadas)
        $response->headers->set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

        // Content Security Policy (CSP) - Configuración básica
        // Ajustar según necesidades específicas del frontend
        $csp = [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // unsafe-inline y unsafe-eval necesarios para React en desarrollo
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "font-src 'self' https://fonts.gstatic.com",
            "img-src 'self' data: https:",
            "connect-src 'self' http://localhost:8000 http://localhost:5173", // Permitir conexiones a API local
        ];
        $response->headers->set('Content-Security-Policy', implode('; ', $csp));

        return $response;
    }
}
