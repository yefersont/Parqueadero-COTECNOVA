<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Vehiculo;

class VehiculoSeeder extends Seeder
{
    public function run(): void
    {
        // *** MOTOS ***
        Vehiculo::updateOrCreate(['Placa_vehiculo' => 'ZQE49E'], [
            'Tipo_vehiculo' => 1,
            'Marca_vehiculo' => 1,
            'Modelo_vehiculo' => 2020,
        ]);

        Vehiculo::updateOrCreate(['Placa_vehiculo' => 'QZN88F'], [
            'Tipo_vehiculo' => 1,
            'Marca_vehiculo' => 2,
            'Modelo_vehiculo' => 2022,
        ]);

        Vehiculo::updateOrCreate(['Placa_vehiculo' => 'LMN56G'], [
            'Tipo_vehiculo' => 1,
            'Marca_vehiculo' => 3,
            'Modelo_vehiculo' => 2021,
        ]);

        Vehiculo::updateOrCreate(['Placa_vehiculo' => 'RTY78H'], [
            'Tipo_vehiculo' => 1,
            'Marca_vehiculo' => 4,
            'Modelo_vehiculo' => 2019,
        ]);

        Vehiculo::updateOrCreate(['Placa_vehiculo' => 'QWE90J'], [
            'Tipo_vehiculo' => 1,
            'Marca_vehiculo' => 5,
            'Modelo_vehiculo' => 2023,
        ]);

        Vehiculo::updateOrCreate(['Placa_vehiculo' => 'UYT88H'], [
            'Tipo_vehiculo' => 1,
            'Marca_vehiculo' => 7,
            'Modelo_vehiculo' => 2020,
        ]);

        Vehiculo::updateOrCreate(['Placa_vehiculo' => 'MTR45G'], [
            'Tipo_vehiculo' => 1,
            'Marca_vehiculo' => 8,
            'Modelo_vehiculo' => 2022,
        ]);

        Vehiculo::updateOrCreate(['Placa_vehiculo' => 'HPQ21X'], [
            'Tipo_vehiculo' => 1,
            'Marca_vehiculo' => 9,
            'Modelo_vehiculo' => 2021,
        ]);

        // *** CARROS ***
        Vehiculo::updateOrCreate(['Placa_vehiculo' => 'KLM11A'], [
            'Tipo_vehiculo' => 2,
            'Marca_vehiculo' => 10,
            'Modelo_vehiculo' => 2018,
        ]);

        Vehiculo::updateOrCreate(['Placa_vehiculo' => 'ZXC22B'], [
            'Tipo_vehiculo' => 2,
            'Marca_vehiculo' => 11,
            'Modelo_vehiculo' => 2020,
        ]);

        Vehiculo::updateOrCreate(['Placa_vehiculo' => 'VBN33C'], [
            'Tipo_vehiculo' => 2,
            'Marca_vehiculo' => 12,
            'Modelo_vehiculo' => 2021,
        ]);

        Vehiculo::updateOrCreate(['Placa_vehiculo' => 'HJK44D'], [
            'Tipo_vehiculo' => 2,
            'Marca_vehiculo' => 13,
            'Modelo_vehiculo' => 2017,
        ]);

        Vehiculo::updateOrCreate(['Placa_vehiculo' => 'BNM55E'], [
            'Tipo_vehiculo' => 2,
            'Marca_vehiculo' => 14,
            'Modelo_vehiculo' => 2024,
        ]);

        Vehiculo::updateOrCreate(['Placa_vehiculo' => 'GHJ66F'], [
            'Tipo_vehiculo' => 2,
            'Marca_vehiculo' => 15,
            'Modelo_vehiculo' => 2019,
        ]);

        Vehiculo::updateOrCreate(['Placa_vehiculo' => 'POI77G'], [
            'Tipo_vehiculo' => 2,
            'Marca_vehiculo' => 16,
            'Modelo_vehiculo' => 2023,
        ]);

        $this->command->info('15 vehículos (motos y carros) generados exitosamente.');
    }
}
