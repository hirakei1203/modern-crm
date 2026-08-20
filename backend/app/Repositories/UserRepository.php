<?php

namespace App\Repositories;

use App\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;

class UserRepository implements UserRepositoryInterface
{
    public function findByGoogleId(string $googleId): ?User
    {
        return User::where('google_id', $googleId)->first();
    }

    public function findByEmail(string $email): ?User
    {
        return User::where('email', $email)->first();
    }

    public function createFromGoogle(string $name, string $email, string $googleId, ?string $avatarUrl): User
    {
        return User::create([
            'name' => $name,
            'email' => $email,
            'email_verified_at' => now(),
            'google_id' => $googleId,
            'avatar_url' => $avatarUrl,
        ]);
    }

    public function linkGoogleAccount(User $user, string $googleId, ?string $avatarUrl): User
    {
        $user->update([
            'google_id' => $googleId,
            'avatar_url' => $avatarUrl,
        ]);

        return $user;
    }
}
