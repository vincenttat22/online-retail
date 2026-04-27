'use client'

import { useState, useEffect } from 'react'

function useCountdown(targetMs: number) {
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])
  const diff = Math.max(0, targetMs - now)
  const h = String(Math.floor(diff / 3.6e6)).padStart(2, '0')
  const m = String(Math.floor((diff % 3.6e6) / 6e4)).padStart(2, '0')
  const s = String(Math.floor((diff % 6e4) / 1000)).padStart(2, '0')
  return { h, m, s }
}

interface CVCountdownProps {
  targetMs: number
  big?: boolean
  invertColors?: boolean
}

export default function CVCountdown({ targetMs, big, invertColors }: CVCountdownProps) {
  const { h, m, s } = useCountdown(targetMs)

  const cell = (v: string) => (
    <span
      className={`inline-block rounded font-mono font-semibold text-center leading-none ${big ? 'min-w-[36px] px-2 py-1 text-base' : 'min-w-[22px] px-1 py-0.5 text-[11px]'}`}
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
      className={`inline-flex items-center gap-1 font-sans ${big ? 'text-sm' : 'text-[11px]'}`}
      style={{ color: 'var(--cv-ink-soft)' }}
    >
      {cell(h)}<span>:</span>{cell(m)}<span>:</span>{cell(s)}
    </div>
  )
}
