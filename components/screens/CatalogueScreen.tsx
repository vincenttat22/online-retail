'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/context/ThemeContext'
import { PRODUCTS } from '@/lib/data'
import { CATEGORIES, toneFor } from '@/lib/tokens'
import CVChip from '@/components/ui/CVChip'
import CVProductCard from '@/components/ui/CVProductCard'
import CVIcon from '@/components/ui/CVIcon'

type SortKey = 'hot' | 'price' | 'priceDesc' | 'disc'

interface CatalogueScreenProps {
  initialCat?: string
}

export default function CatalogueScreen({ initialCat = 'all' }: CatalogueScreenProps) {
  const { theme, fx } = useTheme()
  const router = useRouter()
  const [q, setQ] = useState('')
  const [cat, setCat] = useState(initialCat)
  const [discOnly, setDiscOnly] = useState(false)
  const [sort, setSort] = useState<SortKey>('hot')

  const filtered = PRODUCTS.filter((p) => {
    if (cat !== 'all' && p.cat !== cat) return false
    if (discOnly && !p.disc) return false
    if (q && !(p.zh.includes(q) || p.en.toLowerCase().includes(q.toLowerCase()))) return false
    return true
  }).sort((a, b) => {
    if (sort === 'price') return a.price - b.price
    if (sort === 'priceDesc') return b.price - a.price
    if (sort === 'disc') return b.disc - a.disc
    return 0
  })

  const activeCatLabel = CATEGORIES.find((c) => c.id === cat)?.en.toUpperCase() ?? 'ALL'

  return (
    <div className="pb-28 animate-cv-fade">
      {/* Sticky search + filters header */}
      <div
        className="px-4 pt-14 pb-2 sticky top-0 z-10"
        style={{ background: theme.bg }}
      >
        {/* Search row */}
        <div className="flex items-center gap-2 mb-3">
          <Link
            href="/"
            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
            style={{ background: theme.surface, color: theme.ink }}
          >
            <CVIcon name="chev-l" size={16} />
          </Link>
          <div
            className="flex-1 h-9 rounded-full flex items-center px-3 gap-2"
            style={{ background: theme.surface }}
          >
            <CVIcon name="search" size={15} stroke={theme.inkMuted} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="搜索商品 · 红糖姜茶"
              className="flex-1 bg-transparent border-0 outline-0 text-[13px]"
              style={{ color: theme.ink, fontFamily: 'inherit' }}
            />
            {q && (
              <button
                onClick={() => setQ('')}
                className="p-0 border-0 bg-transparent cursor-pointer"
                style={{ color: theme.inkMuted }}
              >
                <CVIcon name="x" size={14} />
              </button>
            )}
          </div>
          <button
            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
            style={{ background: theme.surface, color: theme.ink }}
          >
            <CVIcon name="sliders" size={16} />
          </button>
        </div>

        {/* Category chips */}
        <div className="flex gap-1.5 overflow-x-auto -mx-4 px-4 pb-1.5 cv-scroll-x">
          {CATEGORIES.map((c) => (
            <CVChip key={c.id} active={cat === c.id} onClick={() => setCat(c.id)}>
              {c.zh}
            </CVChip>
          ))}
        </div>

        {/* Secondary filters */}
        <div className="flex gap-1.5 mt-2 overflow-x-auto cv-scroll-x pb-1">
          <CVChip active={discOnly} onClick={() => setDiscOnly(!discOnly)}>
            只看折扣
          </CVChip>
          {([['hot', '热度'], ['price', '价格 ↑'], ['priceDesc', '价格 ↓'], ['disc', '折扣']] as const).map(
            ([k, l]) => (
              <CVChip key={k} active={sort === k} onClick={() => setSort(k as SortKey)}>
                {l}
              </CVChip>
            )
          )}
        </div>
      </div>

      {/* Result count */}
      <div className="px-4 pt-3 pb-1.5 font-mono text-[10px] tracking-[1.5px]" style={{ color: theme.inkMuted }}>
        {String(filtered.length).padStart(2, '0')} ITEMS · {activeCatLabel}
      </div>

      {/* Product grid */}
      <div className="px-4 grid grid-cols-2 gap-2.5">
        {filtered.length === 0 ? (
          <div className="col-span-2 py-10 text-center text-[13px]" style={{ color: theme.inkMuted }}>
            没找到「{q}」的商品
            <br />
            <span className="text-[11px]">试试其他关键词</span>
          </div>
        ) : (
          filtered.map((p) => (
            <CVProductCard
              key={p.id}
              p={p}
              fx={fx}
              tone={toneFor(p.id)}
              onClick={() => router.push(`/product/${p.id}`)}
            />
          ))
        )}
      </div>
    </div>
  )
}
