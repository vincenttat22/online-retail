'use client'

import type { Product } from '@/lib/types'
import type { PromoFx } from '@/lib/types'
import type { PlaceholderTone } from '@/lib/tokens'
import CVPlaceholder from './CVPlaceholder'
import CVDiscBadge from './CVDiscBadge'
import CVPriceTag from './CVPriceTag'
import CVIcon from './CVIcon'

interface CVProductCardProps {
  p: Product
  fx: PromoFx
  tone?: PlaceholderTone
  onClick?: () => void
}

export default function CVProductCard({ p, fx, tone = 'a', onClick }: CVProductCardProps) {
  const showRibbon = fx.ribbon && p.disc >= 20

  return (
    <button
      onClick={onClick}
      className="text-left p-0 border-0 rounded-[18px] overflow-hidden cursor-pointer flex flex-col transition-transform duration-150 active:scale-[0.98] w-full"
      style={{
        background: 'var(--cv-surface)',
        boxShadow: '0 1px 0 rgba(0,0,0,0.02), 0 6px 14px rgba(0,0,0,0.04)',
      }}
    >
      <div className="relative">
        <CVPlaceholder label={`${p.id < 10 ? '0' + p.id : p.id} · ${p.en}`} tone={tone} ratio={1} />

        {/* top-left chips */}
        <div className="absolute top-2 left-2 flex flex-col items-start gap-1">
          {p.disc > 0 && <CVDiscBadge pct={p.disc} fx={fx} urgent={p.disc >= 25} />}
          {p.badge && (
            <span
              className="px-1.5 py-0.5 rounded text-[10px] font-semibold tracking-wide"
              style={{
                background: 'rgba(255,255,255,0.92)',
                backdropFilter: 'blur(8px)',
                color: 'var(--cv-ink)',
              }}
            >
              {p.badge}
            </span>
          )}
        </div>

        {/* heart */}
        <div
          className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.85)', color: 'var(--cv-ink-soft)' }}
        >
          <CVIcon name="heart" size={14} />
        </div>

        {/* sale ribbon */}
        {showRibbon && (
          <div
            className="absolute font-sans text-[9px] font-bold tracking-[1.5px] text-center py-0.5"
            style={{
              top: 14,
              right: -28,
              width: 110,
              transform: 'rotate(40deg)',
              transformOrigin: 'center',
              background: 'var(--cv-accent)',
              color: 'var(--cv-accent-ink)',
            }}
          >
            SALE
          </div>
        )}
      </div>

      <div className="px-3 pt-2.5 pb-3 flex flex-col gap-1">
        <div
          className="text-[13px] font-medium leading-snug line-clamp-2"
          style={{ color: 'var(--cv-ink)' }}
        >
          {p.zh}
        </div>
        <div className="font-sans text-[10px] tracking-wide" style={{ color: 'var(--cv-ink-muted)' }}>
          {p.en}
        </div>
        <div className="mt-1 flex justify-between items-end">
          <CVPriceTag price={p.price} disc={p.disc} />
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
            style={{ background: 'var(--cv-accent)', color: 'var(--cv-accent-ink)' }}
          >
            <CVIcon name="plus" size={14} sw={2.2} />
          </div>
        </div>
      </div>
    </button>
  )
}
