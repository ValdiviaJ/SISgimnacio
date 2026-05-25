<?php

namespace App\Repositories\Eloquent;

use App\Models\Cliente;
use App\Models\User;
use App\Repositories\Contracts\ClienteRepositoryInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

class ClienteRepository extends BaseRepository implements ClienteRepositoryInterface
{
    public function __construct(Cliente $model)
    {
        parent::__construct($model);
    }

    /**
     * Retrieve all clients with their related user and trainer info.
     */
    public function all(array $columns = ['*']): Collection
    {
        return Cliente::with(['user', 'entrenador.user'])->latest()->get();
    }

    /**
     * Find a specific client by ID with all relations.
     */
    public function find($id, array $columns = ['*']): ?Model
    {
        return Cliente::with(['user', 'entrenador.user', 'memberships', 'asistencias', 'pagos', 'rutinas'])->find($id);
    }

    /**
     * Create a new client and its corresponding user account.
     */
    public function create(array $data): Model
    {
        return DB::transaction(function () use ($data) {
            // Create user account first
            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make($data['password'] ?? 'FitFlow123'),
                'role' => 'cliente'
            ]);

            // Create client profile linked to the user
            return Cliente::create([
                'user_id' => $user->id,
                'entrenador_id' => $data['entrenador_id'] ?? null,
                'telefono' => $data['telefono'] ?? null,
                'direccion' => $data['direccion'] ?? null,
                'fecha_nacimiento' => $data['fecha_nacimiento'] ?? null,
                'genero' => $data['genero'] ?? null,
                'foto_perfil' => $data['foto_perfil'] ?? null,
                'estado' => $data['estado'] ?? 'activo',
                'observaciones' => $data['observaciones'] ?? null,
            ]);
        });
    }

    /**
     * Update an existing client and its linked user account.
     */
    public function update($id, array $data): bool
    {
        return DB::transaction(function () use ($id, $data) {
            $cliente = Cliente::findOrFail($id);
            $user = $cliente->user;

            // Update user details
            $user->update(array_filter([
                'name' => $data['name'] ?? null,
                'email' => $data['email'] ?? null,
                'password' => isset($data['password']) ? Hash::make($data['password']) : null,
            ]));

            // Update client details
            $cliente->update([
                'entrenador_id' => $data['entrenador_id'] ?? $cliente->entrenador_id,
                'telefono' => $data['telefono'] ?? $cliente->telefono,
                'direccion' => $data['direccion'] ?? $cliente->direccion,
                'fecha_nacimiento' => $data['fecha_nacimiento'] ?? $cliente->fecha_nacimiento,
                'genero' => $data['genero'] ?? $cliente->genero,
                'foto_perfil' => $data['foto_perfil'] ?? $cliente->foto_perfil,
                'estado' => $data['estado'] ?? $cliente->estado,
                'observaciones' => $data['observaciones'] ?? $cliente->observaciones,
            ]);

            return true;
        });
    }

    /**
     * Delete a client and its associated user account.
     */
    public function delete($id): bool
    {
        return DB::transaction(function () use ($id) {
            $cliente = Cliente::findOrFail($id);
            $user = $cliente->user;

            $cliente->delete();
            if ($user) {
                $user->delete();
            }

            return true;
        });
    }

    /**
     * Update client status.
     */
    public function updateStatus($id, $status)
    {
        $cliente = Cliente::findOrFail($id);
        $cliente->update(['estado' => $status]);
        return $cliente;
    }
}
