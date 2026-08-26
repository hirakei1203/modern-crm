import { apiClient, ensureCsrfCookie } from './client'
import type { ContactHistory } from '@/types/contactHistory'

export const contactHistoryApi = {
  list: (customerId: number) =>
    apiClient
      .get<{ data: ContactHistory[] }>(`/customers/${customerId}/contact-histories`)
      .then((res) => res.data.data),

  create: async (customerId: number, data: { content: string }) => {
    await ensureCsrfCookie()
    return apiClient
      .post<{ data: ContactHistory }>(`/customers/${customerId}/contact-histories`, data)
      .then((res) => res.data.data)
  },

  delete: async (id: number) => {
    await ensureCsrfCookie()
    await apiClient.delete(`/contact-histories/${id}`)
  },
}
