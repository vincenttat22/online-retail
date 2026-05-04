'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import CVIcon from './CVIcon'

interface Props {
  productId: number
  count: number
}

const BUTTON_W = 140
const BUTTON_H = 44
const TAP_THRESHOLD = 6

export default function RecipeFloatingButton({ productId, count }: Props) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null)
  const dragRef = useRef<{
    pointerStart: { x: number; y: number }
    posStart: { x: number; y: number }
    moved: boolean
  } | null>(null)
  const [didDrag, setDidDrag] = useState(false)

  useEffect(() => {
    const init = () => {
      const x = Math.max(8, window.innerWidth - BUTTON_W - 16)
      const y = Math.min(window.innerHeight - BUTTON_H - 16, 88)
      setPos({ x, y })
    }
    init()
    window.addEventListener('resize', () => {
      setPos((p) => {
        if (!p) return p
        const maxX = window.innerWidth - BUTTON_W - 8
        const maxY = window.innerHeight - BUTTON_H - 8
        return { x: Math.min(Math.max(8, p.x), maxX), y: Math.min(Math.max(8, p.y), maxY) }
      })
    })
  }, [])

  if (count <= 0 || !pos) return null

  const handlePointerDown = (e: React.PointerEvent<HTMLAnchorElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    dragRef.current = {
      pointerStart: { x: e.clientX, y: e.clientY },
      posStart: { x: pos.x, y: pos.y },
      moved: false,
    }
    setDidDrag(false)
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
    const drag = dragRef.current
    if (!drag) return
    const dx = e.clientX - drag.pointerStart.x
    const dy = e.clientY - drag.pointerStart.y
    if (!drag.moved && Math.abs(dx) + Math.abs(dy) > TAP_THRESHOLD) {
      drag.moved = true
      setDidDrag(true)
    }
    if (drag.moved) {
      const maxX = window.innerWidth - BUTTON_W - 8
      const maxY = window.innerHeight - BUTTON_H - 8
      setPos({
        x: Math.min(Math.max(8, drag.posStart.x + dx), maxX),
        y: Math.min(Math.max(8, drag.posStart.y + dy), maxY),
      })
    }
  }

  const handlePointerUp = (e: React.PointerEvent<HTMLAnchorElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId)
    }
    dragRef.current = null
  }

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (didDrag) {
      e.preventDefault()
      setDidDrag(false)
    }
  }

  const nn = String(count).padStart(2, '0')

  return (
    <Link
      href={`/product/${productId}/recipes`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onClick={handleClick}
      aria-label="食谱推荐 — show recipes for this product"
      className="fixed z-30 flex items-center gap-2 pl-1.5 pr-3 rounded-full select-none touch-none"
      style={{
        left: pos.x,
        top: pos.y,
        width: BUTTON_W,
        height: BUTTON_H,
        background: 'var(--cv-ink)',
        color: '#ffffff',
        boxShadow: '0 8px 20px rgba(0,0,0,0.18), 0 1.5px 4px rgba(0,0,0,0.12)',
        cursor: didDrag ? 'grabbing' : 'pointer',
        textDecoration: 'none',
      }}
    >
      <span
        className="flex items-center justify-center rounded-full shrink-0"
        style={{ width: 32, height: 32, background: 'var(--cv-accent)' }}
      >
        <CVIcon name="flame" size={16} stroke="#ffffff" sw={2} />
      </span>
      <span className="flex flex-col leading-tight">
        <span className="font-serif font-bold" style={{ fontSize: 13 }}>
          食谱推荐
        </span>
        <span
          className="font-mono uppercase tracking-[1.5px]"
          style={{ fontSize: 9, color: 'rgba(255,255,255,0.6)' }}
        >
          {nn} Recipes
        </span>
      </span>
    </Link>
  )
}
