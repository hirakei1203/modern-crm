# Frontend Architecture (CRM Project)

## 1. Overall approach

- **Framework**: React 19 + TypeScript
- **Architecture**: A SPA fully decoupled from Laravel (which is API-only)
- **State management**: Zustand (simple and low learning curve for a project of this size — lighter
  than Redux Toolkit)
- **Routing**: React Router
- **Auth**: integrates with Laravel Sanctum (cookie-based SPA auth)

The design work originally assumed Vue 3's Composition API, then moved to React based on demand in
the Vancouver job market. Composition API primitives (`ref`/`computed`/`watch`) and React Hooks
(`useState`/`useMemo`/`useEffect`) map closely onto each other, so the underlying design philosophy
(directory structure, layer separation) carries over largely unchanged.

## 2. Directory structure

```
src/
├── pages/               # Route-level page components (Vue's "views")
│   ├── CustomerListPage.tsx
│   └── CustomerDetailPage.tsx
├── components/          # Reusable, small UI building blocks
│   ├── CustomerTable.tsx
│   ├── TagBadge.tsx
│   └── TaskChecklist.tsx
├── hooks/                # Reusable logic (custom hooks — analogous to Vue composables)
│   └── useFetchCustomers.ts
├── stores/               # Global state via Zustand
│   ├── customerStore.ts
│   └── authStore.ts
├── api/                  # The layer responsible for talking to the backend
│   ├── client.ts         # axios instance setup (base URL, interceptors, etc.)
│   └── customerApi.ts    # wraps requests to /api/customers
├── router/
│   └── index.tsx
└── types/                # TypeScript type definitions (kept in sync with CustomerJsonResponse on the backend)
    └── customer.ts
```

### Design philosophy (consistency with the backend)

- **pages**: the screens themselves, tied to routing
- **components**: visual building blocks, kept as free of logic as possible
- **hooks**: the unit of logic reuse — same role as Vue composables
- **api**: the single door to the backend. Components only ever call into `api/`, never worrying
  about URLs or HTTP methods directly (mirrors how a Controller only calls into a UseCase on the backend)

## 3. State management (Zustand) policy

**Belongs in global state**
- Logged-in user info (`authStore`)
- The tag list (needed by both the sidebar and the list page)

**Fine as local state (component `useState`)**
- In-progress form input values
- Modal open/closed state
- List-page filter state (if it needs to sync with URL query params, consider managing it through routing instead)

## 4. API layer

```typescript
// api/customerApi.ts
export const customerApi = {
  list: (filters: CustomerFilters) => apiClient.get('/customers', { params: filters }),
  get: (id: number) => apiClient.get(`/customers/${id}`),
  create: (data: CreateCustomerPayload) => apiClient.post('/customers', data),
  update: (id: number, data: UpdateCustomerPayload) => apiClient.put(`/customers/${id}`, data),
  delete: (id: number) => apiClient.delete(`/customers/${id}`),
}
```

- React components only call `customerApi` — the request details (URL, HTTP method) stay out of the component
- Response types are defined in `types/customer.ts` to mirror the shape of the backend's
  `CustomerJsonResponse`, keeping the frontend/backend type contract explicit

## 5. Routing

```typescript
const routes = [
  { path: '/customers', element: <CustomerListPage /> },
  { path: '/customers/:id', element: <CustomerDetailPage /> },
  { path: '/login', element: <LoginPage /> },
]
```

## 6. Auth state management

- Since Sanctum uses cookie-based auth, `authStore` (Zustand) holds whether the user is currently logged in
- React Router route guards redirect to `/login` when an unauthenticated user hits a protected route

## 7. Items to work out later (directional only — detail during Claude Code implementation)

1. **Whether to add a UI component library** — Tailwind CSS alone, or something like shadcn/ui on top
   (decide at implementation time, same as the equivalent item in `BackendArchitecture.md`)
2. **Form validation approach** — likely React Hook Form + Zod
3. **Concrete CORS/cookie settings** — to be worked out together with the "Auth (Sanctum)" item in
   `BackendArchitecture.md`
4. **Shared error-handling pattern** — e.g. a common toast pattern for API errors
5. **Whether to auto-generate types** — whether to generate TypeScript types from the Laravel API
   response shapes, or just hand-write them (likely sufficient by hand at this scale)
