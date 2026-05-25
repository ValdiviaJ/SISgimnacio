<?php

namespace App\Repositories\Contracts;

interface AsistenciaRepositoryInterface extends RepositoryInterface
{
    public function getTodayAsistencias();
    public function getLatestActiveCheckIn(int $clienteId);
}
