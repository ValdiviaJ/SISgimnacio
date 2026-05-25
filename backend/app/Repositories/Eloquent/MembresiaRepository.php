<?php

namespace App\Repositories\Eloquent;

use App\Models\Membresia;
use App\Repositories\Contracts\MembresiaRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

class MembresiaRepository extends BaseRepository implements MembresiaRepositoryInterface
{
    public function __construct(Membresia $model)
    {
        parent::__construct($model);
    }

    public function all(array $columns = ['*']): Collection
    {
        return Membresia::with(['cliente.user', 'plan'])->latest()->get();
    }

    public function find($id, array $columns = ['*']): ?Model
    {
        return Membresia::with(['cliente.user', 'plan'])->find($id);
    }

    public function getByClienteId(int $clienteId)
    {
        return Membresia::where('cliente_id', $clienteId)->latest()->get();
    }

    public function deactivateAllExcept(int $clienteId, int $activeMembresiaId)
    {
        Membresia::where('cliente_id', $clienteId)
            ->where('id', '!=', $activeMembresiaId)
            ->where('estado', 'activa')
            ->update(['estado' => 'vencida']);
    }
}
