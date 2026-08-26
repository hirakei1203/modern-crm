import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MoreHorizontal } from 'lucide-react'
import { customerApi } from '@/api/customerApi'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import type { Customer } from '@/types/customer'

export function CustomerTable({ customers, onDeleted }: { customers: Customer[]; onDeleted: () => void }) {
  const [pendingDelete, setPendingDelete] = useState<Customer | null>(null)
  const [deleting, setDeleting] = useState(false)

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return

    setDeleting(true)
    try {
      await customerApi.delete(pendingDelete.id)
      setPendingDelete(null)
      onDeleted()
    } finally {
      setDeleting(false)
    }
  }

  if (customers.length === 0) {
    return <p className="mt-8 text-sm text-muted-foreground">No customers found.</p>
  }

  return (
    <>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b text-left text-muted-foreground">
            <th className="py-2 pr-4 font-medium">Name</th>
            <th className="py-2 pr-4 font-medium">Company</th>
            <th className="py-2 pr-4 font-medium">Email</th>
            <th className="py-2 pr-4 font-medium">Assignee</th>
            <th className="w-10 py-2" />
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id} className="border-b last:border-0 hover:bg-muted/50">
              <td className="py-3 pr-4">
                <Link to={`/customers/${customer.id}`} className="font-medium hover:underline">
                  {customer.name}
                </Link>
              </td>
              <td className="py-3 pr-4 text-muted-foreground">{customer.company ?? '—'}</td>
              <td className="py-3 pr-4 text-muted-foreground">{customer.email ?? '—'}</td>
              <td className="py-3 pr-4">
                {customer.assignee ? (
                  <div className="flex items-center gap-2">
                    <Avatar size="sm">
                      <AvatarImage src={customer.assignee.avatar_url ?? undefined} alt={customer.assignee.name} />
                      <AvatarFallback>{customer.assignee.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-muted-foreground">{customer.assignee.name}</span>
                  </div>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </td>
              <td className="py-3 pl-2 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-sm">
                      <MoreHorizontal />
                      <span className="sr-only">Customer actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem variant="destructive" onClick={() => setPendingDelete(customer)}>
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <AlertDialog open={pendingDelete !== null} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete customer?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {pendingDelete?.name}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              disabled={deleting}
              onClick={handleConfirmDelete}
            >
              {deleting ? 'Deleting…' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
