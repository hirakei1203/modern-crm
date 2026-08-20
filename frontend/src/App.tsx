import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from '@/router'
import { useAuthStore } from '@/stores/authStore'

function App() {
  const fetchMe = useAuthStore((state) => state.fetchMe)

  useEffect(() => {
    fetchMe()
  }, [fetchMe])

  return <RouterProvider router={router} />
}

export default App
