<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\TipoVehiculo;

class TipoVehiculoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        TipoVehiculo::updateOrCreate(
            ['idTipo_vehiculo' => 1],
            ['Tipo_vehiculo' => 'Moto']
        );

        TipoVehiculo::updateOrCreate(
            ['idTipo_vehiculo' => 2],
            ['Tipo_vehiculo' => 'Carro']
        );

        TipoVehiculo::updateOrCreate(
            ['idTipo_vehiculo' => 3],
            ['Tipo_vehiculo' => 'Bicicleta']
        );

        $this->command->info('Seeder de Tipo de Vehículos ejecutado correctamente.');
    }
}
