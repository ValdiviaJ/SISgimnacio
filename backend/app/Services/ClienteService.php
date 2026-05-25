<?php

namespace App\Services;

use App\Repositories\Contracts\ClienteRepositoryInterface;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ClienteService extends BaseService
{
    protected $clienteRepository;

    public function __construct(ClienteRepositoryInterface $clienteRepository)
    {
        $this->clienteRepository = $clienteRepository;
    }

    /**
     * Retrieve all clients.
     */
    public function getAllClientes()
    {
        return $this->clienteRepository->all();
    }

    /**
     * Retrieve a specific client details.
     */
    public function getClienteById($id)
    {
        return $this->clienteRepository->find($id);
    }

    /**
     * Handle business logic to register a client.
     */
    public function createCliente(array $data)
    {
        // Set default password if not provided
        if (empty($data['password'])) {
            $data['password'] = 'FitFlow' . Str::random(6);
        }

        // Handle profile photo upload if present
        if (isset($data['foto_perfil']) && $data['foto_perfil']->isValid()) {
            $path = $data['foto_perfil']->store('avatars', 'public');
            $data['foto_perfil'] = Storage::url($path);
        } else {
            $data['foto_perfil'] = null;
        }

        return $this->clienteRepository->create($data);
    }

    /**
     * Handle business logic to update a client.
     */
    public function updateCliente($id, array $data)
    {
        $cliente = $this->clienteRepository->find($id);
        
        // Handle new profile photo upload
        if (isset($data['foto_perfil']) && $data['foto_perfil']->isValid()) {
            // Delete old photo if exists
            if ($cliente->foto_perfil) {
                $oldPath = str_replace('/storage/', '', $cliente->foto_perfil);
                Storage::disk('public')->delete($oldPath);
            }

            $path = $data['foto_perfil']->store('avatars', 'public');
            $data['foto_perfil'] = Storage::url($path);
        } else {
            unset($data['foto_perfil']); // Don't overwrite existing photo if no new one provided
        }

        return $this->clienteRepository->update($id, $data);
    }

    /**
     * Handle deleting a client profile.
     */
    public function deleteCliente($id)
    {
        $cliente = $this->clienteRepository->find($id);
        
        // Delete profile photo
        if ($cliente && $cliente->foto_perfil) {
            $oldPath = str_replace('/storage/', '', $cliente->foto_perfil);
            Storage::disk('public')->delete($oldPath);
        }

        return $this->clienteRepository->delete($id);
    }

    /**
     * Update status.
     */
    public function updateStatus($id, $status)
    {
        return $this->clienteRepository->updateStatus($id, $status);
    }
}
