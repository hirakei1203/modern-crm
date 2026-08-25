import { Link, useParams } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ContactHistoryTimeline } from '@/components/ContactHistoryTimeline'
import { TaskChecklist } from '@/components/TaskChecklist'
import { useFetchContactHistories } from '@/hooks/useFetchContactHistories'
import { useFetchCustomer } from '@/hooks/useFetchCustomer'
import { useFetchTasks } from '@/hooks/useFetchTasks'

export function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>()
  const customerId = Number(id)
  const { customer, status } = useFetchCustomer(customerId)
  const { tasks, refetch: refetchTasks } = useFetchTasks(customerId)
  const { contactHistories, refetch: refetchContactHistories } = useFetchContactHistories(customerId)

  if (status === 'loading' || status === 'idle') {
    return null
  }

  if (status === 'error' || !customer) {
    return <p className="text-sm text-destructive">Failed to load customer.</p>
  }

  return (
    <div>
      <Link to="/customers" className="text-sm text-muted-foreground hover:underline">
        ← Back to customers
      </Link>

      <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight">{customer.name}</h1>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Contact history</CardTitle>
            </CardHeader>
            <CardContent>
              <ContactHistoryTimeline
                customerId={customerId}
                contactHistories={contactHistories}
                onChange={refetchContactHistories}
              />
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <TaskChecklist customerId={customerId} tasks={tasks} onChange={refetchTasks} />
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              {customer.memo ? (
                <p className="whitespace-pre-wrap text-sm">{customer.memo}</p>
              ) : (
                <p className="text-sm text-muted-foreground">No notes yet.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Properties</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <p className="text-muted-foreground">Email</p>
                <p className="mt-1">{customer.email ?? '—'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Company</p>
                <p className="mt-1">{customer.company ?? '—'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Assignee</p>
                {customer.assignee ? (
                  <div className="mt-1 flex items-center gap-2">
                    <Avatar size="sm">
                      <AvatarImage src={customer.assignee.avatar_url ?? undefined} alt={customer.assignee.name} />
                      <AvatarFallback>{customer.assignee.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span>{customer.assignee.name}</span>
                  </div>
                ) : (
                  <p className="mt-1">—</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
