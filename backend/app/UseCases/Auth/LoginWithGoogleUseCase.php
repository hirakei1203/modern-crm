<?php

namespace App\UseCases\Auth;

use App\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;
use Laravel\Socialite\Contracts\User as SocialiteUser;

class LoginWithGoogleUseCase
{
    public function __construct(
        private UserRepositoryInterface $repository
    ) {}

    public function execute(SocialiteUser $googleUser): User
    {
        $user = $this->repository->findByGoogleId($googleUser->getId());

        if ($user) {
            return $user;
        }

        $user = $this->repository->findByEmail($googleUser->getEmail());

        if ($user) {
            return $this->repository->linkGoogleAccount($user, $googleUser->getId(), $googleUser->getAvatar());
        }

        return $this->repository->createFromGoogle(
            $googleUser->getName() ?? $googleUser->getNickname() ?? $googleUser->getEmail(),
            $googleUser->getEmail(),
            $googleUser->getId(),
            $googleUser->getAvatar(),
        );
    }
}
