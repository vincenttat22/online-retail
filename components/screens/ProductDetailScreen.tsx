'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/context/ThemeContext'
import { CATEGORIES, toneFor } from '@/lib/tokens'
import CVPlaceholder from '@/components/ui/CVPlaceholder'
import CVDiscBadge from '@/components/ui/CVDiscBadge'
import CVProductCard from '@/components/ui/CVProductCard'
import CVCountdown from '@/components/ui/CVCountdown'
import CVWeChatCTA from '@/components/ui/CVWeChatCTA'
import CVIcon from '@/components/ui/CVIcon'
import type { Product } from '@/lib/types'

const COUNTDOWN_TARGET = Date.now() + 6 * 3600 * 1000 + 12 * 60 * 1000

interface ProductDetailScreenProps {
  product: Product
  relatedProducts: Product[]
}

export default function ProductDetailScreen({ product: p, relatedProducts: related }: ProductDetailScreenProps) {
  const { theme, fx } = useTheme()
  const router = useRouter()
  const final = p.disc ? Math.round(p.price * (100 - p.disc)) / 100 : p.price
  const [imgIdx, setImgIdx] = useState(0)
  const catData = CATEGORIES.find((c) => c.id === p.cat)
  const images = p.images || []
  const currentImage = images[imgIdx]
  const maxImages = Math.max(images.length, 4)

  return (
    <div className="pb-32 md:pb-0 animate-cv-fade">

      {/* ── BREADCRUMB (desktop/tablet only) ── */}
      <div className="hidden md:flex items-center gap-1.5 text-[12px] px-6 xl:px-10 pt-6 xl:pt-9 mb-5" style={{ color: theme.inkMuted }}>
        <Link href="/" className="hover:underline" style={{ color: 'inherit' }}>首页</Link>
        <CVIcon name="chev-r" size={11} />
        {p.cat && catData ? (
          <>
            <Link href={`/catalogue?cat=${p.cat}`} className="hover:underline" style={{ color: 'inherit' }}>{catData.zh}</Link>
            <CVIcon name="chev-r" size={11} />
          </>
        ) : (
          <>
            <Link href="/catalogue" className="hover:underline" style={{ color: 'inherit' }}>全部商品</Link>
            <CVIcon name="chev-r" size={11} />
          </>
        )}
        <span style={{ color: theme.ink }}>{p.zh}</span>
      </div>

      {/*
       * Content grid: single column on mobile, 2-col on md+.
       * Gallery is the left column on desktop, info is the right.
       */}
      <div className="md:grid md:grid-cols-[1fr_1fr] xl:grid-cols-[1.1fr_1fr] md:gap-6 xl:gap-12 md:px-6 xl:px-10 md:pb-9">

        {/* ── GALLERY ── */}
        <div>
          {/* Main image */}
          <div className="relative md:rounded-[18px] md:overflow-hidden">
            {currentImage ? (
              <img
                src={`/api/products/${p.id}/images/${currentImage.id}`}
                alt={currentImage.altText || p.zh}
                className="w-full aspect-square object-cover bg-gray-200"
              />
            ) : (
              <CVPlaceholder label={`${p.en} · ${imgIdx + 1}/${maxImages}`} tone={toneFor(p.id + imgIdx)} ratio={1} />
            )}

            {/* Mobile nav overlay */}
            <div className="md:hidden absolute top-14 left-4">
              <Link href="/" className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)', color: theme.ink }}>
                <CVIcon name="chev-l" size={18} />
              </Link>
            </div>
            <div className="md:hidden absolute top-14 right-4 flex gap-2">
              <button className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)', color: theme.ink }}>
                <CVIcon name="heart" size={18} />
              </button>
              <button className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)', color: theme.ink }}>
                <CVIcon name="cart" size={18} />
              </button>
            </div>

            {/* Mobile image dots */}
            {images.length > 0 && (
              <div className="md:hidden absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                {images.map((_, i) => (
                  <button key={i} onClick={() => setImgIdx(i)} className="h-1.5 rounded-full border-0 p-0 cursor-pointer transition-all duration-200"
                    style={{ width: i === imgIdx ? 18 : 6, background: i === imgIdx ? theme.ink : 'rgba(255,255,255,0.85)' }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Desktop thumbnail strip */}
          {images.length > 0 && (
            <div className="hidden md:grid gap-2 mt-3" style={{ gridTemplateColumns: `repeat(${Math.min(images.length, 4)}, 1fr)` }}>
              {images.slice(0, 4).map((img, i) => (
                <button key={i} onClick={() => setImgIdx(i)} className="p-0 rounded-[10px] overflow-hidden cursor-pointer bg-transparent"
                  style={{ border: i === imgIdx ? `2px solid ${theme.ink}` : `1px solid ${theme.line}` }}
                >
                  <img
                    src={`/api/products/${p.id}/images/${img.id}`}
                    alt={img.altText || `${p.zh} - ${i + 1}`}
                    className="w-full aspect-square object-cover bg-gray-200"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── PRODUCT INFO ── */}
        <div className="px-4 pt-5 md:px-0 md:pt-0">
          {/* Badges */}
          <div className="flex items-center gap-1.5 flex-wrap mb-2">
            {p.disc > 0 && <CVDiscBadge pct={p.disc} fx={fx} urgent={p.disc >= 25} />}
            {p.badge && (
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide" style={{ background: theme.goldSoft, color: theme.gold }}>{p.badge}</span>
            )}
            <span className="font-mono text-[9px] tracking-[1px]" style={{ color: theme.inkMuted }}>SKU·CV{String(p.id).padStart(4, '0')}</span>
          </div>

          <h1 className="m-0 font-serif font-extrabold leading-snug tracking-tight text-[22px] md:text-[28px] xl:text-[36px]" style={{ color: theme.ink }}>{p.zh}</h1>
          <div className="font-sans text-xs md:text-[14px] mt-1 tracking-wide" style={{ color: theme.inkMuted }}>{p.en}</div>

          {/* Price block */}
          <div className="mt-3.5 p-3.5 md:p-5 rounded-2xl" style={{ background: theme.surface, border: `0.5px solid ${theme.line}` }}>
            <div className="flex items-baseline gap-2 md:gap-2.5">
              <span className="font-sans font-bold leading-none tracking-tight" style={{ color: theme.accent, fontSize: 'clamp(24px, 3vw, 40px)', letterSpacing: '-0.5px' }}>
                <span style={{ fontSize: '0.5em' }}>$</span>{final}
              </span>
              {p.disc > 0 && <span className="font-sans text-[13px] md:text-[15px] line-through" style={{ color: theme.inkMuted }}>${p.price}</span>}
              <span className="text-[11px] md:text-[12px]" style={{ color: theme.inkMuted }}>{p.unit}</span>
            </div>
            {fx.countdown && p.disc > 0 && (
              <div className="mt-2 md:mt-3 flex items-center gap-1.5 md:gap-2">
                <span className="text-[10px] md:text-[11px]" style={{ color: theme.inkSoft }}>距活动结束</span>
                <CVCountdown targetMs={COUNTDOWN_TARGET} />
              </div>
            )}
          </div>

          {/* Description */}
          <p className="mt-4 md:mt-5 text-[13px] md:text-[14px] leading-relaxed whitespace-pre-wrap" style={{ color: theme.inkSoft }}>
            {p.desc}
          </p>

          {/* Desktop CTA buttons (inline, not fixed) */}
          <div className="hidden md:flex gap-2.5 mt-5">
            <CVWeChatCTA full label="微信下单咨询" />
          </div>
        </div>
      </div>

      {/* ── RELATED PRODUCTS (shared, responsive grid) ── */}
      <section className="px-4 md:px-6 xl:px-10 mt-6 md:mt-14 xl:mt-16 md:pb-9">
        <div className="font-mono text-[10px] tracking-[1.5px] mb-2.5" style={{ color: theme.inkMuted }}>RELATED · 相关推荐</div>
        <h2 className="m-0 mb-4 font-serif font-extrabold tracking-tight text-xl md:text-[22px] xl:text-[26px]" style={{ color: theme.ink }}>
          你可能也喜欢
        </h2>
        <div className="flex gap-2 overflow-x-auto -mx-4 px-4 cv-scroll-x md:mx-0 md:px-0 md:overflow-visible md:grid md:grid-cols-4 md:gap-3 xl:gap-4">
          {related.map((r) => (
            <div key={r.id} className="flex-none w-[130px] md:w-auto">
              <CVProductCard p={r} fx={fx} tone={toneFor(r.id)} onClick={() => router.push(`/product/${r.id}`)} />
            </div>
          ))}
        </div>
      </section>

      {/* ── MOBILE STICKY CTA (hidden on desktop, desktop uses inline buttons above) ── */}
      <div className="md:hidden fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] px-4 pt-3 pb-8 flex gap-2 z-30" style={{ background: theme.bg, borderTop: `0.5px solid ${theme.line}` }}>
        <button className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: theme.surface, color: theme.ink }}>
          <CVIcon name="cart" size={18} />
        </button>
        <button className="flex-1 px-3.5 rounded-xl text-[13px] font-semibold cursor-pointer" style={{ border: `1.5px solid ${theme.ink}`, background: 'transparent', color: theme.ink }}>
          加入收藏
        </button>
        <CVWeChatCTA label="微信下单" />
      </div>
    </div>
  )
}
