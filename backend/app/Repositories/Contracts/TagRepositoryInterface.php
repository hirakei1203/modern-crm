<?php

namespace App\Repositories\Contracts;

use App\Models\Tag;
use Illuminate\Database\Eloquent\Collection;

interface TagRepositoryInterface
{
    public function find(int $id): ?Tag;

    public function list(): Collection;

    public function create(array $data): Tag;

    public function update(Tag $tag, array $data): Tag;

    public function delete(Tag $tag): void;
}
