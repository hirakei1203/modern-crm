import { useCallback, useEffect, useState } from 'react'
import { tagApi } from '@/api/tagApi'
import type { Tag } from '@/types/tag'

type TagState = {
  tags: Tag[]
  status: 'idle' | 'loading' | 'success' | 'error'
}

export function useFetchTags() {
  const [state, setState] = useState<TagState>({ tags: [], status: 'idle' })

  const refetch = useCallback(() => {
    setState((s) => ({ tags: s.tags, status: 'loading' }))

    return tagApi
      .list()
      .then((tags) => setState({ tags, status: 'success' }))
      .catch(() => setState({ tags: [], status: 'error' }))
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { ...state, refetch }
}
