<?php

namespace Tests\Unit\UseCases\Customer;

use App\Models\Customer;
use App\Repositories\Contracts\CustomerRepositoryInterface;
use App\UseCases\Customer\CreateCustomerUseCase;
use Mockery;
use PHPUnit\Framework\TestCase;

class CreateCustomerUseCaseTest extends TestCase
{
    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    public function test_it_creates_a_customer_via_the_repository(): void
    {
        $data = ['name' => 'Jane Doe', 'email' => 'jane@example.com'];
        $customer = new Customer($data);

        $repository = Mockery::mock(CustomerRepositoryInterface::class);
        $repository->shouldReceive('create')->with($data)->once()->andReturn($customer);

        $useCase = new CreateCustomerUseCase($repository);

        $this->assertSame($customer, $useCase->execute($data));
    }
}
