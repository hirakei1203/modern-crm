import { useAuthStore } from '@/stores/authStore'

export function DashboardPage() {
  const user = useAuthStore((state) => state.user)

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">ダッシュボード</h1>
      <p className="mt-2 text-muted-foreground">ようこそ、{user?.name}さん。</p>
    </div>
  )
}
