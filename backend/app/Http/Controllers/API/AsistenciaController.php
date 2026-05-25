<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Services\AsistenciaService;

class AsistenciaController extends BaseController
{
    protected AsistenciaService $asistenciaService;

    public function __construct(AsistenciaService $asistenciaService)
    {
        $this->asistenciaService = $asistenciaService;
    }

    /**
     * Handle client check-in entry.
     */
    public function checkIn(Request $request)
    {
        $request->validate([
            'identificador' => 'required|string',
            'metodo_acceso' => 'nullable|in:qr,manual,rfid'
        ]);

        $result = $this->asistenciaService->checkIn(
            $request->identificador,
            $request->metodo_acceso ?? 'manual'
        );

        if (!$result['success']) {
            return $this->sendError($result['message'], $result, 403);
        }

        return $this->sendResponse($result, $result['message']);
    }

    /**
     * Handle client check-out exit.
     */
    public function checkOut(Request $request)
    {
        $request->validate([
            'identificador' => 'required|string'
        ]);

        $result = $this->asistenciaService->checkOut($request->identificador);

        if (!$result['success']) {
            return $this->sendError($result['message'], [], 400);
        }

        return $this->sendResponse($result, $result['message']);
    }

    /**
     * Get historical log of today's gym entries/exits.
     */
    public function historial()
    {
        $asistencias = $this->asistenciaService->getHistorialHoy();
        return $this->sendResponse($asistencias, 'Historial de asistencia del día de hoy obtenido.');
    }

    /**
     * Validate entrance with a scan of QR code.
     */
    public function validateQR($code)
    {
        $result = $this->asistenciaService->validateQR($code);
        if (!$result['valid']) {
            return $this->sendError($result['message'], $result, 403);
        }
        return $this->sendResponse($result, $result['message']);
    }
}
