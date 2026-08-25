import { useCallback, useEffect, useState } from 'react'
import { contactHistoryApi } from '@/api/contactHistoryApi'
import type { ContactHistory } from '@/types/contactHistory'

type ContactHistoryState = {
  contactHistories: ContactHistory[]
  status: 'idle' | 'loading' | 'success' | 'error'
}

export function useFetchContactHistories(customerId: number) {
  const [state, setState] = useState<ContactHistoryState>({ contactHistories: [], status: 'idle' })

  const refetch = useCallback(() => {
    setState((s) => ({ contactHistories: s.contactHistories, status: 'loading' }))

    return contactHistoryApi
      .list(customerId)
      .then((contactHistories) => setState({ contactHistories, status: 'success' }))
      .catch(() => setState({ contactHistories: [], status: 'error' }))
  }, [customerId])

  useEffect(() => {
    let cancelled = false
    setState({ contactHistories: [], status: 'loading' })

    contactHistoryApi
      .list(customerId)
      .then((contactHistories) => {
        if (!cancelled) setState({ contactHistories, status: 'success' })
      })
      .catch(() => {
        if (!cancelled) setState({ contactHistories: [], status: 'error' })
      })

    return () => {
      cancelled = true
    }
  }, [customerId])

  return { ...state, refetch }
}
