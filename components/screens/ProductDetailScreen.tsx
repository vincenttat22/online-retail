'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/context/ThemeContext'
import { PRODUCTS } from '@/lib/data'
import { CATEGORIES, toneFor } from '@/lib/tokens'
import CVPlaceholder from '@/components/ui/CVPlaceholder'
import CVDiscBadge from '@/components/ui/CVDiscBadge'
import CVProductCard from '@/components/ui/CVProductCard'
import CVCountdown from '@/components/ui/CVCountdown'
import CVWeChatCTA from '@/components/ui/CVWeChatCTA'
import CVIcon from '@/components/ui/CVIcon'

const COUNTDOWN_TARGET = Date.now() + 6 * 3600 * 1000 + 12 * 60 * 1000

interface ProductDetailScreenProps {
  productId: number
}

export default function ProductDetailScreen({ productId }: ProductDetailScreenProps) {
  const { theme, fx } = useTheme()
  const router = useRouter()
  const p = PRODUCTS.find((x) => x.id === productId) ?? PRODUCTS[0]
  const final = p.disc ? Math.round(p.price * (100 - p.disc)) / 100 : p.price
  const related = PRODUCTS.filter((x) => x.cat === p.cat && x.id !== p.id).slice(0, 4)
  const [imgIdx, setImgIdx] = useState(0)
  const catLabel = CATEGORIES.find((c) => c.id === p.cat)?.zh ?? p.cat

  return (
    <div className="pb-32 animate-cv-fade">
      {/* Image carousel */}
      <div className="relative">
        <CVPlaceholder label={`${p.en} · ${imgIdx + 1}/4`} tone={toneFor(p.id + imgIdx)} ratio={1} />

        {/* Back button */}
        <div className="absolute top-14 left-4">
          <Link
            href="/"
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)', color: theme.ink }}
          >
            <CVIcon name="chev-l" size={18} />
          </Link>
        </div>

        {/* Action buttons */}
        <div className="absolute top-14 right-4 flex gap-2">
          <button
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)', color: theme.ink }}
          >
            <CVIcon name="heart" size={18} />
          </button>
          <button
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)', color: theme.ink }}
          >
            <CVIcon name="cart" size={18} />
          </button>
        </div>

        {/* Dots */}
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
          {[0, 1, 2, 3].map((i) => (
            <button
              key={i}
              onClick={() => setImgIdx(i)}
              className="h-1.5 rounded-full border-0 p-0 cursor-pointer transition-all duration-200"
              style={{
                width: i === imgIdx ? 18 : 6,
                background: i === imgIdx ? theme.ink : 'rgba(255,255,255,0.85)',
              }}
            />
          ))}
        </div>
      </div>

      <div className="px-4 pt-5">
        {/* Badges row */}
        <div className="flex items-center gap-1.5 flex-wrap mb-2">
          {p.disc > 0 && <CVDiscBadge pct={p.disc} fx={fx} urgent={p.disc >= 25} />}
          {p.badge && (
            <span
              className="px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide"
              style={{ background: theme.goldSoft, color: theme.gold }}
            >
              {p.badge}
            </span>
          )}
          <span className="font-mono text-[9px] tracking-[1px]" style={{ color: theme.inkMuted }}>
            SKU·CV{String(p.id).padStart(4, '0')}
          </span>
        </div>

        <h1
          className="m-0 font-serif text-[22px] font-extrabold leading-snug tracking-tight"
          style={{ color: theme.ink }}
        >
          {p.zh}
        </h1>
        <div className="font-sans text-xs mt-1 tracking-wide" style={{ color: theme.inkMuted }}>
          {p.en}
        </div>

        {/* Price block */}
        <div
          className="mt-3.5 p-3.5 rounded-2xl flex items-center justify-between"
          style={{ background: theme.surface }}
        >
          <div>
            <div className="flex items-baseline gap-2">
              <span
                className="font-sans text-[28px] font-bold tracking-tight"
                style={{ color: theme.accent, letterSpacing: '-0.5px' }}
              >
                <span className="text-sm">¥</span>
                {final}
              </span>
              {p.disc > 0 && (
                <span className="font-sans text-[13px] line-through" style={{ color: theme.inkMuted }}>
                  ¥{p.price}
                </span>
              )}
              <span className="text-[11px]" style={{ color: theme.inkMuted }}>
                {p.unit}
              </span>
            </div>
            {fx.countdown && p.disc > 0 && (
              <div className="mt-2 flex items-center gap-1.5">
                <span className="text-[10px]" style={{ color: theme.inkSoft }}>
                  距活动结束
                </span>
                <CVCountdown targetMs={COUNTDOWN_TARGET} />
              </div>
            )}
          </div>
          <div className="text-right">
            <div className="font-mono text-[10px] tracking-[1px]" style={{ color: theme.inkMuted }}>
              STOCK
            </div>
            <div className="font-sans text-sm font-semibold" style={{ color: theme.ink }}>
              247 件
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-5 px-0.5">
          <div className="font-mono text-[10px] tracking-[1.5px] mb-1.5" style={{ color: theme.inkMuted }}>
            DESCRIPTION
          </div>
          <p className="m-0 text-[13px] leading-relaxed" style={{ color: theme.inkSoft }}>
            {p.desc}。精选优质原料，严格把控品质。我们与本地工坊长期合作，确保每一件商品都符合健康、环保的标准。
          </p>
        </div>

        {/* Spec table */}
        <div className="mt-4 p-3.5 rounded-2xl text-xs" style={{ background: theme.surface }}>
          {[
            ['品类', catLabel],
            ['规格', p.unit.replace('/', '每') + '装'],
            ['产地', '中国 · 浙江'],
            ['保质期', '12个月'],
          ].map(([k, v], i, arr) => (
            <div
              key={k}
              className="flex justify-between py-2"
              style={{ borderBottom: i < arr.length - 1 ? `0.5px solid ${theme.line}` : 'none' }}
            >
              <span style={{ color: theme.inkMuted }}>{k}</span>
              <span className="font-medium" style={{ color: theme.ink }}>
                {v}
              </span>
            </div>
          ))}
        </div>

        {/* Related products */}
        <div className="mt-6">
          <div className="font-mono text-[10px] tracking-[1.5px] mb-2.5" style={{ color: theme.inkMuted }}>
            RELATED · 相关推荐
          </div>
          <div className="flex gap-2 overflow-x-auto -mx-4 px-4 cv-scroll-x">
            {related.map((r) => (
              <div key={r.id} className="flex-none w-[130px]">
                <CVProductCard
                  p={r}
                  fx={fx}
                  tone={toneFor(r.id)}
                  onClick={() => router.push(`/product/${r.id}`)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky CTA */}
      <div
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] px-4 pt-3 pb-8 flex gap-2 z-30"
        style={{ background: theme.bg, borderTop: `0.5px solid ${theme.line}` }}
      >
        <button
          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: theme.surface, color: theme.ink }}
        >
          <CVIcon name="cart" size={18} />
        </button>
        <button
          className="flex-1 px-3.5 rounded-xl text-[13px] font-semibold cursor-pointer"
          style={{
            border: `1.5px solid ${theme.ink}`,
            background: 'transparent',
            color: theme.ink,
          }}
        >
          加入收藏
        </button>
        <CVWeChatCTA label="微信下单" />
      </div>
    </div>
  )
}
