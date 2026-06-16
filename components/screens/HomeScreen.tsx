'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { GroupBuyData, GroupBuyProduct, TopSeller, NewArrivalProduct } from '@/lib/types'
import { toneFor } from '@/lib/tokens'
import CVPlaceholder from '@/components/ui/CVPlaceholder'
import CVCountdown from '@/components/ui/CVCountdown'
import CVIcon from '@/components/ui/CVIcon'

interface HomeScreenProps {
  groupBuy: GroupBuyData | null
  topSellers: TopSeller[]
  newArrivals: NewArrivalProduct[]
}

function ProductThumb({ p, ratio = 1, tone }: { p: { id: number; zh: string; images?: { id: number; isPrimary?: boolean; altText?: string }[] }; ratio?: number; tone: ReturnType<typeof toneFor> }) {
  const primaryImage = p.images?.find((img) => img.isPrimary) || p.images?.[0]
  if (primaryImage) {
    return (
      <img
        src={`/api/products/${p.id}/images/${primaryImage.id}`}
        alt={primaryImage.altText || p.zh}
        className="w-full object-cover bg-gray-200"
        style={{ aspectRatio: ratio }}
      />
    )
  }
  return <CVPlaceholder label={p.zh} tone={tone} ratio={ratio} />
}

function SectionHead({ emoji, zh, en, right }: { emoji: string; zh: string; en: string; right?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-lg md:text-xl">{emoji}</span>
          <span className="font-serif font-black text-xl md:text-3xl tracking-tight" style={{ color: 'var(--cv-ink)' }}>
            {zh}
          </span>
        </div>
        <div className="font-sans text-[11px] md:text-[13px] mt-0.5" style={{ color: 'var(--cv-ink-muted)' }}>
          {en}
        </div>
      </div>
      {right}
    </div>
  )
}

function LiveDot({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-1.5 text-[11px] font-sans" style={{ color: 'var(--cv-accent)' }}>
      <span className="w-1.5 h-1.5 rounded-full inline-block animate-cv-pulse" style={{ background: 'var(--cv-accent)' }} />
      {text}
    </div>
  )
}

