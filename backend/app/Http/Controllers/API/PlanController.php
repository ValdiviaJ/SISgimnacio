<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Services\PlanService;

class PlanController extends BaseController
{
    protected PlanService $planService;

    public function __construct(PlanService $planService)
    {
        $this->planService = $planService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $planes = $this->planService->getAllPlans();
        return $this->sendResponse($planes, 'Planes obtenidos con éxito.');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'precio' => 'required|numeric|min:0',
            'duracion_dias' => 'required|integer|min:1',
            'features' => 'nullable|array',
            'popular' => 'nullable|boolean',
        ]);

        $plan = $this->planService->createPlan($validated);
        return $this->sendResponse($plan, 'Plan creado con éxito.', 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $plan = $this->planService->getPlanById($id);
        if (!$plan) {
            return $this->sendError('Plan no encontrado.');
        }
        return $this->sendResponse($plan, 'Detalle del plan obtenido.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'nombre' => 'nullable|string|max:255',
            'precio' => 'nullable|numeric|min:0',
            'duracion_dias' => 'nullable|integer|min:1',
            'features' => 'nullable|array',
            'popular' => 'nullable|boolean',
        ]);

        $success = $this->planService->updatePlan($id, $validated);
        if (!$success) {
            return $this->sendError('Plan no encontrado o no se pudo actualizar.');
        }

        $plan = $this->planService->getPlanById($id);
        return $this->sendResponse($plan, 'Plan actualizado con éxito.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $success = $this->planService->deletePlan($id);
        if (!$success) {
            return $this->sendError('Plan no encontrado o no se pudo eliminar.');
        }
        return $this->sendResponse([], 'Plan eliminado con éxito.');
    }
}
