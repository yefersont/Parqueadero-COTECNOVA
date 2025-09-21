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
        Schema::table('vehiculo_has_propietario', function (Blueprint $table) {
            $table->foreign(['Propietario_idPropietario'], 'fk_Vehiculo_has_Propietario_Propietario1')->references(['idPropietario'])->on('propietario')->onUpdate('no action')->onDelete('cascade');
            $table->foreign(['Vehiculo_idVehiculo'], 'fk_Vehiculo_has_Propietario_Vehiculo1')->references(['idVehiculo'])->on('vehiculo')->onUpdate('no action')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('vehiculo_has_propietario', function (Blueprint $table) {
            $table->dropForeign('fk_Vehiculo_has_Propietario_Propietario1');
            $table->dropForeign('fk_Vehiculo_has_Propietario_Vehiculo1');
        });
    }
};
