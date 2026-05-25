<?php

namespace App\Repositories\Contracts;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

interface RepositoryInterface
{
    public function all(array $columns = ['*']): Collection;

    public function find($id, array $columns = ['*']): ?Model;

    public function findOrFail($id, array $columns = ['*']): Model;

    public function create(array $data): Model;

    public function update($id, array $data): bool;

    public function delete($id): bool;
}
