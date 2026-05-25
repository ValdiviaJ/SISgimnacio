<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Services\RutinaService;

class RutinaController extends BaseController
{
    protected RutinaService $rutinaService;

    public function __construct(RutinaService $rutinaService)
    {
        $this->rutinaService = $rutinaService;
    }

    /**
     * Display a listing of the routines.
     */
    public function index()
    {
        $rutinas = $this->rutinaService->getAll();
        return $this->sendResponse($rutinas, 'Rutinas recuperadas con éxito.');
    }

    /**
     * Store a newly created routine in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'nivel' => 'required|in:principiante,intermedio,avanzado',
            'ejercicios' => 'required|array',
            'entrenador_id' => 'nullable|exists:entrenadores,id',
        ]);

        try {
            $rutina = $this->rutinaService->createRoutine($request->all(), $request->user()->id);
            return $this->sendResponse($rutina, 'Rutina creada con éxito.', 201);
        } catch (\Exception $e) {
            return $this->sendError($e->getMessage(), [], 400);
        }
    }

    /**
     * Display the specified routine.
     */
    public function show($id)
    {
        $rutina = $this->rutinaService->getById((int)$id);
        if (!$rutina) {
            return $this->sendError('Rutina no encontrada.');
        }
        return $this->sendResponse($rutina, 'Detalle de la rutina obtenido.');
    }

    /**
     * Update the specified routine in storage.
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'nivel' => 'required|in:principiante,intermedio,avanzado',
            'ejercicios' => 'required|array',
            'entrenador_id' => 'nullable|exists:entrenadores,id',
        ]);

        $rutina = $this->rutinaService->updateRoutine((int)$id, $request->all());
        if (!$rutina) {
            return $this->sendError('Rutina no encontrada.');
        }

        return $this->sendResponse($rutina, 'Rutina actualizada con éxito.');
    }

    /**
     * Remove the specified routine from storage.
     */
    public function destroy($id)
    {
        $result = $this->rutinaService->deleteRoutine((int)$id);
        if (!$result) {
            return $this->sendError('Rutina no encontrada.');
        }
        return $this->sendResponse([], 'Rutina eliminada con éxito.');
    }

    /**
     * Assign routine to client.
     */
    public function assignToCliente(Request $request, $id)
    {
        $request->validate([
            'cliente_id' => 'required|exists:clientes,id'
        ]);

        try {
            $this->rutinaService->assignToCliente((int)$id, (int)$request->cliente_id);
            return $this->sendResponse([], 'Rutina asignada al cliente correctamente.');
        } catch (\Exception $e) {
            return $this->sendError($e->getMessage(), [], 400);
        }
    }

    /**
     * Fetch routines assigned to specific client.
     */
    public function clienteRutinas($clienteId)
    {
        $rutinas = $this->rutinaService->getClientRoutines((int)$clienteId);
        return $this->sendResponse($rutinas, 'Rutinas del cliente recuperadas con éxito.');
    }
}
