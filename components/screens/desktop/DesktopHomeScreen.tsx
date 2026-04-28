'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/context/ThemeContext'
import { PRODUCTS, BUNDLES } from '@/lib/data'
import { toneFor } from '@/lib/tokens'
import CVPlaceholder from '@/components/ui/CVPlaceholder'
import CVProductCard from '@/components/ui/CVProductCard'
import CVDiscBadge from '@/components/ui/CVDiscBadge'
import CVPriceTag from '@/components/ui/CVPriceTag'
import CVMemberPill from '@/components/ui/CVMemberPill'
import CVCountdown from '@/components/ui/CVCountdown'
import CVWeChatCTA from '@/components/ui/CVWeChatCTA'
import CVIcon from '@/components/ui/CVIcon'

const HERO_TARGET = Date.now() + 2 * 3600 * 1000 + 47 * 60 * 1000

export default function DesktopHomeScreen() {
  const { theme, fx } = useTheme()
  const router = useRouter()
  const featured = PRODUCTS.slice(0, 8)

  return (
    <div>
      {/* ── HERO ── */}
      <section className="px-6 xl:px-10 pt-8 xl:pt-9 grid grid-cols-[1fr_0.85fr] xl:grid-cols-[1.2fr_1fr] gap-4 xl:gap-6">
        {/* Big hero tile */}
        <div
          className="rounded-3xl overflow-hidden px-7 xl:px-11 py-8 xl:py-12 relative flex flex-col justify-between min-h-[320px] xl:min-h-[420px]"
          style={{ background: theme.heroBg, color: theme.heroInk }}
        >
          <div>
            <div className="font-mono text-[11px] tracking-[2.5px] opacity-70">
              本周精选 · WK 17 / 26
            </div>
            <h1
              className="font-serif font-black leading-[0.95] tracking-[-1.5px] mt-3.5 mb-0"
              style={{ fontSize: 'clamp(40px, 5vw, 72px)' }}
            >
              春日<br />暖心
              <span className="italic font-normal opacity-85"> 礼遇</span>
            </h1>
            <p className="text-[14px] opacity-80 leading-relaxed mt-4 max-w-sm">
              家居 · 零食 · 美妆 — 严选好物，限时 8 折起。会员加微信客服解锁更多专属优惠。
            </p>
          </div>
          <div className="flex gap-2.5 mt-6">
            <Link
              href="/promotions"
              className="inline-flex items-center gap-1.5 px-5 py-3 rounded-full text-[13px] font-semibold"
              style={{ background: theme.heroInk, color: theme.heroBg }}
            >
              查看优惠 <CVIcon name="chev-r" size={14} />
            </Link>
            <Link
              href="/catalogue"
              className="px-5 py-3 rounded-full text-[13px] font-medium"
              style={{
                background: 'transparent',
                color: theme.heroInk,
                border: `1.5px solid ${theme.heroInk}55`,
              }}
            >
              浏览商品
            </Link>
          </div>
          <div
            className="absolute top-5 right-5 font-mono text-[10px] tracking-[1px] opacity-50"
          >
            SS·26 / VOL.04
          </div>
        </div>

        {/* 2 featured product tiles */}
        <div className="grid grid-rows-2 gap-4 xl:gap-6">
          {[PRODUCTS[1], PRODUCTS[6]].map((p, i) => (
            <button
              key={p.id}
              onClick={() => router.push(`/product/${p.id}`)}
              className="rounded-3xl overflow-hidden cursor-pointer text-left p-0 border-0 grid grid-cols-[1fr_1.1fr]"
              style={{ background: theme.surface }}
            >
              <div className="px-5 xl:px-6 py-5 xl:py-6 flex flex-col justify-between">
                <div>
                  <div className="flex gap-1.5 mb-2">
                    {p.disc > 0 && <CVDiscBadge pct={p.disc} fx={fx} />}
                    {p.badge && (
                      <span className="text-[10px] font-semibold tracking-wide" style={{ color: theme.gold }}>
                        · {p.badge}
                      </span>
                    )}
                  </div>
                  <div
                    className="font-serif font-bold leading-snug tracking-tight text-[18px] xl:text-[22px]"
                    style={{ color: theme.ink }}
                  >
                    {p.zh}
                  </div>
                  <div className="font-sans text-[11px] mt-1" style={{ color: theme.inkMuted }}>
                    {p.en}
                  </div>
                </div>
                <CVPriceTag price={p.price} disc={p.disc} />
              </div>
              <CVPlaceholder label={p.en} tone={i === 0 ? 'e' : 'b'} ratio={1} />
            </button>
          ))}
        </div>
      </section>

      {/* ── SALE STRIP ── */}
      {fx.saleStrip && (
        <section className="px-6 xl:px-10 pt-6 xl:pt-7">
          <div
            className="px-5 py-3.5 rounded-2xl flex items-center justify-between gap-4"
            style={{
              background: theme.accentSoft,
              color: theme.accent,
              border: `0.5px solid ${theme.accent}33`,
            }}
          >
            <div className="flex items-center gap-3">
              {fx.flameSparkle ? (
                <span className="text-xl">🔥</span>
              ) : (
                <CVIcon name="spark" size={16} />
              )}
              <div className="text-sm font-semibold">限时闪购 · 全场最高减 30% · 整点开抢</div>
            </div>
            <div className="flex items-center gap-2.5">
              {fx.countdown && <CVCountdown targetMs={HERO_TARGET} />}
              <Link
                href="/promotions"
                className="px-3.5 py-1.5 rounded-full text-xs font-semibold"
                style={{ background: theme.accent, color: theme.accentInk }}
              >
                立即抢购
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── WEEKLY FEATURED ── */}
      <section className="px-6 xl:px-10 pt-10 xl:pt-12">
        <header className="flex items-end justify-between mb-4">
          <div>
            <div className="font-mono text-[10px] tracking-[2px]" style={{ color: theme.inkMuted }}>
              WEEKLY FEATURED · 本周精选
            </div>
            <h2
              className="m-0 mt-1 font-serif font-extrabold tracking-tight text-[24px] xl:text-[30px]"
              style={{ color: theme.ink }}
            >
              本周值得入手
            </h2>
          </div>
          <Link
            href="/catalogue"
            className="inline-flex items-center gap-1 text-[13px]"
            style={{ color: theme.inkSoft }}
          >
            查看全部 <CVIcon name="chev-r" size={12} />
          </Link>
        </header>
        <div className="grid grid-cols-3 xl:grid-cols-4 gap-3 xl:gap-4">
          {featured.map((p) => (
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

      {/* ── BUNDLES ── */}
      <section className="px-6 xl:px-10 pt-10 xl:pt-12">
        <header className="flex items-end justify-between mb-4">
          <div>
            <div className="font-mono text-[10px] tracking-[2px]" style={{ color: theme.inkMuted }}>
              BUNDLES · 组合套装
            </div>
            <h2
              className="m-0 mt-1 font-serif font-extrabold tracking-tight text-[24px] xl:text-[30px]"
              style={{ color: theme.ink }}
            >
              组合更划算
            </h2>
          </div>
        </header>
        <div className="grid grid-cols-3 gap-3 xl:gap-4">
          {BUNDLES.map((b) => {
            const items = b.items.map((id) => PRODUCTS.find((p) => p.id === id)).filter(Boolean) as typeof PRODUCTS
            const save = b.orig - b.price
            return (
              <Link
                key={b.id}
                href="/promotions"
                className="rounded-[20px] overflow-hidden flex flex-col"
                style={{
                  background: theme.surface,
                  border: b.member ? `1px solid ${theme.gold}55` : `1px solid ${theme.line}`,
                }}
              >
                <div className="px-4 xl:px-5 py-4 xl:py-5 flex justify-between items-start gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      {b.member && <CVMemberPill small />}
                      <span className="font-mono text-[9px] tracking-[1px]" style={{ color: theme.inkMuted }}>
                        {b.tag}
                      </span>
                    </div>
                    <div
                      className="font-serif font-bold leading-snug text-[16px] xl:text-[18px]"
                      style={{ color: theme.ink }}
                    >
                      {b.zh}
                    </div>
                  </div>
                  <span
                    className="px-2 py-1 rounded-md text-[11px] font-bold whitespace-nowrap"
                    style={{ background: theme.accentSoft, color: theme.accent }}
                  >
                    省 ¥{save}
                  </span>
                </div>

                <div
                  className="grid gap-px"
                  style={{
                    gridTemplateColumns: `repeat(${items.length}, 1fr)`,
                    background: theme.line,
                  }}
                >
                  {items.map((it) => (
                    <div key={it.id} className="p-2" style={{ background: theme.surface }}>
                      <CVPlaceholder label="" tone={toneFor(it.id)} ratio={1} rounded />
                    </div>
                  ))}
                </div>

                <div
                  className="px-4 xl:px-5 py-3 xl:py-3.5 flex justify-between items-center"
                  style={{ borderTop: `0.5px solid ${theme.line}` }}
                >
                  <div>
                    <span
                      className="font-sans font-bold text-[18px] xl:text-[22px]"
                      style={{ color: theme.accent }}
                    >
                      ¥{b.price}
                    </span>
                    <span
                      className="font-sans text-xs line-through ml-1.5"
                      style={{ color: theme.inkMuted }}
                    >
                      ¥{b.orig}
                    </span>
                  </div>
                  <CVIcon name="chev-r" size={16} stroke={theme.inkSoft} />
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* ── WECHAT MEMBERSHIP STRIP ── */}
      <section className="px-6 xl:px-10 pt-10 xl:pt-12">
        <div
          className="px-7 xl:px-10 py-6 xl:py-8 rounded-[22px] flex items-center justify-between gap-6 flex-wrap"
          style={{ background: theme.surface, border: `0.5px solid ${theme.line}` }}
        >
          <div className="flex-1 min-w-[280px]">
            <div className="font-mono text-[10px] tracking-[2px]" style={{ color: theme.inkMuted }}>
              MEMBERSHIP · 会员
            </div>
            <div
              className="font-serif font-extrabold tracking-tight mt-1 text-[22px] xl:text-[28px]"
              style={{ color: theme.ink }}
            >
              会员专享更多优惠
            </div>
            <div className="text-[13px] leading-relaxed mt-2 max-w-[480px]" style={{ color: theme.inkSoft }}>
              添加微信客服 · 解锁专属价 · 享免费咨询 · 优先获知新品发布
            </div>
          </div>
          <CVWeChatCTA label="联系微信客服 · 加入会员" />
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        className="px-6 xl:px-10 pt-7 mt-10 xl:mt-12 pb-8 grid grid-cols-2 xl:grid-cols-4 gap-6 text-[12px]"
        style={{ color: theme.inkSoft, borderTop: `0.5px solid ${theme.line}` }}
      >
        <div>
          <div className="font-serif text-base font-extrabold mb-2" style={{ color: theme.ink }}>
            严选小铺
          </div>
          <div className="leading-relaxed">
            专注分享好物的小型反代<br />商铺，主营日用百货、零食<br />茶饮和美妆护肤。
          </div>
        </div>
        <div>
          <div className="font-semibold mb-2" style={{ color: theme.ink }}>购物</div>
          <div className="leading-[1.9]">全部商品<br />优惠专区<br />组合套装<br />会员专享</div>
        </div>
        <div>
          <div className="font-semibold mb-2" style={{ color: theme.ink }}>服务</div>
          <div className="leading-[1.9]">微信下单<br />配送说明<br />退换货<br />常见问题</div>
        </div>
        <div>
          <div className="font-semibold mb-2" style={{ color: theme.ink }}>联系我们</div>
          <div className="leading-[1.9] font-mono text-[11px]">
            WeChat: cv_shop_official<br />Email: hi@cvshop.cn<br />Hours: 09:00 — 21:00
          </div>
        </div>
      </footer>
    </div>
  )
}
