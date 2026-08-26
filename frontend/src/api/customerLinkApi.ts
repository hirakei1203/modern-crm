import { apiClient, ensureCsrfCookie } from './client'
import type { CustomerLink, CustomerLinkIconType } from '@/types/customerLink'

export const customerLinkApi = {
  list: (customerId: number) =>
    apiClient.get<{ data: CustomerLink[] }>(`/customers/${customerId}/links`).then((res) => res.data.data),

  create: async (customerId: number, data: { label: string; url: string; icon_type: CustomerLinkIconType }) => {
    await ensureCsrfCookie()
    return apiClient.post<{ data: CustomerLink }>(`/customers/${customerId}/links`, data).then((res) => res.data.data)
  },

  update: async (id: number, data: Partial<Pick<CustomerLink, 'label' | 'url' | 'icon_type'>>) => {
    await ensureCsrfCookie()
    return apiClient.put<{ data: CustomerLink }>(`/links/${id}`, data).then((res) => res.data.data)
  },

  delete: async (id: number) => {
    await ensureCsrfCookie()
    await apiClient.delete(`/links/${id}`)
  },
}
