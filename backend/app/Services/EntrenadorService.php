<?php

namespace App\Services;

use App\Repositories\Contracts\EntrenadorRepositoryInterface;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class EntrenadorService extends BaseService
{
    protected EntrenadorRepositoryInterface $entrenadorRepository;

    public function __construct(EntrenadorRepositoryInterface $entrenadorRepository)
    {
        $this->entrenadorRepository = $entrenadorRepository;
    }

    public function getAll()
    {
        return $this->entrenadorRepository->allWithDetails();
    }

    public function getById(int $id)
    {
        return $this->entrenadorRepository->getDetails($id);
    }

    public function createTrainer(array $data)
    {
        return DB::transaction(function () use ($data) {
            // Create user first
            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
                'role' => 'entrenador',
            ]);

            // Create trainer profile
            $trainer = $this->entrenadorRepository->create([
                'user_id' => $user->id,
                'especialidad' => $data['especialidad'] ?? null,
                'horario' => $data['horario'] ?? null,
            ]);

            return $trainer->load('user');
        });
    }

    public function updateTrainer(int $id, array $data)
    {
        return DB::transaction(function () use ($id, $data) {
            $trainer = $this->entrenadorRepository->find($id);
            if (!$trainer) {
                return null;
            }

            // Update user details
            $userData = [
                'name' => $data['name'],
                'email' => $data['email'],
            ];

            if (!empty($data['password'])) {
                $userData['password'] = Hash::make($data['password']);
            }

            $trainer->user->update($userData);

            // Update trainer profile details
            $trainerData = [
                'especialidad' => $data['especialidad'] ?? null,
                'horario' => $data['horario'] ?? null,
            ];

            $this->entrenadorRepository->update($id, $trainerData);

            return $this->getById($id);
        });
    }

    public function deleteTrainer(int $id)
    {
        $trainer = $this->entrenadorRepository->find($id);
        if (!$trainer) {
            return false;
        }

        // Delete user (which cascades to entrenador profile)
        return $trainer->user->delete();
    }
}
