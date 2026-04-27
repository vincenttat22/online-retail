'use client'

import Link from 'next/link'
import { useTheme } from '@/context/ThemeContext'
import { PRODUCTS, BUNDLES } from '@/lib/data'
import { toneFor } from '@/lib/tokens'
import CVPlaceholder from '@/components/ui/CVPlaceholder'
import CVProductCard from '@/components/ui/CVProductCard'
import CVSection from '@/components/ui/CVSection'
import CVCountdown from '@/components/ui/CVCountdown'
import CVMemberPill from '@/components/ui/CVMemberPill'
import CVWeChatCTA from '@/components/ui/CVWeChatCTA'
import CVIcon from '@/components/ui/CVIcon'

const HERO_TARGET = Date.now() + 2 * 3600 * 1000 + 47 * 60 * 1000

export default function HomeScreen() {
  const { theme, fx } = useTheme()
  const weekly = PRODUCTS.slice(0, 8)
  const top = PRODUCTS.find((p) => p.disc >= 25) ?? PRODUCTS[0]

  return (
    <div className="pb-28 animate-cv-fade">
      {/* Header */}
      <div className="px-4 pt-14 pb-3 flex items-center justify-between">
        <div>
          <div className="font-mono text-[10px] tracking-[2px]" style={{ color: theme.inkMuted }}>
            CV·SHOP
          </div>
          <div className="font-serif text-2xl font-black tracking-tight leading-none" style={{ color: theme.ink }}>
            严选小铺
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            href="/catalogue"
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: theme.surface, color: theme.ink }}
          >
            <CVIcon name="search" size={18} />
          </Link>
          <button
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: theme.surface, color: theme.ink }}
          >
            <CVIcon name="bell" size={18} />
          </button>
          <button
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: theme.surface, color: theme.ink }}
          >
            <CVIcon name="cart" size={18} />
          </button>
        </div>
      </div>

      {/* Hero banner */}
      <div
        className="mx-4 mb-5 rounded-3xl overflow-hidden"
        style={{ background: theme.heroBg, color: theme.heroInk }}
      >
        <div className="grid grid-cols-[1.1fr_1fr]">
          <div className="p-5 flex flex-col gap-2.5">
            <span className="font-mono text-[9px] tracking-[2px] opacity-70">本周精选 · WK 17</span>
            <div className="font-serif text-2xl font-black leading-snug tracking-tight">
              春日<br />暖心<br /><span className="italic font-normal">礼遇</span>
            </div>
            <div className="text-[11px] opacity-85 leading-relaxed">
              家居 · 零食 · 美妆<br />限时 8 折起
            </div>
            <Link
              href="/promotions"
              className="inline-flex items-center gap-1 self-start px-3.5 py-2 rounded-full text-xs font-semibold mt-1"
              style={{ background: theme.heroInk, color: theme.heroBg }}
            >
              查看优惠 <CVIcon name="chev-r" size={12} />
            </Link>
          </div>
          <div className="relative">
            <CVPlaceholder label="hero · 主视觉" tone="d" ratio={1} />
            <div
              className="absolute bottom-2.5 right-2.5 px-2 py-1 rounded font-mono text-[9px] tracking-wide"
              style={{ background: 'rgba(255,255,255,0.9)', color: theme.ink }}
            >
              SS·26
            </div>
          </div>
        </div>
      </div>

      {/* Sale strip */}
      {fx.saleStrip && (
        <div
          className="mx-4 mb-5 px-3.5 py-2.5 rounded-2xl flex items-center justify-between gap-2"
          style={{
            background: theme.accentSoft,
            color: theme.accent,
            border: `0.5px solid ${theme.accent}33`,
          }}
        >
          <div className="flex items-center gap-2">
            {fx.flameSparkle ? (
              <span className="text-base">🔥</span>
            ) : (
              <CVIcon name="spark" size={14} />
            )}
            <div className="text-xs font-semibold">限时闪购 · 全场最高减 30%</div>
          </div>
          {fx.countdown && <CVCountdown targetMs={HERO_TARGET} />}
        </div>
      )}

      {/* Category icons */}
      <div className="px-4 pb-6 grid grid-cols-4 gap-2">
        {[
          { id: 'snack',  zh: '零食', tone: 'b' as const },
          { id: 'beauty', zh: '美妆', tone: 'e' as const },
          { id: 'daily',  zh: '日用', tone: 'f' as const },
          { id: 'all',    zh: '全部', tone: 'c' as const },
        ].map((c) => (
          <Link
            key={c.id}
            href={`/catalogue?cat=${c.id}`}
            className="flex flex-col items-center gap-1.5"
          >
            <div className="w-14 h-14">
              <CVPlaceholder label="" tone={c.tone} ratio={1} rounded />
            </div>
            <span className="text-[11px] font-medium" style={{ color: theme.ink }}>
              {c.zh}
            </span>
          </Link>
        ))}
      </div>

      {/* Weekly featured carousel */}
      <CVSection kicker="WEEKLY FEATURED" title="本周精选" action="全部">
        <div className="flex gap-2.5 overflow-x-auto -mx-4 px-4 pb-1 cv-scroll-x snap-x-mandatory">
          {weekly.map((p) => (
            <div key={p.id} className="flex-none w-[150px] snap-start">
              <CVProductCard
                p={p}
                fx={fx}
                tone={toneFor(p.id)}
                onClick={() => (window.location.href = `/product/${p.id}`)}
              />
            </div>
          ))}
        </div>
      </CVSection>

      {/* Editorial deal of the day */}
      <div className="px-4 pt-6">
        <Link
          href={`/product/${top.id}`}
          className="block rounded-[22px] overflow-hidden"
          style={{ background: theme.surface }}
        >
          <div className="relative">
            <CVPlaceholder label={`editorial · ${top.en}`} tone="b" ratio={1.6} />
            <div
              className="absolute inset-0 p-4 flex flex-col justify-end"
              style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.55), transparent 55%)', color: '#fff' }}
            >
              <div className="font-mono text-[9px] tracking-[2px] opacity-80">FEATURED · DEAL OF THE DAY</div>
              <div className="font-serif text-[22px] font-bold mt-1 tracking-tight">{top.zh}</div>
              <div className="flex items-center gap-2.5 mt-2">
                <span
                  className="px-2.5 py-1 rounded font-sans text-xs font-bold"
                  style={{ background: theme.accent, color: theme.accentInk }}
                >
                  −{top.disc}%
                </span>
                <span className="font-sans text-[18px] font-semibold">
                  ¥{Math.round(top.price * (100 - top.disc)) / 100}
                </span>
                <span className="font-sans text-[13px] opacity-70 line-through">¥{top.price}</span>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Bundles preview */}
      <CVSection kicker="BUNDLES · 组合套装" title="组合更划算" action="全部" className="mt-7">
        <div className="flex flex-col gap-2.5">
          {BUNDLES.slice(0, 2).map((b) => (
            <Link
              key={b.id}
              href="/promotions"
              className="flex items-center gap-3 p-3 rounded-[18px]"
              style={{ background: theme.surface }}
            >
              <div className="w-[78px] h-[78px] shrink-0">
                <CVPlaceholder
                  label={b.tag}
                  tone={b.theme === 'beauty' ? 'e' : b.theme === 'snack' ? 'b' : 'f'}
                  ratio={1}
                  rounded
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex gap-1.5 mb-1">
                  {b.member && <CVMemberPill small />}
                  <span className="font-mono text-[9px] tracking-[1px]" style={{ color: theme.inkMuted }}>
                    {b.tag}
                  </span>
                </div>
                <div className="font-serif text-[15px] font-bold leading-snug" style={{ color: theme.ink }}>
                  {b.zh}
                </div>
                <div className="flex gap-1.5 items-baseline mt-1">
                  <span className="font-sans text-base font-bold" style={{ color: theme.accent }}>
                    ¥{b.price}
                  </span>
                  <span className="font-sans text-[11px] line-through" style={{ color: theme.inkMuted }}>
                    ¥{b.orig}
                  </span>
                </div>
              </div>
              <CVIcon name="chev-r" size={16} stroke={theme.inkSoft} />
            </Link>
          ))}
        </div>
      </CVSection>

      {/* WeChat CTA */}
      <div
        className="mx-4 mt-7 p-5 rounded-[20px] text-center"
        style={{ background: theme.surface }}
      >
        <div className="font-serif text-base font-bold mb-1" style={{ color: theme.ink }}>
          会员专享更多优惠
        </div>
        <div className="text-[11px] leading-relaxed mb-3" style={{ color: theme.inkSoft }}>
          添加微信客服 · 解锁专属价 · 享免费咨询
        </div>
        <CVWeChatCTA full label="联系客服 · 加入会员" />
      </div>
    </div>
  )
}
