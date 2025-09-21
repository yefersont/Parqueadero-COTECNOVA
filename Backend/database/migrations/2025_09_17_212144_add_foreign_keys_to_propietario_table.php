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
        Schema::table('propietario', function (Blueprint $table) {
            $table->foreign(['Rol'], 'fk_Propietario_Rol')->references(['idRol'])->on('rol')->onUpdate('no action')->onDelete('no action');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('propietario', function (Blueprint $table) {
            $table->dropForeign('fk_Propietario_Rol');
        });
    }
};
