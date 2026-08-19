import { Link } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { Customer } from '@/types/customer'

export function CustomerTable({ customers }: { customers: Customer[] }) {
  if (customers.length === 0) {
    return <p className="mt-8 text-sm text-muted-foreground">No customers found.</p>
  }

  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr className="border-b text-left text-muted-foreground">
          <th className="py-2 pr-4 font-medium">Name</th>
          <th className="py-2 pr-4 font-medium">Company</th>
          <th className="py-2 pr-4 font-medium">Email</th>
          <th className="py-2 pr-4 font-medium">Assignee</th>
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
          </tr>
        ))}
      </tbody>
    </table>
  )
}
