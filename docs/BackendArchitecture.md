# Backend Architecture (CRM Project)

## 1. Overall approach

- **Architecture**: A fully decoupled SPA (Laravel = API only, React = frontend)
- **Auth**: Laravel Sanctum (SPA authentication, cookie-based)
- **Design principle**: Layered architecture with dependency inversion (DIP). Depending on
  interfaces rather than concrete classes keeps the code testable and easy to swap out.

## 2. Layer structure

```
Route → Controller → UseCase → Repository (simple cases)
                             → Service → Repository (logic shared across multiple UseCases)
                                              ↓
                                        Model (Eloquent) → DB
                             ↓
                     Response (formerly "Resource", formats JSON)
```

### Responsibilities

| Layer | Responsible for | Not responsible for |
|---|---|---|
| Controller | HTTP input/output, deciding which UseCase to call | Conditional logic, DB access, business rules |
| UseCase | Orchestrating a single operation (**one class per operation**) | Logic shared across multiple UseCases |
| Service | Business logic reused across multiple UseCases | HTTP/routing concerns |
| Repository | How data is fetched/stored (uses Eloquent internally) | Business decisions (e.g. how tags should be handled) |
| Model | Relationships, DB mapping (Eloquent) | Business logic |
| Response | Converting an Eloquent model into an API response | Data manipulation / business decisions |

### Dependency inversion (DIP)

- UseCases/Services depend on interfaces (e.g. `RepositoryInterface`), never on concrete classes directly
- Implementation classes (e.g. `CustomerRepository`) `implements` the interface
- `RepositoryServiceProvider` binds interfaces to implementations, so the concrete class is injected at runtime
- Benefit: easy to swap in mocks/fakes for testing, and the blast radius of future implementation
  changes (a different ORM, an external API, etc.) stays contained

## 3. Directory structure

```
app/
├── Http/
│   ├── Controllers/
│   │   └── Api/
│   │       └── CustomerController.php
│   ├── Requests/
│   │   ├── StoreCustomerRequest.php
│   │   └── UpdateCustomerRequest.php
│   └── Responses/
│       └── CustomerJsonResponse.php        # renamed from "Resource" — the name now signals it's a response formatter
├── UseCases/
│   └── Customer/
│       ├── ListCustomersUseCase.php
│       ├── GetCustomerUseCase.php
│       ├── CreateCustomerUseCase.php
│       ├── UpdateCustomerUseCase.php
│       └── DeleteCustomerUseCase.php
├── Services/
│   ├── Contracts/
│   │   └── TagAssignmentServiceInterface.php
│   └── TagAssignmentService.php
├── Repositories/
│   ├── Contracts/
│   │   └── CustomerRepositoryInterface.php
│   └── CustomerRepository.php              # kept simple; uses Eloquent internally
├── Models/
│   └── Customer.php
├── Exceptions/
│   └── CustomerNotFoundException.php
└── Providers/
    └── RepositoryServiceProvider.php
```

The same pattern (`UseCases/{Object}`, `Repositories/Contracts`, `Http/Responses`) is applied to the
other objects (Tag, Task, ContactHistory, CustomerLink).

## 4. Naming conventions

- **Repository implementation class**: no `Eloquent` prefix — kept simple as `CustomerRepository`,
  since this project doesn't anticipate needing multiple implementations. Internally, it makes full
  use of Eloquent (relationships, eager loading, the query builder).
- **UseCase**: one class per operation, named `{Verb}{Object}UseCase` (e.g. `CreateCustomerUseCase`,
  `UpdateCustomerUseCase`), with a shared `execute()` method as the common interface.
- **Response**: extends Laravel's `JsonResource`, but named `{Object}JsonResponse` so the name itself
  signals "this is a response formatter" (e.g. `CustomerJsonResponse`).

## 5. Sample implementation (using Customer as an example)

### Controller

```php
class CustomerController extends Controller
{
    public function index(IndexCustomerRequest $request, ListCustomersUseCase $useCase): AnonymousResourceCollection
    {
        $customers = $useCase->execute($request->validated());
        return CustomerJsonResponse::collection($customers);
    }

    public function show(int $id, GetCustomerUseCase $useCase): CustomerJsonResponse
    {
        return new CustomerJsonResponse($useCase->execute($id));
    }

    public function store(StoreCustomerRequest $request, CreateCustomerUseCase $useCase): CustomerJsonResponse
    {
        return new CustomerJsonResponse($useCase->execute($request->validated()));
    }

    public function update(UpdateCustomerRequest $request, int $id, UpdateCustomerUseCase $useCase): CustomerJsonResponse
    {
        return new CustomerJsonResponse($useCase->execute($id, $request->validated()));
    }

    public function destroy(int $id, DeleteCustomerUseCase $useCase): JsonResponse
    {
        $useCase->execute($id);
        return response()->json(status: 204);
    }
}
```

