'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/context/ThemeContext'
import { toneFor } from '@/lib/tokens'
import CVChip from '@/components/ui/CVChip'
import CVProductCard from '@/components/ui/CVProductCard'
import CVIcon from '@/components/ui/CVIcon'
import type { Product } from '@/lib/types'
import type { DbProductCategory } from '@/lib/db/schema'


type SortKey = 'price' | 'priceDesc'

interface CatalogueScreenProps {
  products: Product[]
  categories: DbProductCategory[]
  initialCat?: string
  initialQ?: string
}

export default function CatalogueScreen({ products, categories, initialCat = 'all', initialQ = '' }: CatalogueScreenProps) {
  const { theme, fx } = useTheme()
  const router = useRouter()
  const productMaxPrice = Math.max(20, ...products.map((p) => Math.ceil(p.price)))
  const [q, setQ] = useState(initialQ)
  const [cat, setCat] = useState(initialCat)
  const [priceMax, setPriceMax] = useState(productMaxPrice)
  const [sort, setSort] = useState<SortKey>('price')
  const [showFilters, setShowFilters] = useState(true)

  useEffect(() => {
    setQ(initialQ)
  }, [initialQ])

  useEffect(() => {
    setCat(initialCat)
  }, [initialCat])

  const filtered = products.filter((p) => {
    if (cat !== 'all' && p.cat !== cat) return false
    if (p.price > priceMax) return false
    if (q) {
      const qLower = q.toLowerCase()
      const matchesZh = p.zh.includes(q)
      const matchesEn = p.en.toLowerCase().includes(qLower)
      const matchesPinyin = p.pinyinName ? p.pinyinName.toLowerCase().includes(qLower) : false
      if (!matchesZh && !matchesEn && !matchesPinyin) return false
    }
    return true
  }).sort((a, b) => {
    if (sort === 'price') return a.price - b.price
    if (sort === 'priceDesc') return b.price - a.price
    return 0
  })

  const activeCat = cat === 'all' ? null : categories.find((c) => c.name === cat)

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
            <button onClick={() => setCat('all')}
              className="bg-transparent border-0 py-2 cursor-pointer text-left flex justify-between items-center text-[13px]"
              style={{ color: cat === 'all' ? theme.ink : theme.inkSoft, fontWeight: cat === 'all' ? 600 : 400, borderBottom: `0.5px solid ${theme.line}` }}
            >
              <span>全部All</span>
              {cat === 'all' && <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: theme.accent }} />}
            </button>
            {categories.map((c) => {
              const active = cat === c.name
              return (
                <button key={c.id} onClick={() => setCat(c.name)}
                  className="bg-transparent border-0 py-2 cursor-pointer text-left flex justify-between items-center text-[13px]"
                  style={{ color: active ? theme.ink : theme.inkSoft, fontWeight: active ? 600 : 400, borderBottom: `0.5px solid ${theme.line}` }}
                >
                  <span>
                    {c.description}
                    {c.descriptionEn && <span className="ml-1.5 text-[10px] font-sans font-normal" style={{ color: theme.inkMuted }}>{c.descriptionEn}</span>}
                  </span>
                  {active && <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: theme.accent }} />}
                </button>
              )
            })}
          </div>

          <div className="font-mono text-[10px] tracking-[2px] mb-2.5" style={{ color: theme.inkMuted }}>PRICE · 价格</div>
          <div className="mb-6">
            <input type="range" min={0} max={productMaxPrice} value={priceMax} onChange={(e) => setPriceMax(Number(e.target.value))} className="w-full" style={{ accentColor: theme.accent }} />
            <div className="flex justify-between mt-1 text-[11px] font-sans" style={{ color: theme.inkSoft }}>
              <span>$0</span>
              <span className="font-semibold" style={{ color: theme.ink }}>≤ ${priceMax}</span>
            </div>
          </div>
        </aside>

        {/* ── MAIN COLUMN ── */}
        <div>
          {/* Mobile sticky search header */}
          <div className="md:hidden px-4 pt-3 pb-2 sticky top-0 z-10" style={{ background: theme.bg }}>
            <div className="flex items-center gap-2 mb-3">
              <Link href="/" className="shrink-0 drop-shadow-md">
                <Image src="/CV-logo-white.svg" alt="CV Shop" width={36} height={36} priority />
              </Link>
              <div className="flex-1 h-9 rounded-full flex items-center px-3 gap-2" style={{ background: theme.surface }}>
                <CVIcon name="search" size={15} stroke={theme.inkMuted} />
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="搜索商品名称/拼音/首字母 (如 htjc)"
                  className="flex-1 bg-transparent border-0 outline-0 text-[13px]"
                  style={{ color: theme.ink, fontFamily: 'inherit' }}
                />
                {q && (
                  <button onClick={() => setQ('')} className="p-0 border-0 bg-transparent cursor-pointer" style={{ color: theme.inkMuted }}>
                    <CVIcon name="x" size={14} />
                  </button>
                )}
              </div>
              <button
                onClick={() => setShowFilters((v) => !v)}
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                style={{ background: showFilters ? theme.accent : theme.surface, color: showFilters ? theme.bg : theme.ink }}
              >
                <CVIcon name="sliders" size={16} />
              </button>
            </div>
            {showFilters && (
              <>
                {/* Mobile category chips */}
                <div className="flex gap-1.5 overflow-x-auto -mx-4 px-4 pb-1.5 cv-scroll-x">
                  <CVChip active={cat === 'all'} onClick={() => setCat('all')}>全部</CVChip>
                  {categories.map((c) => (
                    <CVChip key={c.id} active={cat === c.name} onClick={() => setCat(c.name)}>
                      {c.description || c.name}
                    </CVChip>
                  ))}
                </div>
                {/* Mobile secondary filters */}
                <div className="flex gap-1.5 mt-2 overflow-x-auto cv-scroll-x pb-1">
                  {([['price', '价格 ↑'], ['priceDesc', '价格 ↓']] as const).map(([k, l]) => (
                    <CVChip key={k} active={sort === k} onClick={() => setSort(k as SortKey)}>{l}</CVChip>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Desktop header row */}
          <header className="hidden md:flex items-center justify-between mb-5 gap-3 flex-wrap">
            <h1 className="m-0 font-serif font-extrabold tracking-tight text-[24px] xl:text-[32px]" style={{ color: theme.ink }}>
              {activeCat ? (
                <>
                  {activeCat.description || activeCat.name}
                  {activeCat.descriptionEn && <span className="font-mono text-[12px] font-normal tracking-[1.5px] ml-3" style={{ color: theme.inkMuted }}>{activeCat.descriptionEn}</span>}
                </>
              ) : (
                <>全部<span className="font-mono text-[12px] font-normal tracking-[1.5px] ml-3" style={{ color: theme.inkMuted }}>All</span></>
              )}
              <span className="font-mono text-[12px] font-normal tracking-[1.5px] ml-3" style={{ color: theme.inkMuted }}>
                {String(filtered.length).padStart(2, '0')} ITEMS
              </span>
            </h1>
            <div className="flex gap-1.5 flex-wrap">
              {([['price', '价格 ↑'], ['priceDesc', '价格 ↓']] as const).map(([k, l]) => (
                <CVChip key={k} active={sort === k} onClick={() => setSort(k as SortKey)}>{l}</CVChip>
              ))}
            </div>
          </header>

          {/* Mobile result count */}
          <div className="md:hidden px-4 pt-3 pb-1.5 font-mono text-[10px] tracking-[1.5px]" style={{ color: theme.inkMuted }}>
            {String(filtered.length).padStart(2, '0')} ITEMS · {activeCat ? (activeCat.descriptionEn ?? activeCat.name).toUpperCase() : 'ALL'}
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
