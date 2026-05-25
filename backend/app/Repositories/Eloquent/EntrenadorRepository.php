<?php

namespace App\Repositories\Eloquent;

use App\Models\Entrenador;
use App\Repositories\Contracts\EntrenadorRepositoryInterface;

class EntrenadorRepository extends BaseRepository implements EntrenadorRepositoryInterface
{
    public function __construct(Entrenador $model)
    {
        parent::__construct($model);
    }

    public function allWithDetails()
    {
        return Entrenador::with('user')
            ->withCount('clientes')
            ->get();
    }

    public function getDetails(int $id)
    {
        return Entrenador::with(['user', 'clientes.user'])
            ->find($id);
    }
}
