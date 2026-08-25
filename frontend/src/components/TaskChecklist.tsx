import { useRef, useState } from 'react'
import { Plus, X } from 'lucide-react'
import { taskApi } from '@/api/taskApi'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { Task } from '@/types/task'

export function TaskChecklist({
  customerId,
  tasks,
  onChange,
}: {
  customerId: number
  tasks: Task[]
  onChange: () => void
}) {
  const [adding, setAdding] = useState(false)
  const [title, setTitle] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const startAdding = () => {
    setAdding(true)
    setTitle('')
    requestAnimationFrame(() => inputRef.current?.focus())
  }

  const cancelAdding = () => {
    setAdding(false)
    setTitle('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed || submitting) return

    setSubmitting(true)
    try {
      await taskApi.create(customerId, { title: trimmed })
      onChange()
      setTitle('')
      requestAnimationFrame(() => inputRef.current?.focus())
    } finally {
      setSubmitting(false)
    }
  }

  const handleToggle = async (task: Task, isDone: boolean) => {
    await taskApi.update(task.id, { is_done: isDone })
    onChange()
  }

  const handleDelete = async (task: Task) => {
    await taskApi.delete(task.id)
    onChange()
  }

  return (
    <div className="space-y-1">
      {tasks.length === 0 && !adding && <p className="text-sm text-muted-foreground">No tasks yet.</p>}

      {tasks.map((task) => (
        <div key={task.id} className="group flex items-center gap-2 rounded-md px-1 py-1.5 hover:bg-accent/50">
          <Checkbox
            checked={task.is_done}
            onCheckedChange={(checked) => handleToggle(task, checked === true)}
          />
          <span
            className={cn(
              'flex-1 text-sm',
              task.is_done && 'text-muted-foreground line-through'
            )}
          >
            {task.title}
          </span>
          {task.due_date && <span className="text-xs text-muted-foreground">{task.due_date}</span>}
          <button
            type="button"
            onClick={() => handleDelete(task)}
            className="hidden text-muted-foreground hover:text-destructive group-hover:block"
            aria-label="Delete task"
          >
            <X className="size-3.5" />
          </button>
        </div>
      ))}

      {adding ? (
        <form onSubmit={handleSubmit} className="flex items-center gap-2 px-1 py-1">
          <Input
            ref={inputRef}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') cancelAdding()
              if (e.key === 'Enter') {
                e.preventDefault()
                e.currentTarget.form?.requestSubmit()
              }
            }}
            onBlur={() => {
              if (!title.trim()) cancelAdding()
            }}
            placeholder="Task title"
            disabled={submitting}
            className="h-8"
          />
        </form>
      ) : (
        <Button variant="ghost" size="sm" onClick={startAdding} className="text-muted-foreground">
          <Plus />
          Add
        </Button>
      )}
    </div>
  )
}
