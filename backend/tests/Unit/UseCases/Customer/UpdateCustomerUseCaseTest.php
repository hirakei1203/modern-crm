<?php

namespace Tests\Unit\UseCases\Customer;

use App\Exceptions\CustomerNotFoundException;
use App\Models\Customer;
use App\Repositories\Contracts\CustomerRepositoryInterface;
use App\UseCases\Customer\UpdateCustomerUseCase;
use Mockery;
use PHPUnit\Framework\TestCase;

class UpdateCustomerUseCaseTest extends TestCase
{
    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    public function test_it_updates_the_customer_when_found(): void
    {
        $customer = new Customer(['name' => 'Old Name']);
        $updated = new Customer(['name' => 'New Name']);
        $data = ['name' => 'New Name'];

        $repository = Mockery::mock(CustomerRepositoryInterface::class);
        $repository->shouldReceive('find')->with(1)->once()->andReturn($customer);
        $repository->shouldReceive('update')->with($customer, $data)->once()->andReturn($updated);

        $useCase = new UpdateCustomerUseCase($repository);

        $this->assertSame($updated, $useCase->execute(1, $data));
    }

    public function test_it_throws_when_not_found(): void
    {
        $repository = Mockery::mock(CustomerRepositoryInterface::class);
        $repository->shouldReceive('find')->with(999)->once()->andReturnNull();
        $repository->shouldNotReceive('update');

        $useCase = new UpdateCustomerUseCase($repository);

        $this->expectException(CustomerNotFoundException::class);

        $useCase->execute(999, ['name' => 'New Name']);
    }
}
