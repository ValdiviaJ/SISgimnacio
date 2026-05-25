<?php

namespace App\Repositories\Contracts;

interface RutinaRepositoryInterface extends RepositoryInterface
{
    public function allWithTrainer();
    public function getClientRoutines(int $clienteId);
    public function assignToCliente(int $rutinaId, int $clienteId);
}
