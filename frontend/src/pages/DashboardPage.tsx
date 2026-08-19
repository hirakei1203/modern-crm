import { useAuthStore } from '@/stores/authStore'

export function DashboardPage() {
  const user = useAuthStore((state) => state.user)

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      <p className="mt-2 text-muted-foreground">Welcome back, {user?.name}.</p>
    </div>
  )
}
