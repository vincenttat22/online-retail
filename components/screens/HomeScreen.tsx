'use client'

import Image from 'next/image'
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
import CVSection from '@/components/ui/CVSection'
import CVWeChatCTA from '@/components/ui/CVWeChatCTA'
import CVIcon from '@/components/ui/CVIcon'

const HERO_TARGET = Date.now() + 2 * 3600 * 1000 + 47 * 60 * 1000

export default function HomeScreen() {
  const { theme, fx } = useTheme()
  const router = useRouter()
  const weekly = PRODUCTS.slice(0, 8)
  const top = PRODUCTS.find((p) => p.disc >= 25) ?? PRODUCTS[0]

  return (
    <div className="pb-28 md:pb-0 animate-cv-fade">

      {/* ── MOBILE HEADER (hidden on md+, desktop uses CVTopNav in layout) ── */}
      <div className="md:hidden px-4 pt-14 pb-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 drop-shadow-md">
          <Image
            src="/CV-logo-white.svg"
            alt="CV Shop"
            width={40}
            height={40}
            priority
          />
        </Link>
        <div className="flex gap-2">
          <Link href="/catalogue" className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: theme.surface, color: theme.ink }}>
            <CVIcon name="search" size={18} />
          </Link>
          <button className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: theme.surface, color: theme.ink }}>
            <CVIcon name="bell" size={18} />
          </button>
          <button className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: theme.surface, color: theme.ink }}>
            <CVIcon name="cart" size={18} />
          </button>
        </div>
      </div>

      {/* ── MOBILE HERO ── */}
      <div
        className="md:hidden mx-4 mb-5 rounded-3xl overflow-hidden"
        style={{ background: theme.heroBg, color: theme.heroInk }}
      >
        <div className="grid grid-cols-[1.1fr_1fr]">
          <div className="p-5 flex flex-col gap-2.5">
            <span className="font-mono text-[9px] tracking-[2px] opacity-70">本周精选 · WK 17</span>
            <div className="font-serif text-2xl font-black leading-snug tracking-tight">
              春日<br />暖心<br /><span className="italic font-normal">礼遇</span>
            </div>
            <div className="text-[11px] opacity-85 leading-relaxed">家居 · 零食 · 美妆<br />限时 8 折起</div>
            <Link href="/promotions" className="inline-flex items-center gap-1 self-start px-3.5 py-2 rounded-full text-xs font-semibold mt-1" style={{ background: theme.heroInk, color: theme.heroBg }}>
              查看优惠 <CVIcon name="chev-r" size={12} />
            </Link>
          </div>
          <div className="relative">
            <CVPlaceholder label="hero · 主视觉" tone="d" ratio={1} />
            <div className="absolute bottom-2.5 right-2.5 px-2 py-1 rounded font-mono text-[9px] tracking-wide" style={{ background: 'rgba(255,255,255,0.9)', color: theme.ink }}>SS·26</div>
          </div>
        </div>
      </div>

      {/* ── DESKTOP / TABLET HERO ── */}
      <section className="hidden md:grid grid-cols-[1fr_0.85fr] xl:grid-cols-[1.2fr_1fr] gap-4 xl:gap-6 px-6 xl:px-10 pt-8 xl:pt-9">
        {/* Big editorial card */}
        <div
          className="rounded-3xl overflow-hidden px-7 xl:px-11 py-8 xl:py-12 relative flex flex-col justify-between min-h-[320px] xl:min-h-[420px]"
          style={{ background: theme.heroBg, color: theme.heroInk }}
        >
          <div>
            <div className="font-mono text-[11px] tracking-[2.5px] opacity-70">本周精选 · WK 17 / 26</div>
            <h1 className="font-serif font-black leading-[0.95] tracking-[-1.5px] mt-3.5 mb-0" style={{ fontSize: 'clamp(40px, 5vw, 72px)' }}>
              春日<br />暖心<span className="italic font-normal opacity-85"> 礼遇</span>
            </h1>
            <p className="text-[14px] opacity-80 leading-relaxed mt-4 max-w-sm">
              家居 · 零食 · 美妆 — 严选好物，限时 8 折起。会员加微信客服解锁更多专属优惠。
            </p>
          </div>
          <div className="flex gap-2.5 mt-6">
            <Link href="/promotions" className="inline-flex items-center gap-1.5 px-5 py-3 rounded-full text-[13px] font-semibold" style={{ background: theme.heroInk, color: theme.heroBg }}>
              查看优惠 <CVIcon name="chev-r" size={14} />
            </Link>
            <Link href="/catalogue" className="px-5 py-3 rounded-full text-[13px] font-medium" style={{ background: 'transparent', color: theme.heroInk, border: `1.5px solid ${theme.heroInk}55` }}>
              浏览商品
            </Link>
          </div>
          <div className="absolute top-5 right-5 font-mono text-[10px] tracking-[1px] opacity-50">SS·26 / VOL.04</div>
        </div>

        {/* Two featured product tiles */}
        <div className="grid grid-rows-2 gap-4 xl:gap-6">
          {[PRODUCTS[1], PRODUCTS[6]].map((p, i) => (
            <button key={p.id} onClick={() => router.push(`/product/${p.id}`)} className="rounded-3xl overflow-hidden cursor-pointer text-left p-0 border-0 grid grid-cols-[1fr_1.1fr]" style={{ background: theme.surface }}>
              <div className="px-5 xl:px-6 py-5 xl:py-6 flex flex-col justify-between">
                <div>
                  <div className="flex gap-1.5 mb-2">
                    {p.disc > 0 && <CVDiscBadge pct={p.disc} fx={fx} />}
                    {p.badge && <span className="text-[10px] font-semibold tracking-wide" style={{ color: theme.gold }}>· {p.badge}</span>}
                  </div>
                  <div className="font-serif font-bold leading-snug tracking-tight text-[18px] xl:text-[22px]" style={{ color: theme.ink }}>{p.zh}</div>
                  <div className="font-sans text-[11px] mt-1" style={{ color: theme.inkMuted }}>{p.en}</div>
                </div>
                <CVPriceTag price={p.price} disc={p.disc} />
              </div>
              <CVPlaceholder label={p.en} tone={i === 0 ? 'e' : 'b'} ratio={1} />
            </button>
          ))}
        </div>
      </section>

      {/* ── SALE STRIP (shared, responsive) ── */}
      {fx.saleStrip && (
        <div
          className="mx-4 md:mx-6 xl:mx-10 mb-5 md:mb-0 md:mt-6 xl:mt-7 px-3.5 md:px-5 py-2.5 md:py-3.5 rounded-2xl flex items-center justify-between gap-2"
          style={{ background: theme.accentSoft, color: theme.accent, border: `0.5px solid ${theme.accent}33` }}
        >
          <div className="flex items-center gap-2 md:gap-3">
            {fx.flameSparkle ? <span className="text-base md:text-xl">🔥</span> : <CVIcon name="spark" size={16} />}
            <div className="text-xs md:text-sm font-semibold">限时闪购 · 全场最高减 30%<span className="hidden md:inline"> · 整点开抢</span></div>
          </div>
          <div className="flex items-center gap-2">
            {fx.countdown && <CVCountdown targetMs={HERO_TARGET} />}
            <Link href="/promotions" className="hidden md:inline-flex px-3.5 py-1.5 rounded-full text-xs font-semibold" style={{ background: theme.accent, color: theme.accentInk }}>
              立即抢购
            </Link>
          </div>
        </div>
      )}

      {/* ── CATEGORY ICONS (mobile only, desktop has full top nav) ── */}
      <div className="md:hidden px-4 pb-6 grid grid-cols-4 gap-2">
        {[
          { id: 'snack',  zh: '零食', tone: 'b' as const },
          { id: 'beauty', zh: '美妆', tone: 'e' as const },
          { id: 'daily',  zh: '日用', tone: 'f' as const },
          { id: 'all',    zh: '全部', tone: 'c' as const },
        ].map((c) => (
          <Link key={c.id} href={`/catalogue?cat=${c.id}`} className="flex flex-col items-center gap-1.5">
            <div className="w-14 h-14"><CVPlaceholder label="" tone={c.tone} ratio={1} rounded /></div>
            <span className="text-[11px] font-medium" style={{ color: theme.ink }}>{c.zh}</span>
          </Link>
        ))}
      </div>

      {/* ── WEEKLY FEATURED (shared, responsive) ── */}
      <div className="md:px-6 xl:px-10 md:pt-10 xl:pt-12">
        <CVSection kicker="WEEKLY FEATURED" title="本周精选" action="全部" onAction={() => router.push('/catalogue')} className="md:px-0">
          {/* Mobile: horizontal carousel */}
          <div className="md:hidden flex gap-2.5 overflow-x-auto -mx-4 px-4 pb-1 cv-scroll-x snap-x-mandatory">
            {weekly.map((p) => (
              <div key={p.id} className="flex-none w-[150px] snap-start">
                <CVProductCard p={p} fx={fx} tone={toneFor(p.id)} onClick={() => router.push(`/product/${p.id}`)} />
              </div>
            ))}
          </div>
          {/* Tablet/Desktop: grid */}
          <div className="hidden md:grid grid-cols-3 xl:grid-cols-4 gap-3 xl:gap-4">
            {weekly.map((p) => (
              <CVProductCard key={p.id} p={p} fx={fx} tone={toneFor(p.id)} onClick={() => router.push(`/product/${p.id}`)} />
            ))}
          </div>
        </CVSection>
      </div>

      {/* ── EDITORIAL DEAL OF THE DAY (mobile only, desktop uses featured tiles in hero) ── */}
      <div className="md:hidden px-4 pt-6">
        <Link href={`/product/${top.id}`} className="block rounded-[22px] overflow-hidden" style={{ background: theme.surface }}>
          <div className="relative">
            <CVPlaceholder label={`editorial · ${top.en}`} tone="b" ratio={1.6} />
            <div className="absolute inset-0 p-4 flex flex-col justify-end" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.55), transparent 55%)', color: '#fff' }}>
              <div className="font-mono text-[9px] tracking-[2px] opacity-80">FEATURED · DEAL OF THE DAY</div>
              <div className="font-serif text-[22px] font-bold mt-1 tracking-tight">{top.zh}</div>
              <div className="flex items-center gap-2.5 mt-2">
                <span className="px-2.5 py-1 rounded font-sans text-xs font-bold" style={{ background: theme.accent, color: theme.accentInk }}>−{top.disc}%</span>
                <span className="font-sans text-[18px] font-semibold">${Math.round(top.price * (100 - top.disc)) / 100}</span>
                <span className="font-sans text-[13px] opacity-70 line-through">${top.price}</span>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* ── BUNDLES (shared, responsive) ── */}
      <div className="md:px-6 xl:px-10 md:pt-10 xl:pt-12">
        <CVSection kicker="BUNDLES · 组合套装" title="组合更划算" action="全部" onAction={() => router.push('/promotions')} className="mt-7 md:mt-0 md:px-0">
          {/* Mobile: stacked list */}
          <div className="md:hidden flex flex-col gap-2.5">
            {BUNDLES.slice(0, 2).map((b) => (
              <Link key={b.id} href="/promotions" className="flex items-center gap-3 p-3 rounded-[18px]" style={{ background: theme.surface }}>
                <div className="w-[78px] h-[78px] shrink-0">
                  <CVPlaceholder label={b.tag} tone={b.theme === 'BEAUTY_HEALTH' ? 'e' : b.theme === 'SNACKS' ? 'b' : 'f'} ratio={1} rounded />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex gap-1.5 mb-1">
                    {b.member && <CVMemberPill small />}
                    <span className="font-mono text-[9px] tracking-[1px]" style={{ color: theme.inkMuted }}>{b.tag}</span>
                  </div>
                  <div className="font-serif text-[15px] font-bold leading-snug" style={{ color: theme.ink }}>{b.zh}</div>
                  <div className="flex gap-1.5 items-baseline mt-1">
                    <span className="font-sans text-base font-bold" style={{ color: theme.accent }}>${b.price}</span>
                    <span className="font-sans text-[11px] line-through" style={{ color: theme.inkMuted }}>${b.orig}</span>
                  </div>
                </div>
                <CVIcon name="chev-r" size={16} stroke={theme.inkSoft} />
              </Link>
            ))}
          </div>
          {/* Tablet/Desktop: card grid */}
          <div className="hidden md:grid grid-cols-3 gap-3 xl:gap-4">
            {BUNDLES.map((b) => {
              const items = b.items.map((id) => PRODUCTS.find((p) => p.id === id)).filter(Boolean) as typeof PRODUCTS
              return (
                <Link key={b.id} href="/promotions" className="rounded-[20px] overflow-hidden flex flex-col" style={{ background: theme.surface, border: b.member ? `1px solid ${theme.gold}55` : `1px solid ${theme.line}` }}>
                  <div className="px-4 xl:px-5 py-4 xl:py-5 flex justify-between items-start gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        {b.member && <CVMemberPill small />}
                        <span className="font-mono text-[9px] tracking-[1px]" style={{ color: theme.inkMuted }}>{b.tag}</span>
                      </div>
                      <div className="font-serif font-bold leading-snug text-[16px] xl:text-[18px]" style={{ color: theme.ink }}>{b.zh}</div>
                    </div>
                    <span className="px-2 py-1 rounded-md text-[11px] font-bold whitespace-nowrap" style={{ background: theme.accentSoft, color: theme.accent }}>省 ${b.orig - b.price}</span>
                  </div>
                  <div className="grid gap-px" style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)`, background: theme.line }}>
                    {items.map((it) => (
                      <div key={it.id} className="p-2" style={{ background: theme.surface }}>
                        <CVPlaceholder label="" tone={toneFor(it.id)} ratio={1} rounded />
                      </div>
                    ))}
                  </div>
                  <div className="px-4 xl:px-5 py-3 flex justify-between items-center" style={{ borderTop: `0.5px solid ${theme.line}` }}>
                    <div>
                      <span className="font-sans font-bold text-[18px] xl:text-[22px]" style={{ color: theme.accent }}>${b.price}</span>
                      <span className="font-sans text-xs line-through ml-1.5" style={{ color: theme.inkMuted }}>${b.orig}</span>
                    </div>
                    <CVIcon name="chev-r" size={16} stroke={theme.inkSoft} />
                  </div>
                </Link>
              )
            })}
          </div>
        </CVSection>
      </div>

      {/* ── WECHAT CTA (shared, responsive) ── */}
      <div className="mx-4 md:mx-6 xl:mx-10 mt-7 md:mt-10 xl:mt-12">
        {/* Mobile: centered card */}
        <div className="md:hidden p-5 rounded-[20px] text-center" style={{ background: theme.surface }}>
          <div className="font-serif text-base font-bold mb-1" style={{ color: theme.ink }}>会员专享更多优惠</div>
          <div className="text-[11px] leading-relaxed mb-3" style={{ color: theme.inkSoft }}>添加微信客服 · 解锁专属价 · 享免费咨询</div>
          <CVWeChatCTA full label="联系客服 · 加入会员" />
        </div>
        {/* Tablet/Desktop: horizontal strip */}
        <div className="hidden md:flex items-center justify-between gap-6 flex-wrap px-7 xl:px-10 py-6 xl:py-8 rounded-[22px]" style={{ background: theme.surface, border: `0.5px solid ${theme.line}` }}>
          <div className="flex-1 min-w-[280px]">
            <div className="font-mono text-[10px] tracking-[2px]" style={{ color: theme.inkMuted }}>MEMBERSHIP · 会员</div>
            <div className="font-serif font-extrabold tracking-tight mt-1 text-[22px] xl:text-[28px]" style={{ color: theme.ink }}>会员专享更多优惠</div>
            <div className="text-[13px] leading-relaxed mt-2 max-w-[480px]" style={{ color: theme.inkSoft }}>添加微信客服 · 解锁专属价 · 享免费咨询 · 优先获知新品发布</div>
          </div>
          <CVWeChatCTA label="联系微信客服 · 加入会员" />
        </div>
      </div>

      {/* ── FOOTER (desktop/tablet only) ── */}
      <footer className="hidden md:grid grid-cols-2 xl:grid-cols-4 gap-6 text-[12px] px-6 xl:px-10 pt-7 mt-10 xl:mt-12 pb-8" style={{ color: theme.inkSoft, borderTop: `0.5px solid ${theme.line}` }}>
        <div>
          <Link href="/" className="inline-block mb-2 drop-shadow-lg">
            <Image
              src="/CV-logo-white.svg"
              alt="CV Shop"
              width={60}
              height={60}
            />
          </Link>
          <div className="leading-relaxed">精选日用百货、零食<br />茶饮和美妆护肤。</div>
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
          <div className="leading-[1.9] font-mono text-[11px]">WeChat: cv_shop_official<br />Email: hi@cvshop.cn<br />Hours: 09:00 — 21:00</div>
        </div>
      </footer>
    </div>
  )
}
