import { Navigate } from 'react-router-dom'
import { googleLoginUrl } from '@/api/authApi'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { GoogleIcon } from '@/components/icons/GoogleIcon'

export function LoginPage() {
  const status = useAuthStore((state) => state.status)

  if (status === 'authenticated') {
    return <Navigate to="/" replace />
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-muted p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">CRM</CardTitle>
          <CardDescription>Sign in with your Google account</CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full" onClick={() => (window.location.href = googleLoginUrl)}>
            <GoogleIcon className="size-4" />
            Sign in with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
