<?php

namespace App\UseCases\Tag;

use App\Repositories\Contracts\TagRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class ListTagsUseCase
{
    public function __construct(
        private TagRepositoryInterface $repository
    ) {}

    public function execute(): Collection
    {
        return $this->repository->list();
    }
}
