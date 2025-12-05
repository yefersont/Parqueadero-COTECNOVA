<?php

namespace App\Traits;

use App\Models\AuditLog;

trait LogsActivity
{
    /**
     * Registrar actividad en audit log
     */
    protected function logActivity(
        string $action,
        string $model,
        $modelId = null,
        $oldValues = null,
        $newValues = null,
        string $description = null
    ) {
        try {
            AuditLog::log(
                action: $action,
                model: $model,
                modelId: $modelId,
                oldValues: $oldValues,
                newValues: $newValues,
                description: $description
            );
        } catch (\Exception $e) {
            // Log error pero no interrumpir la operación principal
            \Log::error('Error al registrar audit log', [
                'error' => $e->getMessage(),
                'action' => $action,
                'model' => $model,
            ]);
        }
    }
}
