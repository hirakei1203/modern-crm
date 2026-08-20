import { useState } from 'react'
import { CustomerTable } from '@/components/CustomerTable'
import { useFetchCustomers } from '@/hooks/useFetchCustomers'

export function CustomerListPage() {
  const [search, setSearch] = useState('')
  const { customers, status } = useFetchCustomers({ search: search || undefined })

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Customers</h1>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name, company, or email"
        className="mt-4 w-full max-w-sm rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
      />

      {status === 'error' && <p className="mt-8 text-sm text-destructive">Failed to load customers.</p>}
      {status !== 'error' && <div className="mt-4">{status === 'loading' ? null : <CustomerTable customers={customers} />}</div>}
    </div>
  )
}
