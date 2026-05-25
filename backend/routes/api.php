<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\ClienteController;
use App\Http\Controllers\API\MembresiaController;
use App\Http\Controllers\API\PlanController;
use App\Http\Controllers\API\AsistenciaController;
use App\Http\Controllers\API\EntrenadorController;
use App\Http\Controllers\API\RutinaController;
use App\Http\Controllers\API\PagoController;
use App\Http\Controllers\API\ReporteController;
use App\Http\Controllers\API\ConfiguracionController;

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

// Public routes
Route::post('/v1/auth/login', [AuthController::class, 'login']);
Route::post('/v1/auth/forgot-password', [AuthController::class, 'forgotPassword']);

// Protected routes (Sanctum)
Route::middleware('auth:sanctum')->prefix('v1')->group(function () {
    
    // Auth actions
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    // 1. Dashboard & Reports (Available for Admin, Recepcionista, Entrenador)
    Route::middleware('role:admin,recepcionista,entrenador')->group(function () {
        Route::get('/reports/summary', [ReporteController::class, 'summary']);
        Route::get('/reports/earnings', [ReporteController::class, 'earnings']);
        Route::get('/reports/memberships', [ReporteController::class, 'memberships']);
        Route::get('/reports/attendance', [ReporteController::class, 'attendance']);
    });

    // 2. Clientes Management (Admin, Recepcionista)
    Route::middleware('role:admin,recepcionista')->group(function () {
        Route::apiResource('clientes', ClienteController::class);
        Route::patch('clientes/{id}/status', [ClienteController::class, 'updateStatus']);
    });
    // Cliente read-only or self info (Admin, Recepcionista, Entrenador, Cliente)
    Route::get('clientes/{id}', [ClienteController::class, 'show'])->middleware('role:admin,recepcionista,entrenador,cliente');

    // 3. Membresias & Planes Management
    Route::middleware('role:admin,recepcionista')->group(function () {
        Route::apiResource('membresias', MembresiaController::class);
        Route::post('membresias/{id}/renovar', [MembresiaController::class, 'renovar']);
        
        // Read access to plans for receptionists and admins
        Route::get('planes', [PlanController::class, 'index']);
        Route::get('planes/{id}', [PlanController::class, 'show']);
    });

    // Write access to plans (CRUD) only for admin
    Route::middleware('role:admin')->group(function () {
        Route::post('planes', [PlanController::class, 'store']);
        Route::put('planes/{id}', [PlanController::class, 'update']);
        Route::delete('planes/{id}', [PlanController::class, 'destroy']);
    });

    // 4. Asistencia Control (Admin, Recepcionista, Cliente)
    Route::post('asistencia/check-in', [AsistenciaController::class, 'checkIn'])->middleware('role:admin,recepcionista');
    Route::post('asistencia/check-out', [AsistenciaController::class, 'checkOut'])->middleware('role:admin,recepcionista');
    Route::get('asistencia/historial', [AsistenciaController::class, 'historial'])->middleware('role:admin,recepcionista,entrenador');
    Route::get('asistencia/qr-validate/{code}', [AsistenciaController::class, 'validateQR'])->middleware('role:admin,recepcionista');

    // 5. Entrenadores Management (Admin)
    Route::middleware('role:admin')->group(function () {
        Route::apiResource('entrenadores', EntrenadorController::class);
    });
    Route::get('entrenadores', [EntrenadorController::class, 'index'])->middleware('role:admin,recepcionista,entrenador');
    Route::get('entrenadores/{id}', [EntrenadorController::class, 'show'])->middleware('role:admin,recepcionista,entrenador');

    // 6. Rutinas y Entrenamiento (Admin, Entrenador, Cliente)
    Route::middleware('role:admin,entrenador')->group(function () {
        Route::apiResource('rutinas', RutinaController::class);
        Route::post('rutinas/{id}/assign', [RutinaController::class, 'assignToCliente']);
    });
    Route::get('rutinas/cliente/{clienteId}', [RutinaController::class, 'clienteRutinas'])->middleware('role:admin,entrenador,cliente');

    // 7. Pagos (Admin, Recepcionista)
    Route::middleware('role:admin,recepcionista')->group(function () {
        Route::apiResource('pagos', PagoController::class);
        Route::get('pagos/historial', [PagoController::class, 'historial']);
    });
    Route::get('pagos/cliente/{clienteId}', [PagoController::class, 'clientePagos'])->middleware('role:admin,recepcionista,cliente');

    // 8. Configuración (Admin)
    Route::middleware('role:admin')->group(function () {
        Route::get('configuracion', [ConfiguracionController::class, 'show']);
        Route::put('configuracion', [ConfiguracionController::class, 'update']);
    });
});
