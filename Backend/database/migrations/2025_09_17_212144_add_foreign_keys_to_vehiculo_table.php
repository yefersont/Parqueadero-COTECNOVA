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
        Schema::table('vehiculo', function (Blueprint $table) {
            $table->foreign(['Marca_vehiculo'], 'fk_Vehiculo_Marca_vehiculo1')->references(['idMarca_vehiculo'])->on('marca_vehiculo')->onUpdate('no action')->onDelete('no action');
            $table->foreign(['Tipo_vehiculo'], 'fk_Vehiculo_Tipo_vehiculo1')->references(['idTipo_vehiculo'])->on('tipo_vehiculo')->onUpdate('no action')->onDelete('no action');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('vehiculo', function (Blueprint $table) {
            $table->dropForeign('fk_Vehiculo_Marca_vehiculo1');
            $table->dropForeign('fk_Vehiculo_Tipo_vehiculo1');
        });
    }
};