### UseCase (CreateCustomerUseCase as an example)

```php
class CreateCustomerUseCase
{
    public function __construct(
        private CustomerRepositoryInterface $repository,
        private TagAssignmentServiceInterface $tagAssignmentService
    ) {}

    public function execute(array $data): Customer
    {
        $tagIds = $data['tag_ids'] ?? [];
        unset($data['tag_ids']);

        $customer = $this->repository->create($data);

        if (!empty($tagIds)) {
            $this->tagAssignmentService->assignTags($customer, $tagIds);
        }

        return $customer;
    }
}
```

### Service (an example of logic shared across UseCases)

```php
interface TagAssignmentServiceInterface
{
    public function assignTags(Customer $customer, array $tagIds): void;
}

class TagAssignmentService implements TagAssignmentServiceInterface
{
    public function __construct(
        private CustomerRepositoryInterface $repository
    ) {}

    public function assignTags(Customer $customer, array $tagIds): void
    {
        $this->repository->syncTags($customer, $tagIds);
    }
}
```

`TagAssignmentService` is intended to be used by both `CreateCustomerUseCase` and
`UpdateCustomerUseCase` — a concrete example of the rule "if logic is reused across multiple
UseCases, extract it into a Service."

### Repository

```php
interface CustomerRepositoryInterface
{
    public function find(int $id): ?Customer;
    public function paginate(array $filters): LengthAwarePaginator;
    public function create(array $data): Customer;
    public function update(Customer $customer, array $data): Customer;
    public function delete(Customer $customer): void;
    public function syncTags(Customer $customer, array $tagIds): void;
}

class CustomerRepository implements CustomerRepositoryInterface
{
    public function find(int $id): ?Customer
    {
        return Customer::with(['tags', 'assignedUser'])->find($id);
    }

    public function paginate(array $filters): LengthAwarePaginator
    {
        return Customer::query()
            ->when($filters['tag_id'] ?? null, fn ($q, $tagId) =>
                $q->whereHas('tags', fn ($q) => $q->where('tags.id', $tagId))
            )
            ->when($filters['assigned_to'] ?? null, fn ($q, $userId) =>
                $q->where('assigned_to', $userId)
            )
            ->when($filters['search'] ?? null, fn ($q, $search) =>
                $q->where(fn ($q) => $q
                    ->where('name', 'like', "%{$search}%")
                    ->orWhere('company', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                )
            )
            ->with(['tags', 'assignedUser'])
            ->latest('updated_at')
            ->paginate(20);
    }

    public function create(array $data): Customer
    {
        return Customer::create($data);
    }

    public function update(Customer $customer, array $data): Customer
    {
        $customer->update($data);
        return $customer;
    }

    public function delete(Customer $customer): void
    {
        $customer->delete();
    }

    public function syncTags(Customer $customer, array $tagIds): void
    {
        $customer->tags()->sync($tagIds);
    }
}
```

### ServiceProvider (DI bindings)

```php
class RepositoryServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(CustomerRepositoryInterface::class, CustomerRepository::class);
        $this->app->bind(TagAssignmentServiceInterface::class, TagAssignmentService::class);
    }
}
```

## 6. Items to work out later (directional only — detail during Claude Code implementation)

1. **Exception handling policy**
   - Custom exceptions such as `CustomerNotFoundException` live under `app/Exceptions/`
   - The mapping to HTTP status codes is centralized in `app/Exceptions/Handler.php`
     (or the exception-handling config in `bootstrap/app.php`)

2. **Testing strategy**
   - UseCase unit tests mock `RepositoryInterface` so they don't depend on the DB
   - Only Repository-layer tests hit an actual DB (e.g. an in-memory SQLite instance)
   - This is where the architecture's biggest payoff shows up, so it's worth writing solid tests
     here as interview talking points

3. **Frontend (React) architecture**
   - A separate directory-structure policy for components / hooks / stores / api-client
   - Aim for consistency with the backend's layering philosophy where it makes sense

4. **Auth (Sanctum)**
   - Cookie-based SPA auth configuration
   - CORS configuration (frontend and backend running on different origins)

5. **Common API design rules**
   - Consistent response shapes (pagination format, error response format)
   - Whether API versioning is needed (likely unnecessary at this scale)

6. **Docker setup overview**
   - Anticipated service split: app (PHP-FPM), nginx, mysql, node/vite (frontend dev)
   - `docker-compose.yml` will be built from scratch, partly as a learning exercise

7. **CI/CD (GitHub Actions) policy**
   - When tests run (e.g. on PR creation)
   - Whether to add linting (Laravel Pint, ESLint, etc.)
