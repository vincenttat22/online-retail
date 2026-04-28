'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/context/ThemeContext'
import { PRODUCTS, BUNDLES } from '@/lib/data'
import { toneFor } from '@/lib/tokens'
import CVPlaceholder from '@/components/ui/CVPlaceholder'
import CVProductCard from '@/components/ui/CVProductCard'
import CVMemberPill from '@/components/ui/CVMemberPill'
import CVCountdown from '@/components/ui/CVCountdown'
import CVWeChatCTA from '@/components/ui/CVWeChatCTA'
import CVIcon from '@/components/ui/CVIcon'

const FLASH_TARGET = Date.now() + 1 * 3600 * 1000 + 47 * 60 * 1000

export default function PromotionsScreen() {
  const { theme, fx } = useTheme()
  const router = useRouter()
  // Mobile shows disc >= 20; desktop shows more (>= 15) to fill the wider grid
  const flashMobile = PRODUCTS.filter((p) => p.disc >= 20)
  const flashDesktop = PRODUCTS.filter((p) => p.disc >= 15)

  return (
    <div className="pb-28 md:pb-0 animate-cv-fade md:px-6 xl:px-10 md:py-6 xl:py-9">

      {/* ── HEADER ── */}
      <div className="px-4 md:px-0 pt-14 md:pt-0 pb-3.5 md:pb-6 flex items-center gap-2.5 md:block">
        {/* Mobile back button */}
        <Link href="/" className="md:hidden w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: theme.surface, color: theme.ink }}>
          <CVIcon name="chev-l" size={16} />
        </Link>
        <div>
          <div className="font-mono text-[10px] tracking-[2px]" style={{ color: theme.inkMuted }}>PROMOTIONS · 优惠</div>
          <h1 className="m-0 font-serif font-black tracking-tight text-[22px] md:text-[32px] xl:text-[44px]" style={{ color: theme.ink, letterSpacing: 'clamp(-0.3px, -0.05em, -1px)' }}>
            限时折扣专区
          </h1>
        </div>
      </div>

      {/* ── FLASH SALE TIMER ── */}
      {fx.bigTimer && (
        <div
          className="mx-4 md:mx-0 mb-5 md:mb-8 px-5 md:px-7 xl:px-11 py-5 md:py-6 xl:py-9 rounded-[22px] md:rounded-3xl flex items-center justify-between gap-4 flex-wrap"
          style={{ background: theme.heroBg, color: theme.heroInk }}
        >
          <div>
            <div className="font-mono text-[9px] md:text-[10px] tracking-[2px] opacity-70">FLASH SALE · 限时闪购</div>
            <div className="font-serif font-extrabold mt-1 tracking-tight text-xl md:text-[24px] xl:text-[32px]">
              整点抢购 · 最高减 30%
            </div>
          </div>
          <div className="flex items-center gap-3 md:gap-3.5">
            <span className="text-[11px] md:text-[13px] opacity-85">距结束</span>
            <CVCountdown targetMs={FLASH_TARGET} big invertColors />
            {fx.flameSparkle && <span className="text-2xl md:text-3xl">🔥</span>}
          </div>
        </div>
      )}

      {/* ── BUNDLES ── */}
      <section className="px-4 md:px-0 mb-8 md:mb-10 xl:mb-12">
        <div className="font-mono text-[10px] tracking-[2px] mb-1" style={{ color: theme.inkMuted }}>BUNDLES · 组合套装</div>
        <h2 className="m-0 mb-4 md:mb-5 font-serif font-extrabold tracking-tight text-xl md:text-[22px] xl:text-[28px]" style={{ color: theme.ink }}>
          套装更划算
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-3.5 xl:gap-[18px]">
          {BUNDLES.map((b) => {
            const items = b.items.map((id) => PRODUCTS.find((p) => p.id === id)).filter(Boolean) as typeof PRODUCTS
            const save = b.orig - b.price
            return (
              <div
                key={b.id}
                className="rounded-[20px] md:rounded-[22px] overflow-hidden"
                style={{ background: theme.surface, border: b.member ? `1px solid ${theme.gold}55` : `0.5px solid ${theme.line}` }}
              >
                {/* Bundle header */}
                <div className="px-4 md:px-5 xl:px-6 py-4 md:py-5 flex justify-between items-start gap-2">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      {b.member && <CVMemberPill small />}
                      <span className="font-mono text-[9px] tracking-[1px]" style={{ color: theme.inkMuted }}>{b.tag.toUpperCase()}</span>
                    </div>
                    <div className="font-serif font-bold leading-snug text-[17px] md:text-[18px] xl:text-[22px]" style={{ color: theme.ink }}>{b.zh}</div>
                    <div className="font-sans text-[11px] md:text-[12px] mt-0.5" style={{ color: theme.inkMuted }}>{b.en}</div>
                  </div>
                  <div className="px-2.5 md:px-3 py-1.5 rounded-lg text-xs md:text-[13px] font-bold whitespace-nowrap" style={{ background: theme.accentSoft, color: theme.accent }}>
                    省 ¥{save}
                  </div>
                </div>

                {/* Items grid */}
                <div
                  className="grid gap-px"
                  style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)`, background: theme.line, paddingLeft: 1, paddingRight: 1 }}
                >
                  {items.map((it) => (
                    <div key={it.id} className="p-2.5" style={{ background: theme.surface }}>
                      <CVPlaceholder label="" tone={toneFor(it.id)} ratio={1} rounded />
                      <div className="text-[10px] md:text-[11px] mt-1.5 leading-snug line-clamp-2" style={{ color: theme.ink }}>{it.zh}</div>
                    </div>
                  ))}
                </div>

                {/* Bundle footer */}
                <div className="px-4 md:px-5 xl:px-6 py-3.5 md:py-4 flex justify-between items-center" style={{ borderTop: `0.5px solid ${theme.line}` }}>
                  <div>
                    <span className="font-sans font-bold text-[22px] md:text-[22px] xl:text-[28px]" style={{ color: theme.accent }}>¥{b.price}</span>
                    <span className="font-sans text-xs md:text-[13px] line-through ml-2" style={{ color: theme.inkMuted }}>¥{b.orig}</span>
                  </div>
                  <CVWeChatCTA label="询单" />
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── FLASH DEALS GRID (shared, responsive columns) ── */}
      <section className="px-4 md:px-0">
        <div className="font-mono text-[10px] tracking-[2px] mb-1" style={{ color: theme.inkMuted }}>FLASH · 单品折扣</div>
        <h2 className="m-0 mb-4 md:mb-5 font-serif font-extrabold tracking-tight text-xl md:text-[22px] xl:text-[28px]" style={{ color: theme.ink }}>
          今日特价
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2.5 md:gap-3 xl:gap-4">
          {/* Mobile shows fewer items; desktop shows all disc >= 15 */}
          {(flashDesktop).map((p) => (
            <CVProductCard key={p.id} p={p} fx={fx} tone={toneFor(p.id)} onClick={() => router.push(`/product/${p.id}`)} />
          ))}
        </div>
      </section>
    </div>
  )
}
