import { useCallback, useEffect, useState } from 'react'
import { customerApi } from '@/api/customerApi'
import type { Customer, CustomerFilters } from '@/types/customer'

type CustomersState = {
  customers: Customer[]
  status: 'idle' | 'loading' | 'success' | 'error'
}

export function useFetchCustomers(filters: CustomerFilters) {
  const [state, setState] = useState<CustomersState>({ customers: [], status: 'idle' })

  const refetch = useCallback(() => {
    setState((prev) => ({ ...prev, status: 'loading' }))

    return customerApi
      .list(filters)
      .then((response) => {
        setState({ customers: response.data, status: 'success' })
      })
      .catch(() => {
        setState({ customers: [], status: 'error' })
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.search, filters.assigned_to])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { ...state, refetch }
}
