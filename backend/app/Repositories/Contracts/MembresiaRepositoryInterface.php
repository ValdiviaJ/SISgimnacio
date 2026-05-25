<?php

namespace App\Repositories\Contracts;

interface MembresiaRepositoryInterface extends RepositoryInterface
{
    public function getByClienteId(int $clienteId);
    public function deactivateAllExcept(int $clienteId, int $activeMembresiaId);
}
