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
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EstadisticasController;

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

// Rutas públicas
Route::post('/login', [AuthController::class, 'login'])
 ->middleware('throttle:10,4');
// Recuperación de contraseña (ISO 27001 A.9.4.3)
Route::post('/forgot-password', [AuthController::class, 'forgotPassword'])
    ->middleware('throttle:10,60'); // Máximo 10 intentos por hora
Route::post('/reset-password', [AuthController::class, 'resetPassword']);
Route::post('/verify-reset-token', [AuthController::class, 'verifyResetToken']);
// Rutas protegidas con autenticación (todos los usuarios autenticados)
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Consultas (GET) - Todos los usuarios autenticados pueden ver
    Route::get('/propietarios/cedula/{cedula}', [PropietarioController::class, 'getByCedula']);
    Route::get('/propietarios/vehiculos/{id}', [PropietarioController::class, 'getVehiculosByPropietario']);
    Route::get('/vehiculos/propietario/{id}', [VehiculoController::class, 'getPropietariosByVehiculo']);
    Route::get('/ingresos/rango', [IngresoController::class, 'getIngresosPorRangoFechas']);
    Route::get('/ingresos/hoy', [IngresoController::class, 'ShowToday']);
    Route::get('/salidas/hoy', [SalidaController::class, 'ShowToday']);
    Route::get('/reportes/ingresos', [ReporteController::class, 'descargarIngresos']);

    // Solo lectura de recursos
    Route::get('/usuarios', [UsuarioController::class, 'index']);
    Route::get('/usuarios/{usuario}', [UsuarioController::class, 'show']);
    Route::get('/ingresos', [IngresoController::class, 'index']);
    Route::get('/ingresos/{ingreso}', [IngresoController::class, 'show']);
    Route::get('/salidas', [SalidaController::class, 'index']);
    Route::get('/salidas/{salida}', [SalidaController::class, 'show']);
    Route::get('/vehiculos', [VehiculoController::class, 'index']);
    Route::get('/vehiculos/{vehiculo}', [VehiculoController::class, 'show']);
    Route::get('/propietarios', [PropietarioController::class, 'index']);
    Route::get('/propietarios/{propietario}', [PropietarioController::class, 'show']);
    Route::get('/tp_vehiculos', [TipoVehiculoController::class, 'index']);
    Route::get('/tp_vehiculos/{tp_vehiculo}', [TipoVehiculoController::class, 'show']);
    Route::get('/marcavehiculos', [MarcaVehiculoController::class, 'index']);
    Route::get('/marcavehiculos/{marcavehiculo}', [MarcaVehiculoController::class, 'show']);
    Route::get('/asociar', [VehiculoHasPropietarioController::class, 'index']);
    Route::get('/asociar/{asociar}', [VehiculoHasPropietarioController::class, 'show']);

    // Crear ingresos y salidas (vigilantes pueden hacer esto)
    Route::post('/ingresos', [IngresoController::class, 'store']);
    Route::post('/salidas', [SalidaController::class, 'store']);

    // Estadísticas del dashboard
    Route::get('/estadisticas/dashboard', [EstadisticasController::class, 'dashboard']);
});

// Rutas solo para administradores (requieren auth + rol admin)
Route::middleware(['auth:sanctum', 'esAdmin'])->group(function () {
    // Gestión completa de usuarios
    Route::post('/usuarios', [UsuarioController::class, 'store']);
    Route::put('/usuarios/{usuario}', [UsuarioController::class, 'update']);
    Route::delete('/usuarios/{usuario}', [UsuarioController::class, 'destroy']);

    // Modificación de ingresos y salidas
    Route::put('/ingresos/{ingreso}', [IngresoController::class, 'update']);
    Route::delete('/ingresos/{ingreso}', [IngresoController::class, 'destroy']);
    Route::put('/salidas/{salida}', [SalidaController::class, 'update']);
    Route::delete('/salidas/{salida}', [SalidaController::class, 'destroy']);

    // Gestión de vehículos
    Route::post('/vehiculos', [VehiculoController::class, 'store']);
    Route::put('/vehiculos/{vehiculo}', [VehiculoController::class, 'update']);
    Route::delete('/vehiculos/{vehiculo}', [VehiculoController::class, 'destroy']);

    // Gestión de propietarios
    Route::post('/propietarios', [PropietarioController::class, 'store']);
    Route::put('/propietarios/{propietario}', [PropietarioController::class, 'update']);
    Route::delete('/propietarios/{propietario}', [PropietarioController::class, 'destroy']);

    // Gestión de tipos y marcas de vehículos
    Route::post('/tp_vehiculos', [TipoVehiculoController::class, 'store']);
    Route::put('/tp_vehiculos/{tp_vehiculo}', [TipoVehiculoController::class, 'update']);
    Route::delete('/tp_vehiculos/{tp_vehiculo}', [TipoVehiculoController::class, 'destroy']);
    Route::post('/marcavehiculos', [MarcaVehiculoController::class, 'store']);
    Route::put('/marcavehiculos/{marcavehiculo}', [MarcaVehiculoController::class, 'update']);
    Route::delete('/marcavehiculos/{marcavehiculo}', [MarcaVehiculoController::class, 'destroy']);

    // Asociación de vehículos y propietarios
    Route::post('/asociar', [VehiculoHasPropietarioController::class, 'store']);
    Route::put('/asociar/{asociar}', [VehiculoHasPropietarioController::class, 'update']);
    Route::delete('/asociar/{idVehiculo}/{idPropietario}', [VehiculoHasPropietarioController::class, 'destroy']);
});

