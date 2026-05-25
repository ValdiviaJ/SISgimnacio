<?php

namespace App\Services;

use App\Repositories\Contracts\RutinaRepositoryInterface;
use App\Models\User;
use App\Models\Entrenador;

class RutinaService extends BaseService
{
    protected RutinaRepositoryInterface $rutinaRepository;

    public function __construct(RutinaRepositoryInterface $rutinaRepository)
    {
        $this->rutinaRepository = $rutinaRepository;
    }

    public function getAll()
    {
        return $this->rutinaRepository->allWithTrainer();
    }

    public function getById(int $id)
    {
        return $this->rutinaRepository->find($id);
    }

    public function createRoutine(array $data, int $userId)
    {
        $user = User::findOrFail($userId);
        if ($user->role === 'entrenador') {
            $data['entrenador_id'] = $user->entrenador->id;
        } else {
            if (empty($data['entrenador_id'])) {
                $firstTrainer = Entrenador::first();
                if (!$firstTrainer) {
                    throw new \Exception("Debe existir al menos un entrenador en el sistema.");
                }
                $data['entrenador_id'] = $firstTrainer->id;
            }
        }

        return $this->rutinaRepository->create($data);
    }

    public function updateRoutine(int $id, array $data)
    {
        $this->rutinaRepository->update($id, $data);
        return $this->getById($id);
    }

    public function deleteRoutine(int $id)
    {
        return $this->rutinaRepository->delete($id);
    }

    public function assignToCliente(int $rutinaId, int $clienteId)
    {
        return $this->rutinaRepository->assignToCliente($rutinaId, $clienteId);
    }

    public function getClientRoutines(int $clienteId)
    {
        return $this->rutinaRepository->getClientRoutines($clienteId);
    }
}
