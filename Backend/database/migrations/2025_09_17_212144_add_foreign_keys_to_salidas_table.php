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
        Schema::table('salidas', function (Blueprint $table) {
            $table->foreign(['Ingresos_idIngresos'], 'fk_Salidas_Iingresos1')->references(['idIngresos'])->on('ingresos')->onUpdate('no action')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('salidas', function (Blueprint $table) {
            $table->dropForeign('fk_Salidas_Iingresos1');
        });
    }
};
