<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('vehiculo_has_propietario', function (Blueprint $table) {
            $table->integer('Vehiculo_idVehiculo')->index('fk_vehiculo_has_propietario_vehiculo1_idx');
            $table->integer('Propietario_idPropietario')->index('fk_vehiculo_has_propietario_propietario1_idx');

            $table->primary(['Vehiculo_idVehiculo', 'Propietario_idPropietario']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vehiculo_has_propietario');
    }
};
