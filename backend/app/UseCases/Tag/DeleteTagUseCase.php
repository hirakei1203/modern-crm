<?php

namespace App\UseCases\Tag;

use App\Exceptions\TagNotFoundException;
use App\Repositories\Contracts\TagRepositoryInterface;

class DeleteTagUseCase
{
    public function __construct(
        private TagRepositoryInterface $repository
    ) {}

    public function execute(int $id): void
    {
        $tag = $this->repository->find($id);

        if (! $tag) {
            throw new TagNotFoundException($id);
        }

        $this->repository->delete($tag);
    }
}
