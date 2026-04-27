'use client'

import type { PlaceholderTone } from '@/lib/tokens'
import { TONE_PALETTES } from '@/lib/tokens'

interface CVPlaceholderProps {
  label?: string
  tone?: PlaceholderTone
  ratio?: number
  className?: string
  rounded?: boolean
}

export default function CVPlaceholder({
  label = '产品图',
  tone = 'a',
  ratio = 1,
  className = '',
  rounded = false,
}: CVPlaceholderProps) {
  const [bg, stripe, textColor] = TONE_PALETTES[tone] ?? TONE_PALETTES.a

  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='none'><defs><pattern id='s' width='6' height='6' patternUnits='userSpaceOnUse' patternTransform='rotate(35)'><rect width='6' height='6' fill='${bg}'/><line x1='0' y1='0' x2='0' y2='6' stroke='${stripe}' stroke-width='2.4'/></pattern></defs><rect width='100' height='100' fill='url(%23s)'/></svg>`

  return (
    <div
      className={`relative w-full overflow-hidden ${rounded ? 'rounded-2xl' : ''} ${className}`}
      style={{
        aspectRatio: ratio,
        backgroundImage: `url("data:image/svg+xml;utf8,${svg}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {label && (
        <span
          className="absolute bottom-2 left-2.5 px-1.5 py-0.5 rounded text-[10px] leading-tight font-mono tracking-wide"
          style={{ color: textColor, background: 'rgba(255,255,255,0.55)' }}
        >
          {label}
        </span>
      )}
    </div>
  )
}
