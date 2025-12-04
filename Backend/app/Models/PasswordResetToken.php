<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Carbon\Carbon;

class PasswordResetToken extends Model
{
    protected $fillable = ['email', 'token', 'created_at'];
    
    public $timestamps = false;
    
    /**
     * Generar un token único y seguro
     */
    public static function createToken(string $email): string
    {
        // Eliminar tokens anteriores del mismo email
        self::where('email', $email)->delete();
        
        // Generar token aleatorio de 64 caracteres
        $plainToken = Str::random(64);
        
        // Guardar el hash del token en la base de datos
        self::create([
            'email' => $email,
            'token' => Hash::make($plainToken),
            'created_at' => Carbon::now()
        ]);
        
        // Retornar el token en texto plano (se enviará por email)
        return $plainToken;
    }
    
    /**
     * Verificar si un token es válido
     */
    public static function isValid(string $email, string $token): bool
    {
        $record = self::where('email', $email)->first();
        
        if (!$record) {
            return false;
        }
        
        // Verificar que no haya expirado (15 minutos)
        if (Carbon::parse($record->created_at)->addMinutes(15)->isPast()) {
            // Token expirado, eliminarlo
            $record->delete();
            return false;
        }
        
        // Verificar que el token coincida
        return Hash::check($token, $record->token);
    }
    
    /**
     * Invalidar token después de uso
     */
    public static function invalidate(string $email): void
    {
        self::where('email', $email)->delete();
    }
    
    /**
     * Limpiar tokens expirados (puede ejecutarse en un cron job)
     */
    public static function cleanExpired(): int
    {
        $expiredTime = Carbon::now()->subMinutes(15);
        return self::where('created_at', '<', $expiredTime)->delete();
    }
}
