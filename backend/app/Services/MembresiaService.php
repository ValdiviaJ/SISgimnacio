<?php

namespace App\Services;

use App\Repositories\Contracts\MembresiaRepositoryInterface;
use App\Repositories\Contracts\ClienteRepositoryInterface;
use App\Repositories\Contracts\PlanRepositoryInterface;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class MembresiaService extends BaseService
{
    protected MembresiaRepositoryInterface $membresiaRepository;
    protected ClienteRepositoryInterface $clienteRepository;
    protected PlanRepositoryInterface $planRepository;

    public function __construct(
        MembresiaRepositoryInterface $membresiaRepository,
        ClienteRepositoryInterface $clienteRepository,
        PlanRepositoryInterface $planRepository
    ) {
        $this->membresiaRepository = $membresiaRepository;
        $this->clienteRepository = $clienteRepository;
        $this->planRepository = $planRepository;
    }

    public function getAllMembresias()
    {
        return $this->membresiaRepository->all();
    }

    public function getMembresiaById($id)
    {
        return $this->membresiaRepository->find($id);
    }

    public function createMembresia(array $data)
    {
        return DB::transaction(function () use ($data) {
            $plan = $this->planRepository->find($data['plan_id']);
            if (!$plan) {
                throw new \Exception("Plan no encontrado.");
            }

            // Calcular fecha de vencimiento
            $fechaInicio = isset($data['fecha_inicio']) ? Carbon::parse($data['fecha_inicio']) : Carbon::today();
            $fechaVencimiento = $fechaInicio->copy()->addDays($plan->duracion_dias);

            $membresiaData = [
                'cliente_id' => $data['cliente_id'],
                'plan_id' => $data['plan_id'],
                'precio' => $data['precio'] ?? $plan->precio,
                'fecha_inicio' => $fechaInicio->toDateString(),
                'fecha_vencimiento' => $fechaVencimiento->toDateString(),
                'estado' => $data['estado'] ?? 'activa',
            ];

            $membresia = $this->membresiaRepository->create($membresiaData);

            // Desactivar membresías previas activas
            if ($membresia->estado === 'activa') {
                $this->membresiaRepository->deactivateAllExcept($data['cliente_id'], $membresia->id);
                // Marcar al socio como activo
                $this->clienteRepository->updateStatus($data['cliente_id'], 'activo');
            }

            return $membresia->load(['cliente.user', 'plan']);
        });
    }

    public function updateMembresia($id, array $data)
    {
        return DB::transaction(function () use ($id, $data) {
            $membresia = $this->membresiaRepository->find($id);
            if (!$membresia) {
                return null;
            }

            // Si cambian fechas o plan, recalculamos
            $fechaInicio = isset($data['fecha_inicio']) ? Carbon::parse($data['fecha_inicio']) : Carbon::parse($membresia->fecha_inicio);
            if (isset($data['plan_id']) && $data['plan_id'] !== $membresia->plan_id) {
                $plan = $this->planRepository->find($data['plan_id']);
                if ($plan) {
                    $data['fecha_vencimiento'] = $fechaInicio->copy()->addDays($plan->duracion_dias)->toDateString();
                }
            }

            $this->membresiaRepository->update($id, $data);
            $membresia = $this->membresiaRepository->find($id);

            if (isset($data['estado']) && $data['estado'] === 'activa') {
                $this->membresiaRepository->deactivateAllExcept($membresia->cliente_id, $membresia->id);
                $this->clienteRepository->updateStatus($membresia->cliente_id, 'activo');
            }

            return $membresia;
        });
    }

    public function deleteMembresia($id)
    {
        return $this->membresiaRepository->delete($id);
    }

    public function renovarMembresia(int $id, array $data = [])
    {
        return DB::transaction(function () use ($id, $data) {
            $membresiaAnterior = $this->membresiaRepository->find($id);
            if (!$membresiaAnterior) {
                return null;
            }

            $planId = $data['plan_id'] ?? $membresiaAnterior->plan_id;
            $plan = $this->planRepository->find($planId);
            if (!$plan) {
                return null;
            }

            // Definir fecha de inicio: hoy o el vencimiento anterior (si es a futuro)
            $hoy = Carbon::today();
            $fechaVencimientoAnterior = Carbon::parse($membresiaAnterior->fecha_vencimiento);
            $fechaInicio = $fechaVencimientoAnterior->isAfter($hoy) ? $fechaVencimientoAnterior : $hoy;

            $precio = $data['precio'] ?? $plan->precio;

            $fechaVencimiento = $fechaInicio->copy()->addDays($plan->duracion_dias);

            // Crear la nueva membresía
            $nuevaMembresia = $this->membresiaRepository->create([
                'cliente_id' => $membresiaAnterior->cliente_id,
                'plan_id' => $planId,
                'precio' => $precio,
                'fecha_inicio' => $fechaInicio->toDateString(),
                'fecha_vencimiento' => $fechaVencimiento->toDateString(),
                'estado' => 'activa',
            ]);

            // Desactivar las anteriores
            $this->membresiaRepository->deactivateAllExcept($membresiaAnterior->cliente_id, $nuevaMembresia->id);
            $this->clienteRepository->updateStatus($membresiaAnterior->cliente_id, 'activo');

            return $nuevaMembresia->load(['cliente.user', 'plan']);
        });
    }
}
