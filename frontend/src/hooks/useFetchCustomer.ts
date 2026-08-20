import { useEffect, useState } from 'react'
import { customerApi } from '@/api/customerApi'
import type { Customer } from '@/types/customer'

type CustomerState = {
  customer: Customer | null
  status: 'idle' | 'loading' | 'success' | 'error'
}

export function useFetchCustomer(id: number) {
  const [state, setState] = useState<CustomerState>({ customer: null, status: 'idle' })

  useEffect(() => {
    let cancelled = false
    setState({ customer: null, status: 'loading' })

    customerApi
      .get(id)
      .then((customer) => {
        if (!cancelled) setState({ customer, status: 'success' })
      })
      .catch(() => {
        if (!cancelled) setState({ customer: null, status: 'error' })
      })

    return () => {
      cancelled = true
    }
  }, [id])

  return state
}