function GroupBuyCard({ p, desktop, hot }: { p: GroupBuyProduct; desktop?: boolean; hot?: boolean }) {
  return (
    <div
      className={`rounded-2xl overflow-hidden cursor-pointer relative ${desktop ? '' : 'w-[148px] shrink-0'}`}
      style={{ background: 'var(--cv-surface)', boxShadow: '0 2px 8px rgba(26,22,20,0.06)' }}
    >
      <ProductThumb p={p} ratio={desktop ? 1.25 : 0.78} tone={toneFor(p.id)} />
      {hot && (
        <div
          className="absolute top-2 right-2 px-1.5 py-0.5 rounded font-mono text-[9px] font-semibold text-white tracking-wide"
          style={{ background: 'var(--cv-accent)' }}
        >
          HOT
        </div>
      )}
      <div className="px-2.5 pt-2 pb-3">
        <div className="font-serif text-[13px] font-bold leading-tight line-clamp-2" style={{ color: 'var(--cv-ink)' }}>
          {p.zh}
        </div>
        {p.en && (
          <div className="font-sans text-[10px] mt-0.5" style={{ color: 'var(--cv-ink-muted)' }}>
            {p.en}
          </div>
        )}
        <div className="mt-1.5 flex items-center justify-between">
          <div>
            <span className="font-sans font-bold text-[15px]" style={{ color: 'var(--cv-ink)' }}>${p.price}</span>
            {p.unit && <span className="text-[10px] ml-0.5" style={{ color: 'var(--cv-ink-muted)' }}>{p.unit}</span>}
          </div>
          <div className="px-1.5 py-0.5 rounded-full" style={{ background: 'var(--cv-accent-soft)' }}>
            <span className="font-mono text-[9px] font-semibold" style={{ color: 'var(--cv-accent)' }}>{p.orderCount}人</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function RankBadge({ rank }: { rank: number }) {
  const configs: Record<number, [string, string]> = {
    1: ['var(--cv-gold)', '#fff'],
    2: ['#b0b0b0', '#fff'],
    3: ['#c07840', '#fff'],
  }
  const [bg, color] = configs[rank] ?? ['var(--cv-ink)', 'var(--cv-bg)']
  return (
    <div
      className="w-[30px] h-[30px] rounded-full shrink-0 flex items-center justify-center font-sans font-extrabold text-[13px]"
      style={{ background: bg, color }}
    >
      {rank}
    </div>
  )
}

function TopSellerRow({ item }: { item: TopSeller }) {
  return (
    <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1.5" style={{ background: 'var(--cv-surface)' }}>
      <RankBadge rank={item.rank} />
      <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0">
        <ProductThumb p={item} ratio={1} tone={toneFor(item.id)} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-serif text-sm font-bold truncate" style={{ color: 'var(--cv-ink)' }}>{item.zh}</div>
        {item.en && <div className="font-sans text-[10px] mt-0.5 truncate" style={{ color: 'var(--cv-ink-muted)' }}>{item.en}</div>}
      </div>
      <div className="text-right shrink-0">
        <div className="font-sans font-bold text-[15px]" style={{ color: 'var(--cv-ink)' }}>${item.price}</div>
        <div className="font-mono text-[9px] font-semibold mt-0.5" style={{ color: item.rank <= 3 ? 'var(--cv-gold)' : 'var(--cv-ink-muted)' }}>
          {item.orderCount}人下单
        </div>
      </div>
    </div>
  )
}

function TopSellerCard({ item }: { item: TopSeller }) {
  return (
    <div className="rounded-2xl overflow-hidden cursor-pointer" style={{ background: 'var(--cv-surface)', boxShadow: '0 2px 8px rgba(26,22,20,0.06)' }}>
      <div className="relative">
        <ProductThumb p={item} ratio={1.1} tone={toneFor(item.id)} />
        <div className="absolute top-2.5 left-2.5">
          <RankBadge rank={item.rank} />
        </div>
      </div>
      <div className="px-3.5 py-3">
        <div className="font-serif text-sm font-bold leading-snug" style={{ color: 'var(--cv-ink)' }}>{item.zh}</div>
        {item.en && <div className="font-sans text-[10px] mt-0.5" style={{ color: 'var(--cv-ink-muted)' }}>{item.en}</div>}
        <div className="mt-2.5 flex items-center justify-between">
          <span className="font-sans font-bold text-base" style={{ color: 'var(--cv-ink)' }}>${item.price}</span>
          <div className="px-2 py-1 rounded-full" style={{ background: item.rank <= 3 ? 'var(--cv-gold-soft)' : 'var(--cv-bg)' }}>
            <span className="font-mono text-[9px] font-semibold" style={{ color: item.rank <= 3 ? 'var(--cv-gold)' : 'var(--cv-ink-muted)' }}>{item.orderCount}人</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function NewArrivalCard({ p, imgRatio = 1 }: { p: NewArrivalProduct; imgRatio?: number }) {
  return (
    <div className="rounded-2xl overflow-hidden cursor-pointer relative" style={{ background: 'var(--cv-surface)', boxShadow: '0 2px 8px rgba(26,22,20,0.06)' }}>
      <ProductThumb p={p} ratio={imgRatio} tone={toneFor(p.id)} />
      <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded font-serif text-[11px] font-bold text-white" style={{ background: '#3a7d44' }}>新</div>
      <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded font-mono text-[8px] text-white tracking-wide" style={{ background: 'rgba(26,22,20,0.65)' }}>
        {p.daysAgo}d ago
      </div>
      <div className="px-2.5 pt-2 pb-3">
        <div className="font-serif text-[13px] font-bold leading-tight line-clamp-2" style={{ color: 'var(--cv-ink)' }}>{p.zh}</div>
        {p.en && <div className="font-sans text-[10px] mt-0.5" style={{ color: 'var(--cv-ink-muted)' }}>{p.en}</div>}
        <div className="mt-1.5">
          <span className="font-sans font-bold text-[15px]" style={{ color: 'var(--cv-ink)' }}>${p.price}</span>
          {p.unit && <span className="text-[10px] ml-0.5" style={{ color: 'var(--cv-ink-muted)' }}>{p.unit}</span>}
        </div>
      </div>
    </div>
  )
}

export default function HomeScreen({ groupBuy, topSellers, newArrivals }: HomeScreenProps) {
  const router = useRouter()
  const hasGroupBuy = !!groupBuy && groupBuy.products.length > 0
  const deadlineMs = groupBuy?.endedAt ? new Date(groupBuy.endedAt).getTime() : null
  const showCountdown = deadlineMs !== null && deadlineMs > Date.now()
  const fullListHref = groupBuy && groupBuy.allProductIds.length > 0
    ? `/catalogue?ids=${groupBuy.allProductIds.join(',')}`
    : '/catalogue'

  const deadlineLabelShort = deadlineMs
    ? new Intl.DateTimeFormat('zh-CN', {
        timeZone: 'Australia/Sydney',
        month: 'numeric',
        day: 'numeric',
        weekday: 'short',
        hour: 'numeric',
        minute: '2-digit',
      }).format(deadlineMs)
    : null

  const deadlineLabelLong = deadlineMs
    ? new Intl.DateTimeFormat('zh-CN', {
        timeZone: 'Australia/Sydney',
        weekday: 'long',
        hour: 'numeric',
        minute: '2-digit',
      }).format(deadlineMs)
    : null

  const hotIds = new Set(groupBuy?.products.slice(0, 3).map((p) => p.id) ?? [])

  return (
    <div className="pb-28 md:pb-12 animate-cv-fade">
      {/* ── BLOCK 1: 本周团购 ── */}
      <section className="pt-5 pb-6 md:pt-12 md:pb-0">
        {/* Mobile: compact header row + carousel */}
        <div className="md:hidden">
          <div className="px-4 mb-3">
            <SectionHead
              emoji="🔥"
              zh="本周团购"
              en="THIS WEEK · 本周接龙"
              right={
                showCountdown && (
                  <div
                    className="px-3.5 py-3 rounded-2xl text-center shrink-0"
                    style={{ background: 'var(--cv-accent-soft)', border: '1px solid color-mix(in srgb, var(--cv-accent) 40%, transparent)' }}
                  >
                    <div className="font-mono text-[14px] tracking-wide" style={{ color: 'var(--cv-accent)' }}>截止倒计时</div>
                    <div className="mt-2"><CVCountdown targetMs={deadlineMs!} xl /></div>
                    {deadlineLabelShort && (
                      <div className="font-mono text-[14px] mt-2 opacity-80" style={{ color: 'var(--cv-accent)' }}>{deadlineLabelShort}</div>
                    )}
                  </div>
                )
              }
            />
            {hasGroupBuy && (
              <div className="mt-2">
                <LiveDot text={`接龙进行中 · 本周已有 ${groupBuy!.totalOrders}+ 人下单`} />
              </div>
            )}
          </div>

          {hasGroupBuy ? (
            <>
              <div className="flex gap-2.5 overflow-x-auto px-4 pb-2 cv-scroll-x snap-x-mandatory">
                {groupBuy!.products.map((p) => (
                  <div key={p.id} className="snap-start" onClick={() => router.push(`/product/${p.id}`)}>
                    <GroupBuyCard p={p} hot={hotIds.has(p.id)} />
                  </div>
                ))}
                <div className="shrink-0 w-1" />
              </div>
              <div className="px-4 mt-1">
                <Link
                  href={fullListHref}
                  className="inline-flex items-center justify-center gap-1 w-full py-3 rounded-xl text-sm font-semibold"
                  style={{ border: '1.5px solid var(--cv-ink)', color: 'var(--cv-ink)' }}
                >
                  查看完整列表 <CVIcon name="chev-r" size={12} />
                </Link>
              </div>
            </>
          ) : (
            <div className="px-4 py-6 rounded-2xl mx-4 text-center text-sm" style={{ background: 'var(--cv-surface)', color: 'var(--cv-ink-muted)' }}>
              暂无进行中的接龙，去看看全部商品吧
            </div>
          )}
        </div>

        {/* Desktop: editorial hero (big countdown) + product grid */}
        <div className="hidden md:grid grid-cols-[340px_1fr] xl:grid-cols-[380px_1fr] gap-10 xl:gap-12 px-6 xl:px-10 items-start">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🔥</span>
              <span className="font-mono text-[10px] font-semibold tracking-[2.5px]" style={{ color: 'var(--cv-accent)' }}>
                THIS WEEK · 本周接龙
              </span>
            </div>
            <h2 className="font-serif font-black tracking-tight m-0" style={{ fontSize: 'clamp(40px, 4.5vw, 62px)', lineHeight: 0.95, color: 'var(--cv-ink)' }}>
              本周<br />团购
            </h2>
            <p className="font-serif text-[15px] italic mt-4 max-w-[310px] leading-relaxed" style={{ color: 'var(--cv-ink-muted)' }}>
              每周精选到货 · 接龙下单
              {deadlineLabelLong && (
                <>
                  <br />
                  本周截止 <span className="not-italic font-semibold" style={{ color: 'var(--cv-ink)' }}>{deadlineLabelLong}</span>（悉尼时间）
                </>
              )}
            </p>
            {showCountdown && (
              <div className="mt-6">
                <div className="font-mono text-[10px] tracking-[1.5px] mb-2.5" style={{ color: 'var(--cv-ink-muted)' }}>截止倒计时</div>
                <CVCountdown targetMs={deadlineMs!} xl />
              </div>
            )}
            {hasGroupBuy && (
              <div className="mt-6 flex items-center gap-3">
                <Link
                  href={fullListHref}
                  className="inline-flex items-center gap-1.5 px-5 py-3 rounded-xl text-[13px] font-semibold"
                  style={{ border: '1.5px solid var(--cv-ink)', color: 'var(--cv-ink)' }}
                >
                  查看完整列表 <CVIcon name="chev-r" size={14} />
                </Link>
              </div>
            )}
            {hasGroupBuy && (
              <div className="mt-5">
                <LiveDot text={`本周已有 ${groupBuy!.totalOrders}+ 人下单`} />
              </div>
            )}
          </div>

          {hasGroupBuy ? (
            <div className="grid grid-cols-3 gap-3 xl:gap-4">
              {groupBuy!.products.map((p) => (
                <div key={p.id} onClick={() => router.push(`/product/${p.id}`)}>
                  <GroupBuyCard p={p} desktop hot={hotIds.has(p.id)} />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-10 rounded-2xl text-center text-sm" style={{ background: 'var(--cv-surface)', color: 'var(--cv-ink-muted)' }}>
              暂无进行中的接龙，去看看全部商品吧
            </div>
          )}
        </div>
      </section>

      <div className="h-2 md:h-px mx-0 md:mx-10" style={{ background: 'var(--cv-line)' }} />

      {/* ── BLOCK 2: 上周热销榜 ── */}
      <section className="px-4 md:px-6 xl:px-10 py-5 md:py-10">
        <SectionHead emoji="🏆" zh="上周热销榜" en="Last Week's Top Sellers" />
        {topSellers.length > 0 ? (
          <>
            <div className="md:hidden mt-4">
              {topSellers.map((item) => <TopSellerRow key={item.id} item={item} />)}
            </div>
            <div className="hidden md:grid grid-cols-5 gap-3.5 mt-5">
              {topSellers.map((item) => <TopSellerCard key={item.id} item={item} />)}
            </div>
          </>
        ) : (
          <div className="mt-4 py-6 rounded-2xl text-center text-sm" style={{ background: 'var(--cv-surface)', color: 'var(--cv-ink-muted)' }}>
            上周暂无成交数据
          </div>
        )}
      </section>

      <div className="h-2 md:h-px mx-0 md:mx-10" style={{ background: 'var(--cv-line)' }} />

      {/* ── BLOCK 3: 新品到货 ── */}
      <section className="px-4 md:px-6 xl:px-10 py-5 md:py-10">
        <SectionHead emoji="🆕" zh="新品到货" en="Just Arrived · 7天内上新" />
        {newArrivals.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-6 gap-2.5 md:gap-3.5 mt-4">
            {newArrivals.map((p) => (
              <div key={p.id} onClick={() => router.push(`/product/${p.id}`)}>
                <NewArrivalCard p={p} />
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-4 py-6 rounded-2xl text-center text-sm" style={{ background: 'var(--cv-surface)', color: 'var(--cv-ink-muted)' }}>
            暂无新品上架
          </div>
        )}
      </section>

      {/* Footer nudge */}
      <div className="px-4 md:px-6 xl:px-10 pt-2 pb-6 text-center">
        <Link
          href="/catalogue"
          className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full text-sm font-semibold"
          style={{ border: '1.5px solid var(--cv-ink)', color: 'var(--cv-ink)' }}
        >
          浏览全部商品 ↓
        </Link>
      </div>
    </div>
  )
}
