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
        Schema::create('vehiculo', function (Blueprint $table) {
            $table->integer('idVehiculo', true);
            $table->integer('Tipo_vehiculo')->index('fk_vehiculo_tipo_vehiculo1_idx');
            $table->integer('Marca_vehiculo')->index('fk_vehiculo_marca_vehiculo1_idx');
            $table->string('Placa_vehiculo', 45);
            $table->string('Modelo_vehiculo', 45);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vehiculo');
    }
};
