import type { PromoFx } from '@/lib/types'

interface CVDiscBadgeProps {
  pct: number
  fx: PromoFx
  urgent?: boolean
}

export default function CVDiscBadge({ pct, fx, urgent }: CVDiscBadgeProps) {
  if (!fx.badges || !pct) return null
  return (
    <div
      className={`inline-flex items-baseline gap-0.5 px-1.5 py-0.5 rounded text-[11px] font-bold tracking-wide leading-none font-sans ${urgent && fx.pulse ? 'animate-cv-pulse' : ''}`}
      style={{ background: 'var(--cv-sale-bg)', color: 'var(--cv-sale-ink)' }}
    >
      <span className="text-[9px] font-semibold">−</span>
      {pct}
      <span className="text-[9px] font-semibold ml-px">%</span>
    </div>
  )
}
