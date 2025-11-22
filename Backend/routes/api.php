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
use App\Http\Controllers\ReporteController;
use App\Http\Controllers\VehiculoHasPropietarioController;
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
Route::get('/propietarios/cedula/{cedula}', [PropietarioController::class, 'getByCedula']);
Route::get('/propietarios/vehiculos/{id}', [PropietarioController::class, 'getVehiculosByPropietario']);
Route::get('/vehiculos/propietario/{id}', [VehiculoController::class, 'getPropietariosByVehiculo']);
Route::get('/ingresos/rango', [IngresoController::class, 'getIngresosPorRangoFechas']);


Route::apiResource('usuarios', UsuarioController::class);
Route::get('ingresos/hoy', [IngresoController::class, 'ShowToday']);
Route::apiResource('ingresos', IngresoController::class);
Route::get('/salidas/hoy', [SalidaController::class, 'ShowToday']);
Route::apiResource('salidas', SalidaController::class);

Route::apiResource('vehiculos', VehiculoController::class);

Route::apiResource('propietarios', PropietarioController::class);
Route::apiResource('tp_vehiculos', TipoVehiculoController::class);
Route::apiResource('marcavehiculos', MarcaVehiculoController::class);
Route::delete('/asociar/{idVehiculo}/{idPropietario}', [VehiculoHasPropietarioController::class, 'destroy']);
Route::apiResource('asociar',  VehiculoHasPropietarioController::class);
Route::get('/reportes/ingresos', [ReporteController::class, 'descargarIngresos']);
