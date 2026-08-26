import { useCallback, useEffect, useState } from 'react'
import { customerLinkApi } from '@/api/customerLinkApi'
import type { CustomerLink } from '@/types/customerLink'

type CustomerLinkState = {
  customerLinks: CustomerLink[]
  status: 'idle' | 'loading' | 'success' | 'error'
}

export function useFetchCustomerLinks(customerId: number) {
  const [state, setState] = useState<CustomerLinkState>({ customerLinks: [], status: 'idle' })

  const refetch = useCallback(() => {
    setState((s) => ({ customerLinks: s.customerLinks, status: 'loading' }))

    return customerLinkApi
      .list(customerId)
      .then((customerLinks) => setState({ customerLinks, status: 'success' }))
      .catch(() => setState({ customerLinks: [], status: 'error' }))
  }, [customerId])

  useEffect(() => {
    let cancelled = false
    setState({ customerLinks: [], status: 'loading' })

    customerLinkApi
      .list(customerId)
      .then((customerLinks) => {
        if (!cancelled) setState({ customerLinks, status: 'success' })
      })
      .catch(() => {
        if (!cancelled) setState({ customerLinks: [], status: 'error' })
      })

    return () => {
      cancelled = true
    }
  }, [customerId])

  return { ...state, refetch }
}
