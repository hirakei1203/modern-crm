import { useEffect, useState } from 'react'
import { customerApi } from '@/api/customerApi'
import type { Customer, CustomerFilters } from '@/types/customer'

type CustomersState = {
  customers: Customer[]
  status: 'idle' | 'loading' | 'success' | 'error'
}

export function useFetchCustomers(filters: CustomerFilters) {
  const [state, setState] = useState<CustomersState>({ customers: [], status: 'idle' })

  useEffect(() => {
    let cancelled = false
    setState((prev) => ({ ...prev, status: 'loading' }))

    customerApi
      .list(filters)
      .then((response) => {
        if (!cancelled) setState({ customers: response.data, status: 'success' })
      })
      .catch(() => {
        if (!cancelled) setState({ customers: [], status: 'error' })
      })

    return () => {
      cancelled = true
    }
  }, [filters.search, filters.assigned_to])

  return state
}
