<?php

namespace App\Repositories\Eloquent;

use App\Models\Rutina;
use App\Models\Cliente;
use App\Repositories\Contracts\RutinaRepositoryInterface;
use Carbon\Carbon;

class RutinaRepository extends BaseRepository implements RutinaRepositoryInterface
{
    public function __construct(Rutina $model)
    {
        parent::__construct($model);
    }

    public function allWithTrainer()
    {
        return Rutina::with('entrenador.user')->get();
    }

    public function getClientRoutines(int $clienteId)
    {
        $cliente = Cliente::with('rutinas.entrenador.user')->find($clienteId);
        return $cliente ? $cliente->rutinas : collect();
    }

    public function assignToCliente(int $rutinaId, int $clienteId)
    {
        $cliente = Cliente::findOrFail($clienteId);
        return $cliente->rutinas()->syncWithoutDetaching([
            $rutinaId => [
                'asignado_el' => Carbon::now()->toDateString(),
                'estado' => 'activo'
            ]
        ]);
    }
}
