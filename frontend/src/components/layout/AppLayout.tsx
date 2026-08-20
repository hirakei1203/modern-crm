import { Outlet } from 'react-router-dom'
import { AppSidebar } from './AppSidebar'

export function AppLayout() {
  return (
    <div className="flex min-h-svh">
      <AppSidebar />
      <main className="flex-1 overflow-auto p-8">
        <Outlet />
      </main>
    </div>
  )
}
