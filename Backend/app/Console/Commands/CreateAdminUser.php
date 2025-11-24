<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Usuario;
use Illuminate\Support\Facades\Hash;

class CreateAdminUser extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'crear:usuario {nombre} {email} {password} {cedula?}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Crea un nuevo usuario con contraseña encriptada';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $nombre = $this->argument('nombre');
        $email = $this->argument('email');
        $password = $this->argument('password');
        $cedula = $this->argument('cedula') ?? rand(1000000, 9999999);

        // Verificar si el email ya existe
        if (Usuario::where('email', $email)->exists()) {
            $this->error("El correo {$email} ya está registrado.");
            return;
        }

        $usuario = new Usuario();
        $usuario->Nombres = $nombre;
        $usuario->email = $email;
        $usuario->password = $password; // El mutador del modelo se encargará del hash
        $usuario->Cedula_usuario = $cedula;
        $usuario->user_usuario = explode('@', $email)[0];
        // $usuario->Contraseña_usuario = $password; // Eliminado por seguridad
        
        $usuario->save();

        $this->info("Usuario {$nombre} creado exitosamente.");
        $this->info("Email: {$email}");
        $this->info("Password: {$password}");
    }
}
