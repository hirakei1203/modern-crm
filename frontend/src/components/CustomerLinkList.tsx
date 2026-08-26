import { useState } from 'react'
import { ExternalLink, Link as LinkIcon, Plus, X } from 'lucide-react'
import { siGmail, siNotion } from 'simple-icons'
import { customerLinkApi } from '@/api/customerLinkApi'
import { SimpleIconGlyph } from '@/components/SimpleIconGlyph'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { CustomerLink, CustomerLinkIconType } from '@/types/customerLink'

const ICON_OPTIONS: { value: CustomerLinkIconType; label: string; render: (className: string) => React.ReactNode }[] = [
  { value: 'notion', label: 'Notion', render: (className) => <SimpleIconGlyph icon={siNotion} className={className} /> },
  { value: 'gmail', label: 'Gmail', render: (className) => <SimpleIconGlyph icon={siGmail} className={className} /> },
  { value: 'other', label: 'Other', render: (className) => <LinkIcon className={className} /> },
]

function renderIcon(iconType: CustomerLinkIconType, className: string) {
  return (ICON_OPTIONS.find((o) => o.value === iconType)?.render ?? ICON_OPTIONS[2].render)(className)
}

export function CustomerLinkList({
  customerId,
  customerLinks,
  onChange,
}: {
  customerId: number
  customerLinks: CustomerLink[]
  onChange: () => void
}) {
  const [adding, setAdding] = useState(false)
  const [label, setLabel] = useState('')
  const [url, setUrl] = useState('')
  const [iconType, setIconType] = useState<CustomerLinkIconType>('other')
  const [submitting, setSubmitting] = useState(false)

  const startAdding = () => {
    setAdding(true)
    setLabel('')
    setUrl('')
    setIconType('other')
  }

  const cancelAdding = () => {
    setAdding(false)
    setLabel('')
    setUrl('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedLabel = label.trim()
    const trimmedUrl = url.trim()
    if (!trimmedLabel || !trimmedUrl || submitting) return

    setSubmitting(true)
    try {
      await customerLinkApi.create(customerId, { label: trimmedLabel, url: trimmedUrl, icon_type: iconType })
      onChange()
      cancelAdding()
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (link: CustomerLink) => {
    await customerLinkApi.delete(link.id)
    onChange()
  }

  return (
    <div className="space-y-1">
      {customerLinks.length === 0 && !adding && <p className="text-sm text-muted-foreground">No links yet.</p>}

      {customerLinks.map((link) => (
        <div key={link.id} className="group flex items-center gap-2 rounded-md px-1 py-1.5 hover:bg-accent/50">
          {renderIcon(link.icon_type, 'size-4 shrink-0 text-muted-foreground')}
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-w-0 flex-1 items-center gap-1 truncate text-sm hover:underline"
          >
            <span className="truncate">{link.label}</span>
            <ExternalLink className="size-3 shrink-0 text-muted-foreground" />
          </a>
          <button
            type="button"
            onClick={() => handleDelete(link)}
            className="hidden text-muted-foreground hover:text-destructive group-hover:block"
            aria-label={`Remove ${link.label} link`}
          >
            <X className="size-3.5" />
          </button>
        </div>
      ))}

      {adding ? (
        <form onSubmit={handleSubmit} className="space-y-2 px-1 py-1">
          <Input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Label"
            disabled={submitting}
            className="h-8"
            autoFocus
          />
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://…"
            disabled={submitting}
            className="h-8"
          />
          <div className="flex items-center gap-1.5">
            {ICON_OPTIONS.map(({ value, label: optionLabel, render }) => (
              <button
                key={value}
                type="button"
                onClick={() => setIconType(value)}
                aria-label={optionLabel}
                className={cn(
                  'flex size-7 items-center justify-center rounded-md border text-muted-foreground',
                  iconType === value && 'border-ring bg-accent text-accent-foreground'
                )}
              >
                {render('size-3.5')}
              </button>
            ))}
            <div className="ml-auto flex gap-1.5">
              <Button type="button" variant="ghost" size="sm" onClick={cancelAdding} disabled={submitting}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={submitting || !label.trim() || !url.trim()}>
                Add
              </Button>
            </div>
          </div>
        </form>
      ) : (
        <Button variant="ghost" size="sm" onClick={startAdding} className="text-muted-foreground">
          <Plus />
          Add link
        </Button>
      )}
    </div>
  )
}
