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
        Schema::create('ingresos', function (Blueprint $table) {
            $table->integer('idIngresos', true);
            $table->integer('Propietario_idPropietario')->index('fk_iingresos_propietario1_idx');
            $table->integer('Vehiculo_idVehiculo')->index('fk_iingresos_vehiculo1_idx');
            $table->date('fecha_ingreso');
            $table->time('hora_ingreso');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ingresos');
    }
};
