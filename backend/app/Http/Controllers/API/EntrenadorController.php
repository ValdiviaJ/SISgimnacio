<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Services\EntrenadorService;

class EntrenadorController extends BaseController
{
    protected EntrenadorService $entrenadorService;

    public function __construct(EntrenadorService $entrenadorService)
    {
        $this->entrenadorService = $entrenadorService;
    }

    /**
     * Display a listing of the trainers.
     */
    public function index()
    {
        $entrenadores = $this->entrenadorService->getAll();
        return $this->sendResponse($entrenadores, 'Entrenadores recuperados con éxito.');
    }

    /**
     * Store a newly created trainer in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:6',
            'especialidad' => 'nullable|string|max:255',
            'horario' => 'nullable|string|max:255',
        ]);

        $trainer = $this->entrenadorService->createTrainer($request->all());

        return $this->sendResponse($trainer, 'Entrenador creado con éxito.', 201);
    }

    /**
     * Display the specified trainer.
     */
    public function show($id)
    {
        $entrenador = $this->entrenadorService->getById((int)$id);
        if (!$entrenador) {
            return $this->sendError('Entrenador no encontrado.');
        }
        return $this->sendResponse($entrenador, 'Detalle del entrenador obtenido.');
    }

    /**
     * Update the specified trainer in storage.
     */
    public function update(Request $request, $id)
    {
        $trainer = $this->entrenadorService->getById((int)$id);
        if (!$trainer) {
            return $this->sendError('Entrenador no encontrado.');
        }

        $userId = $trainer->user_id;

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $userId,
            'password' => 'nullable|string|min:6',
            'especialidad' => 'nullable|string|max:255',
            'horario' => 'nullable|string|max:255',
        ]);

        $updatedTrainer = $this->entrenadorService->updateTrainer((int)$id, $request->all());

        return $this->sendResponse($updatedTrainer, 'Entrenador actualizado con éxito.');
    }

    /**
     * Remove the specified trainer from storage.
     */
    public function destroy($id)
    {
        $result = $this->entrenadorService->deleteTrainer((int)$id);
        if (!$result) {
            return $this->sendError('Entrenador no encontrado o no se pudo eliminar.');
        }
        return $this->sendResponse([], 'Entrenador eliminado con éxito.');
    }
}
