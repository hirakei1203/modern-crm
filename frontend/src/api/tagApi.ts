import { apiClient, ensureCsrfCookie } from './client'
import type { Tag } from '@/types/tag'

export const tagApi = {
  list: () => apiClient.get<{ data: Tag[] }>('/tags').then((res) => res.data.data),

  create: async (data: { name: string; color: string }) => {
    await ensureCsrfCookie()
    return apiClient.post<{ data: Tag }>('/tags', data).then((res) => res.data.data)
  },
}
