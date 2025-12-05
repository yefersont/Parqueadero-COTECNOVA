<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Propietario;

class PropietarioSeeder extends Seeder
{
    public function run(): void
    {
        $propietarios = [
            ['Cedula_propietario' => 1006319573, 'Nombre_propietario' => 'Yeferson',   'Apellido_propietario' => 'Tello',     'Telefono_propietario' => '3126059025', 'Rol' => 1],
            ['Cedula_propietario' => 1006319574, 'Nombre_propietario' => 'Angie Daniela',    'Apellido_propietario' => 'Rico Muñoz',     'Telefono_propietario' => '3113372243', 'Rol' => 1],
            ['Cedula_propietario' => 1006319575, 'Nombre_propietario' => 'María',     'Apellido_propietario' => 'López',      'Telefono_propietario' => '3002223344', 'Rol' => 2],
            ['Cedula_propietario' => 1006319576, 'Nombre_propietario' => 'Juan',      'Apellido_propietario' => 'Martínez',   'Telefono_propietario' => '3003334455', 'Rol' => 2],
            ['Cedula_propietario' => 1006319577, 'Nombre_propietario' => 'Luisa',     'Apellido_propietario' => 'Hernández',  'Telefono_propietario' => '3004445566', 'Rol' => 2],
            ['Cedula_propietario' => 1006319578, 'Nombre_propietario' => 'Andrés',    'Apellido_propietario' => 'Pérez',      'Telefono_propietario' => '3005556677', 'Rol' => 2],
            ['Cedula_propietario' => 1006319579, 'Nombre_propietario' => 'Diana',     'Apellido_propietario' => 'Ramírez',    'Telefono_propietario' => '3006667788', 'Rol' => 2],
            ['Cedula_propietario' => 1006319580, 'Nombre_propietario' => 'Mateo',     'Apellido_propietario' => 'Ríos',       'Telefono_propietario' => '3007778899', 'Rol' => 2],
            ['Cedula_propietario' => 1006319581, 'Nombre_propietario' => 'Valentina', 'Apellido_propietario' => 'Mora',       'Telefono_propietario' => '3008889900', 'Rol' => 2],
            ['Cedula_propietario' => 1009012345, 'Nombre_propietario' => 'Santiago',  'Apellido_propietario' => 'Quintero',   'Telefono_propietario' => '3009990011', 'Rol' => 2],
            ['Cedula_propietario' => 1010123456, 'Nombre_propietario' => 'Laura',     'Apellido_propietario' => 'Castaño',    'Telefono_propietario' => '3011112233', 'Rol' => 2],
            ['Cedula_propietario' => 1011234567, 'Nombre_propietario' => 'Sebastián', 'Apellido_propietario' => 'Gómez',      'Telefono_propietario' => '3012223344', 'Rol' => 2],
            ['Cedula_propietario' => 1012345678, 'Nombre_propietario' => 'Paula',     'Apellido_propietario' => 'Luna',       'Telefono_propietario' => '3013334455', 'Rol' => 2],
            ['Cedula_propietario' => 1013456789, 'Nombre_propietario' => 'Felipe',    'Apellido_propietario' => 'Marín',      'Telefono_propietario' => '3014445566', 'Rol' => 2],
            ['Cedula_propietario' => 1014567890, 'Nombre_propietario' => 'Natalia',   'Apellido_propietario' => 'Roldán',     'Telefono_propietario' => '3015556677', 'Rol' => 2],
            ['Cedula_propietario' => 1015678901, 'Nombre_propietario' => 'Julián',    'Apellido_propietario' => 'Velásquez',  'Telefono_propietario' => '3016667788', 'Rol' => 2],
            ['Cedula_propietario' => 1016789012, 'Nombre_propietario' => 'Isabella',  'Apellido_propietario' => 'Suárez',     'Telefono_propietario' => '3017778899', 'Rol' => 2],
            ['Cedula_propietario' => 1017890123, 'Nombre_propietario' => 'Miguel',    'Apellido_propietario' => 'Castro',     'Telefono_propietario' => '3018889900', 'Rol' => 2],
            ['Cedula_propietario' => 1018901234, 'Nombre_propietario' => 'Sara',      'Apellido_propietario' => 'Torres',     'Telefono_propietario' => '3019990011', 'Rol' => 2],
            ['Cedula_propietario' => 1019012345, 'Nombre_propietario' => 'Tomás',     'Apellido_propietario' => 'Zapata',     'Telefono_propietario' => '3021112233', 'Rol' => 2],
            ['Cedula_propietario' => 1020123456, 'Nombre_propietario' => 'Camila',    'Apellido_propietario' => 'Ortiz',      'Telefono_propietario' => '3022223344', 'Rol' => 2],
        ];

        foreach ($propietarios as $p) {
            Propietario::create($p);
        }
    }
}
