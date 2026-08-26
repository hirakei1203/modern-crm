import { apiClient, ensureCsrfCookie } from './client'
import type { Task } from '@/types/task'

export const taskApi = {
  list: (customerId: number) =>
    apiClient.get<{ data: Task[] }>(`/customers/${customerId}/tasks`).then((res) => res.data.data),

  create: async (customerId: number, data: { title: string; due_date?: string | null }) => {
    await ensureCsrfCookie()
    return apiClient.post<{ data: Task }>(`/customers/${customerId}/tasks`, data).then((res) => res.data.data)
  },

  update: async (id: number, data: Partial<Pick<Task, 'title' | 'is_done' | 'due_date'>>) => {
    await ensureCsrfCookie()
    return apiClient.put<{ data: Task }>(`/tasks/${id}`, data).then((res) => res.data.data)
  },

  delete: async (id: number) => {
    await ensureCsrfCookie()
    await apiClient.delete(`/tasks/${id}`)
  },
}
