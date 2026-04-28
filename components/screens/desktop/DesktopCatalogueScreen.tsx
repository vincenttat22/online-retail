'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/context/ThemeContext'
import { PRODUCTS } from '@/lib/data'
import { CATEGORIES, toneFor } from '@/lib/tokens'
import CVChip from '@/components/ui/CVChip'
import CVProductCard from '@/components/ui/CVProductCard'

type SortKey = 'hot' | 'price' | 'priceDesc' | 'disc'

interface DesktopCatalogueScreenProps {
  initialCat?: string
  initialQ?: string
}

export default function DesktopCatalogueScreen({
  initialCat = 'all',
  initialQ = '',
}: DesktopCatalogueScreenProps) {
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
    <div className="px-6 xl:px-10 py-6 xl:py-9 grid grid-cols-[180px_1fr] xl:grid-cols-[220px_1fr] gap-6 xl:gap-9">
      {/* ── SIDEBAR ── */}
      <aside className="self-start sticky top-[72px]">
        {/* Categories */}
        <div
          className="font-mono text-[10px] tracking-[2px] mb-3"
          style={{ color: theme.inkMuted }}
        >
          CATEGORIES
        </div>
        <div className="flex flex-col gap-0 mb-6">
          {CATEGORIES.map((c) => {
            const active = cat === c.id
            return (
              <button
                key={c.id}
                onClick={() => setCat(c.id)}
                className="bg-transparent border-0 py-2 cursor-pointer text-left flex justify-between items-center text-[13px]"
                style={{
                  color: active ? theme.ink : theme.inkSoft,
                  fontWeight: active ? 600 : 400,
                  borderBottom: `0.5px solid ${theme.line}`,
                }}
              >
                <span>
                  {c.zh}
                  <span
                    className="ml-1.5 text-[10px] font-sans font-normal"
                    style={{ color: theme.inkMuted }}
                  >
                    {c.en}
                  </span>
                </span>
                {active && (
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ background: theme.accent }}
                  />
                )}
              </button>
            )
          })}
        </div>

        {/* Price range */}
        <div
          className="font-mono text-[10px] tracking-[2px] mb-2.5"
          style={{ color: theme.inkMuted }}
        >
          PRICE · 价格
        </div>
        <div className="mb-6">
          <input
            type="range"
            min={20}
            max={200}
            value={priceMax}
            onChange={(e) => setPriceMax(Number(e.target.value))}
            className="w-full"
            style={{ accentColor: theme.accent }}
          />
          <div
            className="flex justify-between mt-1 text-[11px] font-sans"
            style={{ color: theme.inkSoft }}
          >
            <span>¥20</span>
            <span className="font-semibold" style={{ color: theme.ink }}>
              ≤ ¥{priceMax}
            </span>
          </div>
        </div>

        {/* Filter */}
        <div
          className="font-mono text-[10px] tracking-[2px] mb-2.5"
          style={{ color: theme.inkMuted }}
        >
          FILTER
        </div>
        <label
          className="flex items-center gap-2 text-[13px] cursor-pointer"
          style={{ color: theme.inkSoft }}
        >
          <input
            type="checkbox"
            checked={discOnly}
            onChange={(e) => setDiscOnly(e.target.checked)}
            style={{ accentColor: theme.accent }}
          />
          只看折扣商品
        </label>
      </aside>

      {/* ── MAIN ── */}
      <div>
        {/* Header row */}
        <header className="flex items-center justify-between mb-5 gap-3 flex-wrap">
          <h1
            className="m-0 font-serif font-extrabold tracking-tight text-[24px] xl:text-[32px]"
            style={{ color: theme.ink }}
          >
            {activeCat?.zh ?? '全部'}
            <span
              className="font-mono text-[12px] font-normal tracking-[1.5px] ml-3"
              style={{ color: theme.inkMuted }}
            >
              {String(filtered.length).padStart(2, '0')} ITEMS
            </span>
          </h1>
          <div className="flex gap-1.5 flex-wrap">
            {([['hot', '热度'], ['price', '价格 ↑'], ['priceDesc', '价格 ↓'], ['disc', '折扣']] as const).map(
              ([k, l]) => (
                <CVChip key={k} active={sort === k} onClick={() => setSort(k as SortKey)}>
                  {l}
                </CVChip>
              )
            )}
          </div>
        </header>

        {/* Grid */}
        <div className="grid grid-cols-3 xl:grid-cols-4 gap-3 xl:gap-4">
          {filtered.length === 0 ? (
            <div
              className="col-span-full py-16 text-center text-[13px]"
              style={{ color: theme.inkMuted }}
            >
              没找到符合条件的商品 · 试试调整筛选
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
    </div>
  )
}
