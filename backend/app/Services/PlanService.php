<?php

namespace App\Services;

use App\Repositories\Contracts\PlanRepositoryInterface;

class PlanService extends BaseService
{
    protected PlanRepositoryInterface $planRepository;

    public function __construct(PlanRepositoryInterface $planRepository)
    {
        $this->planRepository = $planRepository;
    }

    public function getAllPlans()
    {
        return $this->planRepository->all();
    }

    public function getPlanById($id)
    {
        return $this->planRepository->find($id);
    }

    public function createPlan(array $data)
    {
        return $this->planRepository->create($data);
    }

    public function updatePlan($id, array $data)
    {
        return $this->planRepository->update($id, $data);
    }

    public function deletePlan($id)
    {
        return $this->planRepository->delete($id);
    }
}
