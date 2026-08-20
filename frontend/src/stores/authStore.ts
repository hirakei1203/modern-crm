import { create } from 'zustand'
import { authApi } from '@/api/authApi'
import type { User } from '@/types/user'

type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'guest'

type AuthState = {
  user: User | null
  status: AuthStatus
  fetchMe: () => Promise<void>
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  status: 'idle',

  fetchMe: async () => {
    set({ status: 'loading' })

    try {
      const user = await authApi.me()
      set({ user, status: 'authenticated' })
    } catch {
      set({ user: null, status: 'guest' })
    }
  },

  logout: async () => {
    await authApi.logout()
    set({ user: null, status: 'guest' })
  },
}))
