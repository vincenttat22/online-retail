'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTheme } from '@/context/ThemeContext'
import type { ColorTheme } from '@/lib/types'
import { CV_THEMES } from '@/lib/tokens'
import CVIcon from './CVIcon'

const THEME_OPTIONS: { value: ColorTheme; label: string }[] = [
  { value: 'bold',      label: '朱红 Bold' },
  { value: 'selective', label: '克制 Selective' },
  { value: 'neutral',   label: '素雅 Neutral' },
]

export default function SettingsPanel() {
  const [open, setOpen] = useState(false)
  const { colorTheme, setColorTheme, promoIntensity, setPromoIntensity } = useTheme()
  const searchParams = useSearchParams()
  const isAdmin = searchParams.get('tweaks') === '1'

  return (
    <>
      {/* Floating trigger — only visible to admins via ?tweaks=1 */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-24 md:bottom-8 right-4 md:right-8 z-40 w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95"
        style={{ display: isAdmin ? undefined : 'none', background: 'var(--cv-surface)', color: 'var(--cv-ink)', border: '1px solid var(--cv-line)' }}
        aria-label="Settings"
      >
        <CVIcon name="settings" size={18} />
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Bottom sheet */}
      <div
        className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 rounded-t-3xl transition-transform duration-300 ${open ? 'translate-y-0' : 'translate-y-full'}`}
        style={{ background: 'var(--cv-surface)' }}
      >
        <div className="flex justify-between items-center px-5 pt-5 pb-2">
          <div>
            <div className="font-mono text-[9px] tracking-[1.5px] uppercase" style={{ color: 'var(--cv-ink-muted)' }}>
              TWEAKS
            </div>
            <h3 className="m-0 font-serif text-lg font-bold" style={{ color: 'var(--cv-ink)' }}>
              设计调节
            </h3>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: 'var(--cv-bg)', color: 'var(--cv-ink-soft)' }}
          >
            <CVIcon name="x" size={16} />
          </button>
        </div>

        <div className="px-5 pb-10 pt-2 flex flex-col gap-5">
          {/* Color theme */}
          <div>
            <div className="text-xs font-semibold mb-2.5" style={{ color: 'var(--cv-ink-soft)' }}>
              Color Theme · 配色
            </div>
            <div className="flex gap-2">
              {THEME_OPTIONS.map((opt) => {
                const t = CV_THEMES[opt.value]
                const isActive = colorTheme === opt.value
                return (
                  <button
                    key={opt.value}
                    onClick={() => setColorTheme(opt.value)}
                    className="flex-1 py-2.5 px-1 rounded-xl text-[11px] font-semibold transition-all"
                    style={{
                      background: isActive ? t.accent : 'var(--cv-bg)',
                      color: isActive ? t.accentInk : 'var(--cv-ink-soft)',
                      border: isActive ? 'none' : '1px solid var(--cv-line)',
                    }}
                  >
                    {opt.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Promo intensity */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <div className="text-xs font-semibold" style={{ color: 'var(--cv-ink-soft)' }}>
                Promo Intensity · 促销力度
              </div>
              <div className="font-mono text-xs font-semibold" style={{ color: 'var(--cv-accent)' }}>
                {promoIntensity}
                <span className="text-[10px] font-normal ml-1" style={{ color: 'var(--cv-ink-muted)' }}>
                  / 10
                </span>
              </div>
            </div>
            <input
              type="range"
              min={0}
              max={10}
              step={1}
              value={promoIntensity}
              onChange={(e) => setPromoIntensity(Number(e.target.value))}
              className="w-full"
              style={{ accentColor: 'var(--cv-accent)' }}
            />
            <div className="flex justify-between mt-1 font-mono text-[9px] tracking-wide" style={{ color: 'var(--cv-ink-muted)' }}>
              <span>subtle</span>
              <span>lively</span>
              <span>loud 🔥</span>
            </div>
          </div>

          {/* Legend */}
          <div className="text-[11px] leading-relaxed" style={{ color: 'var(--cv-ink-muted)' }}>
            1+ sale badges · 3+ strip · 4+ countdown · 6+ ribbons · 7+ pulse · 8+ 🔥
          </div>
        </div>
      </div>
    </>
  )
}
