import { createBrowserRouter } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'
import { AppLayout } from '@/components/layout/AppLayout'
import { LoginPage } from '@/pages/LoginPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { CustomerListPage } from '@/pages/CustomerListPage'
import { CustomerDetailPage } from '@/pages/CustomerDetailPage'

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: '/', element: <DashboardPage /> },
          { path: '/customers', element: <CustomerListPage /> },
          { path: '/customers/:id', element: <CustomerDetailPage /> },
        ],
      },
    ],
  },
])
