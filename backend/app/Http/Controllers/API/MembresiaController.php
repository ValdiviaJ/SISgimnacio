<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Services\MembresiaService;

class MembresiaController extends BaseController
{
    protected MembresiaService $membresiaService;

    public function __construct(MembresiaService $membresiaService)
    {
        $this->membresiaService = $membresiaService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $membresias = $this->membresiaService->getAllMembresias();
        return $this->sendResponse($membresias, 'Membresías obtenidas con éxito.');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'cliente_id' => 'required|exists:clientes,id',
            'plan_id' => 'required|exists:planes,id',
            'precio' => 'required|numeric|min:0',
            'fecha_inicio' => 'nullable|date',
            'estado' => 'nullable|in:activa,vencida,cancelada',
        ]);

        $membresia = $this->membresiaService->createMembresia($validated);
        return $this->sendResponse($membresia, 'Membresía registrada con éxito.', 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $membresia = $this->membresiaService->getMembresiaById($id);
        if (!$membresia) {
            return $this->sendError('Membresía no encontrada.');
        }
        return $this->sendResponse($membresia, 'Detalle de membresía obtenido.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'plan_id' => 'nullable|exists:planes,id',
            'precio' => 'nullable|numeric|min:0',
            'fecha_inicio' => 'nullable|date',
            'estado' => 'nullable|in:activa,vencida,cancelada',
        ]);

        $membresia = $this->membresiaService->updateMembresia($id, $validated);
        if (!$membresia) {
            return $this->sendError('Membresía no encontrada o no se pudo actualizar.');
        }

        return $this->sendResponse($membresia, 'Membresía actualizada con éxito.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $deleted = $this->membresiaService->deleteMembresia($id);
        if (!$deleted) {
            return $this->sendError('Membresía no encontrada o no se pudo eliminar.');
        }
        return $this->sendResponse([], 'Membresía eliminada con éxito.');
    }

    /**
     * Renew a membership plan.
     */
    public function renovar(Request $request, $id)
    {
        $validated = $request->validate([
            'plan_id' => 'nullable|exists:planes,id',
            'precio' => 'nullable|numeric|min:0',
        ]);

        $membresia = $this->membresiaService->renovarMembresia($id, $validated);
        if (!$membresia) {
            return $this->sendError('Membresía no encontrada o no se pudo renovar.');
        }

        return $this->sendResponse($membresia, 'Membresía renovada con éxito.');
    }
}
