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
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable(); // Nullable para acciones del sistema
            $table->string('action', 50); // CREATE, UPDATE, DELETE, LOGIN, etc.
            $table->string('model', 100); // Usuario, Propietario, Vehiculo, etc.
            $table->unsignedBigInteger('model_id')->nullable(); // ID del registro afectado
            $table->json('old_values')->nullable(); // Valores anteriores (para UPDATE)
            $table->json('new_values')->nullable(); // Valores nuevos (para CREATE/UPDATE)
            $table->string('ip_address', 45)->nullable(); // IPv4 o IPv6
            $table->text('user_agent')->nullable(); // Navegador/dispositivo
            $table->text('description')->nullable(); // Descripción adicional
            $table->timestamp('created_at')->useCurrent(); // Solo created_at, no updated_at
            
            // Índices para mejorar rendimiento de consultas
            $table->index('user_id');
            $table->index(['model', 'model_id']);
            $table->index('action');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
    }
};
