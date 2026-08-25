import { useCallback, useEffect, useState } from 'react'
import { taskApi } from '@/api/taskApi'
import type { Task } from '@/types/task'

type TaskState = {
  tasks: Task[]
  status: 'idle' | 'loading' | 'success' | 'error'
}

export function useFetchTasks(customerId: number) {
  const [state, setState] = useState<TaskState>({ tasks: [], status: 'idle' })

  const refetch = useCallback(() => {
    setState((s) => ({ tasks: s.tasks, status: 'loading' }))

    return taskApi
      .list(customerId)
      .then((tasks) => setState({ tasks, status: 'success' }))
      .catch(() => setState({ tasks: [], status: 'error' }))
  }, [customerId])

  useEffect(() => {
    let cancelled = false
    setState({ tasks: [], status: 'loading' })

    taskApi
      .list(customerId)
      .then((tasks) => {
        if (!cancelled) setState({ tasks, status: 'success' })
      })
      .catch(() => {
        if (!cancelled) setState({ tasks: [], status: 'error' })
      })

    return () => {
      cancelled = true
    }
  }, [customerId])

  return { ...state, refetch }
}
