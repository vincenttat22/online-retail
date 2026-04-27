import CVIcon from './CVIcon'

interface CVSectionProps {
  kicker?: string
  title: string
  action?: string
  onAction?: () => void
  children: React.ReactNode
  className?: string
}

export default function CVSection({ kicker, title, action, onAction, children, className = '' }: CVSectionProps) {
  return (
    <section className={`px-4 ${className}`}>
      <header className="flex items-end justify-between mb-3">
        <div>
          {kicker && (
            <div className="font-mono text-[10px] tracking-[1.5px] uppercase mb-0.5" style={{ color: 'var(--cv-ink-muted)' }}>
              {kicker}
            </div>
          )}
          <h3 className="m-0 font-serif text-xl font-bold tracking-tight" style={{ color: 'var(--cv-ink)' }}>
            {title}
          </h3>
        </div>
        {action && (
          <button
            onClick={onAction}
            className="flex items-center gap-0.5 text-xs bg-transparent border-0 cursor-pointer"
            style={{ color: 'var(--cv-ink-soft)' }}
          >
            {action}
            <CVIcon name="chev-r" size={12} />
          </button>
        )}
      </header>
      {children}
    </section>
  )
}
