<?php

namespace App\Repositories\Contracts;

interface EntrenadorRepositoryInterface extends RepositoryInterface
{
    public function allWithDetails();
    public function getDetails(int $id);
}
