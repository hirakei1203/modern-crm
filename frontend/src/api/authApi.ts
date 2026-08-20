import { API_URL, apiClient, ensureCsrfCookie } from './client'
import type { User } from '@/types/user'

export const googleLoginUrl = `${API_URL}/auth/google/redirect`

export const authApi = {
  me: () => apiClient.get<User>('/auth/me').then((res) => res.data),

  logout: async () => {
    await ensureCsrfCookie()
    await apiClient.post('/auth/logout')
  },
}
