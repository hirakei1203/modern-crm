import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Tag } from '@/types/tag'

export function TagBadge({ tag, onRemove, className }: { tag: Tag; onRemove?: () => void; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium',
        className
      )}
    >
      <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: tag.color }} />
      {tag.name}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="text-muted-foreground hover:text-destructive"
          aria-label={`Remove ${tag.name} tag`}
        >
          <X className="size-3" />
        </button>
      )}
    </span>
  )
}
