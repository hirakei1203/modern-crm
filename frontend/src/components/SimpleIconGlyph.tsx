import type { SimpleIcon } from 'simple-icons'

export function SimpleIconGlyph({ icon, className }: { icon: SimpleIcon; className?: string }) {
  return (
    <svg role="img" viewBox="0 0 24 24" className={className} fill="currentColor">
      <title>{icon.title}</title>
      <path d={icon.path} />
    </svg>
  )
}
