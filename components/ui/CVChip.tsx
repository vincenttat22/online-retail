'use client'

interface CVChipProps {
  children: React.ReactNode
  active?: boolean
  onClick?: () => void
}

export default function CVChip({ children, active, onClick }: CVChipProps) {
  return (
    <button
      onClick={onClick}
      className="shrink-0 px-3.5 py-2 rounded-full text-[13px] font-medium tracking-wide cursor-pointer transition-all duration-150"
      style={{
        background: active ? 'var(--cv-chip-bg)' : 'transparent',
        color: active ? 'var(--cv-chip-ink)' : 'var(--cv-ink-soft)',
        border: active ? 'none' : '1px solid var(--cv-line)',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </button>
  )
}
