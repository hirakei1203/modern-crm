<?php

namespace Tests\Unit\UseCases\Customer;

use App\Exceptions\CustomerNotFoundException;
use App\Models\Customer;
use App\Repositories\Contracts\CustomerRepositoryInterface;
use App\UseCases\Customer\GetCustomerUseCase;
use Mockery;
use PHPUnit\Framework\TestCase;

class GetCustomerUseCaseTest extends TestCase
{
    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    public function test_it_returns_the_customer_when_found(): void
    {
        $customer = new Customer(['name' => 'Jane Doe']);

        $repository = Mockery::mock(CustomerRepositoryInterface::class);
        $repository->shouldReceive('find')->with(1)->once()->andReturn($customer);

        $useCase = new GetCustomerUseCase($repository);

        $this->assertSame($customer, $useCase->execute(1));
    }

    public function test_it_throws_when_not_found(): void
    {
        $repository = Mockery::mock(CustomerRepositoryInterface::class);
        $repository->shouldReceive('find')->with(999)->once()->andReturnNull();

        $useCase = new GetCustomerUseCase($repository);

        $this->expectException(CustomerNotFoundException::class);

        $useCase->execute(999);
    }
}
