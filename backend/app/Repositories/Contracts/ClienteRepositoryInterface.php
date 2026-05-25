<?php

namespace App\Repositories\Contracts;

interface ClienteRepositoryInterface extends RepositoryInterface
{
    public function updateStatus($id, $status);
}
