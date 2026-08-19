<?php

namespace App\Repositories\Contracts;

use App\Models\User;

interface UserRepositoryInterface
{
    public function findByGoogleId(string $googleId): ?User;

    public function findByEmail(string $email): ?User;

    public function createFromGoogle(string $name, string $email, string $googleId, ?string $avatarUrl): User;

    public function linkGoogleAccount(User $user, string $googleId, ?string $avatarUrl): User;
}
