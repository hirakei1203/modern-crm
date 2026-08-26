import { useState } from 'react'
import { X } from 'lucide-react'
import { contactHistoryApi } from '@/api/contactHistoryApi'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import type { ContactHistory } from '@/types/contactHistory'

function formatTimestamp(value: string) {
  return new Date(value).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

export function ContactHistoryTimeline({
  customerId,
  contactHistories,
  onChange,
}: {
  customerId: number
  contactHistories: ContactHistory[]
  onChange: () => void
}) {
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = content.trim()
    if (!trimmed || submitting) return

    setSubmitting(true)
    try {
      await contactHistoryApi.create(customerId, { content: trimmed })
      onChange()
      setContent('')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (entry: ContactHistory) => {
    await contactHistoryApi.delete(entry.id)
    onChange()
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-2">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Log a call, email, or meeting…"
          disabled={submitting}
        />
        <div className="flex justify-end">
          <Button type="submit" size="sm" disabled={submitting || !content.trim()}>
            {submitting ? 'Posting…' : 'Post'}
          </Button>
        </div>
      </form>

      {contactHistories.length === 0 ? (
        <p className="text-sm text-muted-foreground">No contact history yet.</p>
      ) : (
        <div className="space-y-4">
          {contactHistories.map((entry) => (
            <div key={entry.id} className="group flex gap-3">
              <Avatar size="sm" className="mt-0.5">
                <AvatarImage src={entry.creator?.avatar_url ?? undefined} alt={entry.creator?.name} />
                <AvatarFallback>{entry.creator?.name.charAt(0) ?? '?'}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{entry.creator?.name ?? 'Unknown'}</span>
                  <span className="text-xs text-muted-foreground">{formatTimestamp(entry.created_at)}</span>
                  <button
                    type="button"
                    onClick={() => handleDelete(entry)}
                    className="ml-auto hidden text-muted-foreground hover:text-destructive group-hover:block"
                    aria-label="Delete entry"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
                <p className="mt-1 whitespace-pre-wrap text-sm">{entry.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
