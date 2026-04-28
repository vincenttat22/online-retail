'use client'

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

export default function DesktopPromotionsScreen() {
  const { theme, fx } = useTheme()
  const router = useRouter()
  const flash = PRODUCTS.filter((p) => p.disc >= 15)

  return (
    <div className="px-6 xl:px-10 py-6 xl:py-9">
      {/* Header */}
      <div className="mb-6">
        <div
          className="font-mono text-[10px] tracking-[2px]"
          style={{ color: theme.inkMuted }}
        >
          PROMOTIONS · 优惠
        </div>
        <h1
          className="m-0 mt-1 font-serif font-black tracking-[-1px] text-[32px] xl:text-[44px]"
          style={{ color: theme.ink }}
        >
          限时折扣专区
        </h1>
      </div>

      {/* Flash sale timer banner */}
      {fx.bigTimer && (
        <div
          className="px-7 xl:px-11 py-6 xl:py-9 rounded-3xl flex items-center justify-between gap-6 flex-wrap mb-8"
          style={{ background: theme.heroBg, color: theme.heroInk }}
        >
          <div>
            <div className="font-mono text-[10px] tracking-[2px] opacity-70">
              FLASH SALE · 限时闪购
            </div>
            <div
              className="font-serif font-extrabold mt-1.5 tracking-tight text-[24px] xl:text-[32px]"
            >
              整点抢购 · 最高减 30%
            </div>
          </div>
          <div className="flex items-center gap-3.5">
            <span className="text-[13px] opacity-85">距结束</span>
            <CVCountdown targetMs={FLASH_TARGET} big invertColors />
            {fx.flameSparkle && <span className="text-3xl">🔥</span>}
          </div>
        </div>
      )}

      {/* ── BUNDLES ── */}
      <section className="mb-10 xl:mb-12">
        <h2
          className="m-0 mb-4 xl:mb-5 font-serif font-extrabold tracking-tight text-[22px] xl:text-[28px]"
          style={{ color: theme.ink }}
        >
          组合套装 · Bundles
        </h2>
        <div className="grid grid-cols-3 gap-3.5 xl:gap-[18px]">
          {BUNDLES.map((b) => {
            const items = b.items
              .map((id) => PRODUCTS.find((p) => p.id === id))
              .filter(Boolean) as typeof PRODUCTS
            const save = b.orig - b.price
            return (
              <div
                key={b.id}
                className="rounded-[22px] overflow-hidden"
                style={{
                  background: theme.surface,
                  border: b.member
                    ? `1px solid ${theme.gold}55`
                    : `0.5px solid ${theme.line}`,
                }}
              >
                {/* Bundle header */}
                <div className="px-5 xl:px-6 py-4.5 xl:py-5.5 flex justify-between items-start gap-2 pt-5 pb-5">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      {b.member && <CVMemberPill small />}
                      <span
                        className="font-mono text-[9px] tracking-[1px]"
                        style={{ color: theme.inkMuted }}
                      >
                        {b.tag.toUpperCase()}
                      </span>
                    </div>
                    <div
                      className="font-serif font-bold leading-snug text-[18px] xl:text-[22px]"
                      style={{ color: theme.ink }}
                    >
                      {b.zh}
                    </div>
                    <div
                      className="font-sans text-[12px] mt-0.5"
                      style={{ color: theme.inkMuted }}
                    >
                      {b.en}
                    </div>
                  </div>
                  <div
                    className="px-3 py-1.5 rounded-lg text-[13px] font-bold whitespace-nowrap"
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
                        className="text-[11px] mt-1.5 leading-snug line-clamp-2"
                        style={{ color: theme.ink }}
                      >
                        {it.zh}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bundle footer */}
                <div
                  className="px-5 xl:px-6 py-4 flex justify-between items-center"
                  style={{ borderTop: `0.5px solid ${theme.line}` }}
                >
                  <div>
                    <span
                      className="font-sans font-bold text-[22px] xl:text-[28px]"
                      style={{ color: theme.accent }}
                    >
                      ¥{b.price}
                    </span>
                    <span
                      className="font-sans text-[13px] line-through ml-2"
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
      </section>

      {/* ── FLASH DEALS ── */}
      <section>
        <h2
          className="m-0 mb-4 xl:mb-5 font-serif font-extrabold tracking-tight text-[22px] xl:text-[28px]"
          style={{ color: theme.ink }}
        >
          今日特价 · Flash Deals
        </h2>
        <div className="grid grid-cols-3 xl:grid-cols-4 gap-3 xl:gap-4">
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
      </section>
    </div>
  )
}
