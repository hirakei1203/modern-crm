<?php

namespace Tests\Unit\UseCases\Auth;

use App\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;
use App\UseCases\Auth\LoginWithGoogleUseCase;
use Laravel\Socialite\Two\User as SocialiteUser;
use Mockery;
use PHPUnit\Framework\TestCase;

class LoginWithGoogleUseCaseTest extends TestCase
{
    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    private function googleUser(): SocialiteUser
    {
        $googleUser = new SocialiteUser;
        $googleUser->id = 'g-123';
        $googleUser->name = 'Jane Doe';
        $googleUser->email = 'jane@example.com';
        $googleUser->avatar = 'https://example.com/jane.png';

        return $googleUser;
    }

    public function test_it_returns_the_user_already_linked_to_the_google_id(): void
    {
        $existingUser = new User(['name' => 'Jane Doe', 'email' => 'jane@example.com']);

        $repository = Mockery::mock(UserRepositoryInterface::class);
        $repository->shouldReceive('findByGoogleId')->with('g-123')->once()->andReturn($existingUser);
        $repository->shouldNotReceive('findByEmail');
        $repository->shouldNotReceive('createFromGoogle');
        $repository->shouldNotReceive('linkGoogleAccount');

        $useCase = new LoginWithGoogleUseCase($repository);

        $this->assertSame($existingUser, $useCase->execute($this->googleUser()));
    }

    public function test_it_links_the_google_id_to_an_existing_user_found_by_email(): void
    {
        $existingUser = new User(['name' => 'Jane Doe', 'email' => 'jane@example.com']);
        $linkedUser = new User(['name' => 'Jane Doe', 'email' => 'jane@example.com', 'google_id' => 'g-123']);

        $repository = Mockery::mock(UserRepositoryInterface::class);
        $repository->shouldReceive('findByGoogleId')->with('g-123')->once()->andReturnNull();
        $repository->shouldReceive('findByEmail')->with('jane@example.com')->once()->andReturn($existingUser);
        $repository->shouldReceive('linkGoogleAccount')
            ->with($existingUser, 'g-123', 'https://example.com/jane.png')
            ->once()
            ->andReturn($linkedUser);
        $repository->shouldNotReceive('createFromGoogle');

        $useCase = new LoginWithGoogleUseCase($repository);

        $this->assertSame($linkedUser, $useCase->execute($this->googleUser()));
    }

    public function test_it_creates_a_new_user_when_no_match_is_found(): void
    {
        $newUser = new User(['name' => 'Jane Doe', 'email' => 'jane@example.com', 'google_id' => 'g-123']);

        $repository = Mockery::mock(UserRepositoryInterface::class);
        $repository->shouldReceive('findByGoogleId')->with('g-123')->once()->andReturnNull();
        $repository->shouldReceive('findByEmail')->with('jane@example.com')->once()->andReturnNull();
        $repository->shouldReceive('createFromGoogle')
            ->with('Jane Doe', 'jane@example.com', 'g-123', 'https://example.com/jane.png')
            ->once()
            ->andReturn($newUser);
        $repository->shouldNotReceive('linkGoogleAccount');

        $useCase = new LoginWithGoogleUseCase($repository);

        $this->assertSame($newUser, $useCase->execute($this->googleUser()));
    }
}
