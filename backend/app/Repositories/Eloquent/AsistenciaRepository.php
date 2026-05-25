<?php

namespace App\Repositories\Eloquent;

use App\Models\Asistencia;
use App\Repositories\Contracts\AsistenciaRepositoryInterface;
use Carbon\Carbon;

class AsistenciaRepository extends BaseRepository implements AsistenciaRepositoryInterface
{
    public function __construct(Asistencia $model)
    {
        parent::__construct($model);
    }

    public function getTodayAsistencias()
    {
        return Asistencia::with(['cliente.user'])
            ->whereDate('check_in', Carbon::today())
            ->latest('check_in')
            ->get();
    }

    public function getLatestActiveCheckIn(int $clienteId)
    {
        return Asistencia::where('cliente_id', $clienteId)
            ->whereDate('check_in', Carbon::today())
            ->whereNull('check_out')
            ->latest('check_in')
            ->first();
    }
}
