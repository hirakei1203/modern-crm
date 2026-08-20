<?php

namespace Tests\Unit\UseCases\Customer;

use App\Exceptions\CustomerNotFoundException;
use App\Models\Customer;
use App\Repositories\Contracts\CustomerRepositoryInterface;
use App\UseCases\Customer\DeleteCustomerUseCase;
use Mockery;
use PHPUnit\Framework\TestCase;

class DeleteCustomerUseCaseTest extends TestCase
{
    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    public function test_it_deletes_the_customer_when_found(): void
    {
        $customer = new Customer(['name' => 'Jane Doe']);

        $repository = Mockery::mock(CustomerRepositoryInterface::class);
        $repository->shouldReceive('find')->with(1)->once()->andReturn($customer);
        $repository->shouldReceive('delete')->with($customer)->once();

        $useCase = new DeleteCustomerUseCase($repository);

        $useCase->execute(1);

        $this->assertTrue(true);
    }

    public function test_it_throws_when_not_found(): void
    {
        $repository = Mockery::mock(CustomerRepositoryInterface::class);
        $repository->shouldReceive('find')->with(999)->once()->andReturnNull();
        $repository->shouldNotReceive('delete');

        $useCase = new DeleteCustomerUseCase($repository);

        $this->expectException(CustomerNotFoundException::class);

        $useCase->execute(999);
    }
}
