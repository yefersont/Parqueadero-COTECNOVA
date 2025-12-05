<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Usuario;
use Illuminate\Support\Facades\Hash;

class UsuarioSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Usuario Admin (idRol = 3)
        Usuario::updateOrCreate(
            ['email' => 'admin@cotecnova.edu.co'],
            [
                'Nombres' => 'Administrador',
                'Cedula_usuario' => '1000000001',
                'idRol' => 3,
                'user_usuario' => 'admin',
                'password' => 'YeferTello10.@', // El modelo se encarga del hash
            ]
        );

        // Usuario Trabajador (idRol = 4)
        Usuario::updateOrCreate(
            ['email' => 'trabajador@cotecnova.edu.co'],
            [
                'Nombres' => 'Trabajador',
                'Cedula_usuario' => '1000000002',
                'idRol' => 4,
                'user_usuario' => 'trabajador',
                'password' => 'AngieRico10.@', // El modelo se encarga del hash
            ]
        );

        $this->command->info('Usuarios de prueba creados exitosamente:');
        $this->command->info('- Admin: admin@cotecnova.edu.co / YeferTello10.@');
        $this->command->info('- Trabajador: trabajador@cotecnova.edu.co / AngieRico10.@');
    }
}
