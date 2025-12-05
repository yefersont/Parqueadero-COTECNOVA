<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class VehiculoPropietarioSeeder extends Seeder
{
    public function run()
    {
        $data = [];

        // Generamos relaciones 1-1 del 1 al 15
        for ($i = 1; $i <= 15; $i++) {
            $data[] = [
                'idPropietario' => $i,
                'idVehiculo'    => $i,
            ];
        }

        DB::table('vehiculo_has_propietario')->insert($data);
    }
}
