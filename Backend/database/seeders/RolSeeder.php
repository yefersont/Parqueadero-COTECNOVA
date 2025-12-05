<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RolSeeder extends Seeder
{
    public function run()
    {
        DB::table('rol')->insert([
            ['idRol' => 1, 'Rol' => 'Estudiante'],
            ['idRol' => 2, 'Rol' => 'Docente'],
            ['idRol' => 3, 'Rol' => 'Administrativo'],
            ['idRol' => 4, 'Rol' => 'Trabajador'],
        ]);
    }
}
