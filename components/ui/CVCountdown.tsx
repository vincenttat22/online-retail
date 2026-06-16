'use client'

import { useState, useEffect } from 'react'

function useCountdown(targetMs: number) {
  const [now, setNow] = useState<number | null>(null)
  useEffect(() => {
    setNow(Date.now())
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])
  const diff = now === null ? 0 : Math.max(0, targetMs - now)
  const h = String(Math.floor(diff / 3.6e6)).padStart(2, '0')
  const m = String(Math.floor((diff % 3.6e6) / 6e4)).padStart(2, '0')
  const s = String(Math.floor((diff % 6e4) / 1000)).padStart(2, '0')
  return { h, m, s }
}

interface CVCountdownProps {
  targetMs: number
  big?: boolean
  invertColors?: boolean
  /** An even larger preset than `big`, for hero placements. Takes priority over `big`. */
  xl?: boolean
}

export default function CVCountdown({ targetMs, big, invertColors, xl }: CVCountdownProps) {
  const { h, m, s } = useCountdown(targetMs)

  const cellSizeClasses = xl
    ? 'min-w-[46px] px-2.5 py-1.5 text-2xl'
    : big
      ? 'min-w-[36px] px-2 py-1 text-base'
      : 'min-w-[22px] px-1 py-0.5 text-[11px]'

  const cell = (v: string) => (
    <span
      className={`inline-block rounded font-mono font-semibold text-center leading-none ${cellSizeClasses}`}
      style={
        invertColors
          ? { background: 'var(--cv-hero-ink)', color: 'var(--cv-hero-bg)' }
          : { background: 'var(--cv-ink)', color: 'var(--cv-bg)' }
      }
    >
      {v}
    </span>
  )

  return (
    <div
      className={`inline-flex items-center font-sans ${xl ? 'gap-2 text-lg' : big ? 'gap-1 text-sm' : 'gap-1 text-[11px]'}`}
      style={{ color: 'var(--cv-ink-soft)' }}
    >
      {cell(h)}<span>:</span>{cell(m)}<span>:</span>{cell(s)}
    </div>
  )
}
