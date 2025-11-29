<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Usuario extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'usuario';
    protected $primaryKey = 'idUsuario';

    protected $fillable = [
        'Cedula_usuario',
        'idRol',
        'Nombres',
        'email',
        'user_usuario',
        'password',
        'failed_attempts',
        'locked_until',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'locked_until' => 'datetime',
    ];

    // Relación con Rol
    public function rol()
    {
        return $this->belongsTo(Rol::class, 'idRol', 'idRol');
    }

    // Métodos de seguridad ISO 27001
    
    /**
     * Verifica si la cuenta está bloqueada
     */
    public function isLocked()
    {
        if ($this->locked_until === null) {
            return false;
        }
        
        // Si la fecha de desbloqueo ya pasó, desbloquear automáticamente
        if (now()->greaterThan($this->locked_until)) {
            $this->unlockAccount();
            return false;
        }
        
        return true;
    }

    /**
     * Incrementa intentos fallidos y bloquea si es necesario
     */
    public function incrementFailedAttempts()
    {
        $this->failed_attempts++;
        
        // Bloquear después de 5 intentos fallidos por 15 minutos
        if ($this->failed_attempts >= 5) {
            $this->locked_until = now()->addMinutes(15);
        }
        
        $this->save();
    }

    /**
     * Resetea los intentos fallidos
     */
    public function resetFailedAttempts()
    {
        $this->failed_attempts = 0;
        $this->locked_until = null;
        $this->save();
    }

    /**
     * Desbloquea la cuenta manualmente
     */
    public function unlockAccount()
    {
        $this->locked_until = null;
        $this->failed_attempts = 0;
        $this->save();
    }
}
