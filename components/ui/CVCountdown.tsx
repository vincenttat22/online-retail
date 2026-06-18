'use client'

import { useState, useEffect, useRef } from 'react'

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

function FlipUnit({ val, invertColors, cellSizeClasses }: { val: string, invertColors?: boolean, cellSizeClasses: string }) {
  const [prev, setPrev] = useState(val)
  const [animating, setAnimating] = useState(false)
  const isFirst = useRef(true)

  useEffect(() => {
    if (val !== prev) {
      if (isFirst.current) {
        setPrev(val)
        isFirst.current = false
        return
      }
      setAnimating(true)
      const t = setTimeout(() => {
        setPrev(val)
        setAnimating(false)
      }, 800)
      return () => clearTimeout(t)
    }
  }, [val, prev])

  const bg = invertColors ? 'var(--cv-hero-ink)' : 'var(--cv-ink)'
  const fg = invertColors ? 'var(--cv-hero-bg)' : 'var(--cv-bg)'
  const nextVal = val
  const currVal = prev

  return (
    <div 
      className={`cv-flip-card font-mono font-semibold leading-none ${cellSizeClasses}`} 
      style={{ '--card-bg': bg, '--card-fg': fg } as any}
    >
      {/* Invisible placeholder to establish dimensions */}
      <span className="invisible">{nextVal}</span>
      
      {/* Static background layers */}
      <div className="cv-flip-part part-top static-top">{nextVal}</div>
      <div className="cv-flip-part part-bottom static-bottom">{currVal}</div>
      
      {/* Flap container that rotates */}
      <div className={`cv-flap ${animating ? 'flipping' : ''}`}>
        <div className="cv-flip-part part-top flap-front">{currVal}</div>
        <div className="cv-flip-part part-bottom flap-back">{nextVal}</div>
      </div>
      
      {/* Middle divider */}
      <div className="absolute top-1/2 left-0 right-0 h-[1px] opacity-20 -translate-y-1/2 z-10" style={{ backgroundColor: fg }} />
    </div>
  )
}

export default function CVCountdown({ targetMs, big, invertColors, xl }: CVCountdownProps) {
  const { h, m, s } = useCountdown(targetMs)

  // Adjusting cell sizes for single-digit flip cards
  const cellSizeClasses = xl
    ? 'min-w-[28px] px-1.5 py-1.5 text-2xl'
    : big
      ? 'min-w-[20px] px-1 py-1 text-base'
      : 'min-w-[14px] px-0.5 py-0.5 text-[11px]'

  const renderDigits = (valStr: string) => {
    return valStr.split('').map((char, idx) => (
      <FlipUnit key={idx} val={char} invertColors={invertColors} cellSizeClasses={cellSizeClasses} />
    ))
  }

  return (
    <div
      className={`inline-flex items-center font-sans ${xl ? 'gap-2 text-lg' : big ? 'gap-1 text-sm' : 'gap-1 text-[11px]'}`}
      style={{ color: 'var(--cv-ink-soft)' }}
    >
      <style>{`
        .cv-flip-card {
          position: relative;
          display: inline-flex;
          justify-content: center;
          align-items: center;
          perspective: 1000px;
          background-color: var(--card-bg);
          color: var(--card-fg);
          box-shadow: 0 2px 4px rgba(0,0,0,0.15);
        }
        .cv-flip-part {
          position: absolute;
          inset: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: var(--card-bg);
          backface-visibility: hidden;
        }
        .part-top {
          clip-path: inset(0 0 50% 0);
        }
        .part-bottom {
          clip-path: inset(50% 0 0 0);
        }
        .cv-flap {
          position: absolute;
          inset: 0;
          transform-style: preserve-3d;
          transform-origin: center;
          z-index: 3;
        }
        .cv-flap.flipping {
          animation: flipDown 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        .flap-front {
          clip-path: inset(0 0 50% 0);
        }
        .flap-back {
          clip-path: inset(50% 0 0 0);
          transform: rotateX(180deg);
        }
        .cv-flap.flipping .flap-front {
          animation: shadowFront 0.8s ease-in forwards;
        }
        .cv-flap.flipping .flap-back {
          animation: shadowBack 0.8s ease-out forwards;
        }
        @keyframes flipDown {
          0% { transform: rotateX(0deg); }
          100% { transform: rotateX(-180deg); }
        }
        @keyframes shadowFront {
          0% { filter: brightness(1); }
          50% { filter: brightness(0.3); }
          100% { filter: brightness(0.3); }
        }
        @keyframes shadowBack {
          0% { filter: brightness(0.3); }
          50% { filter: brightness(0.3); }
          100% { filter: brightness(1); }
        }
      `}</style>
      <div className="flex gap-[2px]">
        {renderDigits(h)}
      </div>
      <span>:</span>
      <div className="flex gap-[2px]">
        {renderDigits(m)}
      </div>
      <span>:</span>
      <div className="flex gap-[2px]">
        {renderDigits(s)}
      </div>
    </div>
  )
}
