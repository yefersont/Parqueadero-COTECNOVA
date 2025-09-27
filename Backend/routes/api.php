<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\IngresoController;
use App\Http\Controllers\SalidaController;
use App\Http\Controllers\VehiculoController;
use App\Http\Controllers\PropietarioController;
use App\Http\Controllers\TipoVehiculoController;
use App\Http\Controllers\MarcaVehiculoController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::apiResource('usuarios', UsuarioController::class);
Route::get('ingresos/hoy', [IngresoController::class, 'ShowToday']);
Route::apiResource('ingresos', IngresoController::class);
Route::apiResource('salidas', SalidaController::class);
Route::apiResource('vehiculos', VehiculoController::class);
Route::apiResource('propietarios', PropietarioController::class);
Route::apiResource('tp_vehiculos', TipoVehiculoController::class);
Route::apiResource('marcavehiculos', MarcaVehiculoController::class);
