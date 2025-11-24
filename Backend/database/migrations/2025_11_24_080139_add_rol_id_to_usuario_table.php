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
        Schema::table('usuario', function (Blueprint $table) {
            $table->integer('idRol')->nullable()->after('Cedula_usuario');
            
            $table->foreign('idRol', 'usuario_ibfk_1')
                ->references('idRol')
                ->on('rol')
                ->onUpdate('no action')
                ->onDelete('no action');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('usuario', function (Blueprint $table) {
            $table->dropForeign('usuario_ibfk_1');
            $table->dropColumn('idRol');
        });
    }
};
