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
  initialQ?: string
}

export default function CatalogueScreen({ initialCat = 'all', initialQ = '' }: CatalogueScreenProps) {
  const { theme, fx } = useTheme()
  const router = useRouter()
  const [q, setQ] = useState(initialQ)
  const [cat, setCat] = useState(initialCat)
  const [discOnly, setDiscOnly] = useState(false)
  const [priceMax, setPriceMax] = useState(200)
  const [sort, setSort] = useState<SortKey>('hot')

  const filtered = PRODUCTS.filter((p) => {
    if (cat !== 'all' && p.cat !== cat) return false
    if (discOnly && !p.disc) return false
    if (p.price > priceMax) return false
    if (q && !(p.zh.includes(q) || p.en.toLowerCase().includes(q.toLowerCase()))) return false
    return true
  }).sort((a, b) => {
    if (sort === 'price') return a.price - b.price
    if (sort === 'priceDesc') return b.price - a.price
    if (sort === 'disc') return b.disc - a.disc
    return 0
  })

  const activeCat = CATEGORIES.find((c) => c.id === cat)

  return (
    <div className="animate-cv-fade">
      {/*
       * Layout: on mobile, a sticky search header sits above the grid.
       * On md+, the sidebar sits beside the grid (CSS grid layout).
       */}
      <div className="md:grid md:grid-cols-[180px_1fr] xl:grid-cols-[220px_1fr] md:gap-6 xl:gap-9 md:px-6 xl:px-10 md:py-6 xl:py-9">

        {/* ── SIDEBAR (desktop/tablet only) ── */}
        <aside className="hidden md:block self-start sticky top-[72px]">
          <div className="font-mono text-[10px] tracking-[2px] mb-3" style={{ color: theme.inkMuted }}>CATEGORIES</div>
          <div className="flex flex-col mb-6">
            {CATEGORIES.map((c) => {
              const active = cat === c.id
              return (
                <button key={c.id} onClick={() => setCat(c.id)}
                  className="bg-transparent border-0 py-2 cursor-pointer text-left flex justify-between items-center text-[13px]"
                  style={{ color: active ? theme.ink : theme.inkSoft, fontWeight: active ? 600 : 400, borderBottom: `0.5px solid ${theme.line}` }}
                >
                  <span>{c.zh}<span className="ml-1.5 text-[10px] font-sans font-normal" style={{ color: theme.inkMuted }}>{c.en}</span></span>
                  {active && <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: theme.accent }} />}
                </button>
              )
            })}
          </div>

          <div className="font-mono text-[10px] tracking-[2px] mb-2.5" style={{ color: theme.inkMuted }}>PRICE · 价格</div>
          <div className="mb-6">
            <input type="range" min={20} max={200} value={priceMax} onChange={(e) => setPriceMax(Number(e.target.value))} className="w-full" style={{ accentColor: theme.accent }} />
            <div className="flex justify-between mt-1 text-[11px] font-sans" style={{ color: theme.inkSoft }}>
              <span>¥20</span>
              <span className="font-semibold" style={{ color: theme.ink }}>≤ ¥{priceMax}</span>
            </div>
          </div>

          <div className="font-mono text-[10px] tracking-[2px] mb-2.5" style={{ color: theme.inkMuted }}>FILTER</div>
          <label className="flex items-center gap-2 text-[13px] cursor-pointer" style={{ color: theme.inkSoft }}>
            <input type="checkbox" checked={discOnly} onChange={(e) => setDiscOnly(e.target.checked)} style={{ accentColor: theme.accent }} />
            只看折扣商品
          </label>
        </aside>

        {/* ── MAIN COLUMN ── */}
        <div>
          {/* Mobile sticky search header */}
          <div className="md:hidden px-4 pt-14 pb-2 sticky top-0 z-10" style={{ background: theme.bg }}>
            <div className="flex items-center gap-2 mb-3">
              <Link href="/" className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: theme.surface, color: theme.ink }}>
                <CVIcon name="chev-l" size={16} />
              </Link>
              <div className="flex-1 h-9 rounded-full flex items-center px-3 gap-2" style={{ background: theme.surface }}>
                <CVIcon name="search" size={15} stroke={theme.inkMuted} />
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="搜索商品 · 红糖姜茶"
                  className="flex-1 bg-transparent border-0 outline-0 text-[13px]"
                  style={{ color: theme.ink, fontFamily: 'inherit' }}
                />
                {q && (
                  <button onClick={() => setQ('')} className="p-0 border-0 bg-transparent cursor-pointer" style={{ color: theme.inkMuted }}>
                    <CVIcon name="x" size={14} />
                  </button>
                )}
              </div>
              <button className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: theme.surface, color: theme.ink }}>
                <CVIcon name="sliders" size={16} />
              </button>
            </div>
            {/* Mobile category chips */}
            <div className="flex gap-1.5 overflow-x-auto -mx-4 px-4 pb-1.5 cv-scroll-x">
              {CATEGORIES.map((c) => (
                <CVChip key={c.id} active={cat === c.id} onClick={() => setCat(c.id)}>{c.zh}</CVChip>
              ))}
            </div>
            {/* Mobile secondary filters */}
            <div className="flex gap-1.5 mt-2 overflow-x-auto cv-scroll-x pb-1">
              <CVChip active={discOnly} onClick={() => setDiscOnly(!discOnly)}>只看折扣</CVChip>
              {([['hot', '热度'], ['price', '价格 ↑'], ['priceDesc', '价格 ↓'], ['disc', '折扣']] as const).map(([k, l]) => (
                <CVChip key={k} active={sort === k} onClick={() => setSort(k as SortKey)}>{l}</CVChip>
              ))}
            </div>
          </div>

          {/* Desktop header row */}
          <header className="hidden md:flex items-center justify-between mb-5 gap-3 flex-wrap">
            <h1 className="m-0 font-serif font-extrabold tracking-tight text-[24px] xl:text-[32px]" style={{ color: theme.ink }}>
              {activeCat?.zh ?? '全部'}
              <span className="font-mono text-[12px] font-normal tracking-[1.5px] ml-3" style={{ color: theme.inkMuted }}>
                {String(filtered.length).padStart(2, '0')} ITEMS
              </span>
            </h1>
            <div className="flex gap-1.5 flex-wrap">
              {([['hot', '热度'], ['price', '价格 ↑'], ['priceDesc', '价格 ↓'], ['disc', '折扣']] as const).map(([k, l]) => (
                <CVChip key={k} active={sort === k} onClick={() => setSort(k as SortKey)}>{l}</CVChip>
              ))}
            </div>
          </header>

          {/* Mobile result count */}
          <div className="md:hidden px-4 pt-3 pb-1.5 font-mono text-[10px] tracking-[1.5px]" style={{ color: theme.inkMuted }}>
            {String(filtered.length).padStart(2, '0')} ITEMS · {activeCat?.en.toUpperCase() ?? 'ALL'}
          </div>

          {/* Product grid — shared, responsive columns */}
          <div className="px-4 md:px-0 pb-28 md:pb-0 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2.5 md:gap-3 xl:gap-4">
            {filtered.length === 0 ? (
              <div className="col-span-full py-10 md:py-16 text-center text-[13px]" style={{ color: theme.inkMuted }}>
                没找到符合条件的商品
                <br /><span className="text-[11px]">试试调整筛选条件</span>
              </div>
            ) : (
              filtered.map((p) => (
                <CVProductCard key={p.id} p={p} fx={fx} tone={toneFor(p.id)} onClick={() => router.push(`/product/${p.id}`)} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
