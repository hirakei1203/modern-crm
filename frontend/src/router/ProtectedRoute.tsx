import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'

export function ProtectedRoute() {
  const status = useAuthStore((state) => state.status)

  if (status === 'idle' || status === 'loading') {
    return <div className="flex min-h-svh items-center justify-center text-muted-foreground">Loading...</div>
  }

  if (status === 'guest') {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
