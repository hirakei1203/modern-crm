import { apiClient, ensureCsrfCookie } from './client'
import type { Customer, CustomerFilters, PaginatedResponse } from '@/types/customer'

export const customerApi = {
  list: (filters: CustomerFilters = {}) =>
    apiClient.get<PaginatedResponse<Customer>>('/customers', { params: filters }).then((res) => res.data),

  get: (id: number) => apiClient.get<{ data: Customer }>(`/customers/${id}`).then((res) => res.data.data),

  create: async (data: Partial<Customer>) => {
    await ensureCsrfCookie()
    return apiClient.post<{ data: Customer }>('/customers', data).then((res) => res.data.data)
  },

  update: async (id: number, data: Partial<Customer>) => {
    await ensureCsrfCookie()
    return apiClient.put<{ data: Customer }>(`/customers/${id}`, data).then((res) => res.data.data)
  },

  delete: async (id: number) => {
    await ensureCsrfCookie()
    await apiClient.delete(`/customers/${id}`)
  },

  updateTags: async (id: number, tagIds: number[]) => {
    await ensureCsrfCookie()
    return apiClient.put<{ data: Customer }>(`/customers/${id}`, { tag_ids: tagIds }).then((res) => res.data.data)
  },
}
