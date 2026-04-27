'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/context/ThemeContext'
import { PRODUCTS, BUNDLES } from '@/lib/data'
import { toneFor } from '@/lib/tokens'
import CVPlaceholder from '@/components/ui/CVPlaceholder'
import CVProductCard from '@/components/ui/CVProductCard'
import CVSection from '@/components/ui/CVSection'
import CVMemberPill from '@/components/ui/CVMemberPill'
import CVCountdown from '@/components/ui/CVCountdown'
import CVWeChatCTA from '@/components/ui/CVWeChatCTA'
import CVIcon from '@/components/ui/CVIcon'

const FLASH_TARGET = Date.now() + 1 * 3600 * 1000 + 47 * 60 * 1000

export default function PromotionsScreen() {
  const { theme, fx } = useTheme()
  const router = useRouter()
  const flash = PRODUCTS.filter((p) => p.disc >= 20)

  return (
    <div className="pb-28 animate-cv-fade">
      {/* Header */}
      <div className="px-4 pt-14 pb-3.5 flex items-center gap-2.5">
        <Link
          href="/"
          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
          style={{ background: theme.surface, color: theme.ink }}
        >
          <CVIcon name="chev-l" size={16} />
        </Link>
        <div>
          <div className="font-mono text-[10px] tracking-[2px]" style={{ color: theme.inkMuted }}>
            PROMOTIONS · 优惠
          </div>
          <h1
            className="m-0 font-serif text-[22px] font-extrabold tracking-tight"
            style={{ color: theme.ink }}
          >
            限时折扣专区
          </h1>
        </div>
      </div>

      {/* Big flash-sale timer */}
      {fx.bigTimer && (
        <div
          className="mx-4 mb-5 p-5 rounded-[22px] overflow-hidden relative"
          style={{ background: theme.heroBg, color: theme.heroInk }}
        >
          <div className="flex justify-between items-start">
            <div>
              <div className="font-mono text-[9px] tracking-[2px] opacity-70">FLASH SALE · 限时闪购</div>
              <div className="font-serif text-xl font-bold mt-1">整点抢购 · 最高减 30%</div>
            </div>
            {fx.flameSparkle && <span className="text-2xl">🔥</span>}
          </div>
          <div className="mt-3.5 flex items-center gap-2">
            <span className="text-[11px] opacity-85">距结束</span>
            <CVCountdown targetMs={FLASH_TARGET} big invertColors />
          </div>
        </div>
      )}

      {/* Bundles */}
      <CVSection kicker="BUNDLES · 组合套装" title="套装更划算" className="mb-2">
        <div className="flex flex-col gap-3">
          {BUNDLES.map((b) => {
            const items = b.items
              .map((id) => PRODUCTS.find((p) => p.id === id))
              .filter(Boolean) as typeof PRODUCTS
            const save = b.orig - b.price
            return (
              <div
                key={b.id}
                className="rounded-[20px] overflow-hidden"
                style={{
                  background: theme.surface,
                  border: b.member ? `1px solid ${theme.gold}55` : 'none',
                }}
              >
                {/* Bundle header */}
                <div className="px-4 py-4 flex justify-between items-start gap-2">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      {b.member && <CVMemberPill small />}
                      <span className="font-mono text-[9px] tracking-[1px]" style={{ color: theme.inkMuted }}>
                        {b.tag.toUpperCase()}
                      </span>
                    </div>
                    <div className="font-serif text-[17px] font-bold leading-snug" style={{ color: theme.ink }}>
                      {b.zh}
                    </div>
                    <div className="font-sans text-[11px] mt-0.5" style={{ color: theme.inkMuted }}>
                      {b.en}
                    </div>
                  </div>
                  <div
                    className="px-2.5 py-1.5 rounded-lg font-sans text-xs font-bold whitespace-nowrap"
                    style={{ background: theme.accentSoft, color: theme.accent }}
                  >
                    省 ¥{save}
                  </div>
                </div>

                {/* Items grid */}
                <div
                  className="grid gap-px"
                  style={{
                    gridTemplateColumns: `repeat(${items.length}, 1fr)`,
                    background: theme.line,
                    paddingLeft: 1,
                    paddingRight: 1,
                  }}
                >
                  {items.map((it) => (
                    <div key={it.id} className="p-2.5" style={{ background: theme.surface }}>
                      <CVPlaceholder label="" tone={toneFor(it.id)} ratio={1} rounded />
                      <div
                        className="text-[10px] mt-1.5 leading-snug line-clamp-2"
                        style={{ color: theme.ink }}
                      >
                        {it.zh}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bundle footer */}
                <div className="px-4 py-3.5 flex justify-between items-center">
                  <div>
                    <span
                      className="font-sans text-[22px] font-bold"
                      style={{ color: theme.accent }}
                    >
                      ¥{b.price}
                    </span>
                    <span
                      className="font-sans text-xs line-through ml-2"
                      style={{ color: theme.inkMuted }}
                    >
                      ¥{b.orig}
                    </span>
                  </div>
                  <CVWeChatCTA label="询单" />
                </div>
              </div>
            )
          })}
        </div>
      </CVSection>

      {/* Flash sale singles */}
      <CVSection kicker="FLASH · 单品折扣" title="今日特价" className="mt-7">
        <div className="grid grid-cols-2 gap-2.5">
          {flash.map((p) => (
            <CVProductCard
              key={p.id}
              p={p}
              fx={fx}
              tone={toneFor(p.id)}
              onClick={() => router.push(`/product/${p.id}`)}
            />
          ))}
        </div>
      </CVSection>
    </div>
  )
}
