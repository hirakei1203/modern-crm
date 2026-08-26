import { useState } from 'react'
import { Plus } from 'lucide-react'
import { customerApi } from '@/api/customerApi'
import { tagApi } from '@/api/tagApi'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { Tag } from '@/types/tag'

const COLOR_PALETTE = [
  '#EF4444',
  '#F97316',
  '#F59E0B',
  '#84CC16',
  '#22C55E',
  '#14B8A6',
  '#3B82F6',
  '#8B5CF6',
  '#EC4899',
  '#6B7280',
]

export function AddTagDialog({
  customerId,
  assignedTags,
  allTags,
  onTagCreated,
  onAssigned,
}: {
  customerId: number
  assignedTags: Tag[]
  allTags: Tag[]
  onTagCreated: () => void
  onAssigned: () => void
}) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [color, setColor] = useState(COLOR_PALETTE[0])
  const [submitting, setSubmitting] = useState(false)

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen)
    if (!nextOpen) {
      setSearch('')
      setColor(COLOR_PALETTE[0])
    }
  }

  const assignedIds = new Set(assignedTags.map((t) => t.id))
  const candidates = allTags.filter(
    (t) => !assignedIds.has(t.id) && t.name.toLowerCase().includes(search.trim().toLowerCase())
  )
  const hasExactMatch = allTags.some((t) => t.name.toLowerCase() === search.trim().toLowerCase())

  const assignTag = async (tagId: number) => {
    setSubmitting(true)
    try {
      await customerApi.updateTags(
        customerId,
        [...assignedTags.map((t) => t.id), tagId]
      )
      onAssigned()
      handleOpenChange(false)
    } finally {
      setSubmitting(false)
    }
  }

  const handleCreateAndAssign = async () => {
    const name = search.trim()
    if (!name || submitting) return

    setSubmitting(true)
    try {
      const newTag = await tagApi.create({ name, color })
      onTagCreated()
      await customerApi.updateTags(customerId, [...assignedTags.map((t) => t.id), newTag.id])
      onAssigned()
      handleOpenChange(false)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          <Plus />
          Add tag
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add tag</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search or create a tag…"
            autoFocus
          />

          {candidates.length > 0 && (
            <div className="max-h-48 space-y-1 overflow-y-auto">
              {candidates.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  disabled={submitting}
                  onClick={() => assignTag(tag.id)}
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-accent disabled:opacity-50"
                >
                  <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: tag.color }} />
                  {tag.name}
                </button>
              ))}
            </div>
          )}

          {search.trim() && !hasExactMatch && (
            <div className="space-y-2 border-t pt-3">
              <div className="flex flex-wrap gap-1.5">
                {COLOR_PALETTE.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    aria-label={`Choose color ${c}`}
                    className={cn(
                      'size-5 rounded-full ring-offset-2 ring-offset-background',
                      color === c && 'ring-2 ring-ring'
                    )}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
              <Button
                type="button"
                size="sm"
                disabled={submitting}
                onClick={handleCreateAndAssign}
                className="w-full"
              >
                Create "{search.trim()}"
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
