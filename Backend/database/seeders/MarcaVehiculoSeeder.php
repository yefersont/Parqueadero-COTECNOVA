<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\MarcaVehiculo;

class MarcaVehiculoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        MarcaVehiculo::updateOrCreate(
            ['idMarca_vehiculo' => 1],
            ['Marca_vehiculo' => 'Yamaha']
        );

        MarcaVehiculo::updateOrCreate(
            ['idMarca_vehiculo' => 2],
            ['Marca_vehiculo' => 'Honda']
        );

        MarcaVehiculo::updateOrCreate(
            ['idMarca_vehiculo' => 3],
            ['Marca_vehiculo' => 'Suzuki']
        );

        MarcaVehiculo::updateOrCreate(
            ['idMarca_vehiculo' => 4],
            ['Marca_vehiculo' => 'Bajaj']
        );

        MarcaVehiculo::updateOrCreate(
            ['idMarca_vehiculo' => 5],
            ['Marca_vehiculo' => 'AKT']
        );

        MarcaVehiculo::updateOrCreate(
            ['idMarca_vehiculo' => 6],
            ['Marca_vehiculo' => 'Hero']
        );

        MarcaVehiculo::updateOrCreate(
            ['idMarca_vehiculo' => 7],
            ['Marca_vehiculo' => 'TVS']
        );

        MarcaVehiculo::updateOrCreate(
            ['idMarca_vehiculo' => 8],
            ['Marca_vehiculo' => 'Kawasaki']
        );

        MarcaVehiculo::updateOrCreate(
            ['idMarca_vehiculo' => 9],
            ['Marca_vehiculo' => 'KTM']
        );

        MarcaVehiculo::updateOrCreate(
            ['idMarca_vehiculo' => 10],
            ['Marca_vehiculo' => 'Chevrolet']
        );

        MarcaVehiculo::updateOrCreate(
            ['idMarca_vehiculo' => 11],
            ['Marca_vehiculo' => 'Renault']
        );

        MarcaVehiculo::updateOrCreate(
            ['idMarca_vehiculo' => 12],
            ['Marca_vehiculo' => 'Mazda']
        );

        MarcaVehiculo::updateOrCreate(
            ['idMarca_vehiculo' => 13],
            ['Marca_vehiculo' => 'Toyota']
        );

        MarcaVehiculo::updateOrCreate(
            ['idMarca_vehiculo' => 14],
            ['Marca_vehiculo' => 'Nissan']
        );

        MarcaVehiculo::updateOrCreate(
            ['idMarca_vehiculo' => 15],
            ['Marca_vehiculo' => 'Hyundai']
        );

        MarcaVehiculo::updateOrCreate(
            ['idMarca_vehiculo' => 16],
            ['Marca_vehiculo' => 'Kia']
        );

        MarcaVehiculo::updateOrCreate(
            ['idMarca_vehiculo' => 17],
            ['Marca_vehiculo' => 'Volkswagen']
        );

        MarcaVehiculo::updateOrCreate(
            ['idMarca_vehiculo' => 18],
            ['Marca_vehiculo' => 'Ford']
        );

        MarcaVehiculo::updateOrCreate(
            ['idMarca_vehiculo' => 19],
            ['Marca_vehiculo' => 'BMW']
        );

        MarcaVehiculo::updateOrCreate(
            ['idMarca_vehiculo' => 20],
            ['Marca_vehiculo' => 'Mercedes-Benz']
        );

        $this->command->info('Seeder de Marcas de Vehículos ejecutado correctamente.');
    }
}
