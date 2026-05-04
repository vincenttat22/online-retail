import Link from 'next/link'
import CVPlaceholder from '@/components/ui/CVPlaceholder'
import CVIcon from '@/components/ui/CVIcon'
import { toneFor } from '@/lib/tokens'
import type { Product, Recipe } from '@/lib/types'

const CUISINE_ZH: Record<Recipe['cuisineType'], string> = {
  chinese: '中式',
  western: '西式',
  fusion: '中西合璧',
}

const DIFFICULTY_ZH: Record<Recipe['difficulty'], string> = {
  easy: '容易',
  medium: '中等',
  hard: '挑战',
}

interface Props {
  product: Product
  recipes: Recipe[]
}

export default function RecipeListScreen({ product, recipes }: Props) {
  return (
    <div className="pb-24 md:pb-12 animate-cv-fade">
      {/* Mobile sticky back bar */}
      <Link
        href={`/product/${product.id}`}
        className="md:hidden sticky top-0 z-20 flex items-center gap-2 px-4 h-12 backdrop-blur"
        style={{
          background: 'color-mix(in srgb, var(--cv-bg) 85%, transparent)',
          borderBottom: '0.5px solid var(--cv-line)',
          color: 'var(--cv-ink)',
          textDecoration: 'none',
        }}
      >
        <CVIcon name="chev-l" size={18} />
        <span className="text-[13px] font-medium truncate">返回 {product.zh}</span>
      </Link>

      {/* Desktop breadcrumb */}
      <div
        className="hidden md:flex items-center gap-1.5 text-[12px] px-6 xl:px-10 pt-6 xl:pt-9 mb-5"
        style={{ color: 'var(--cv-ink-muted)' }}
      >
        <Link href="/" className="hover:underline" style={{ color: 'inherit' }}>
          首页
        </Link>
        <CVIcon name="chev-r" size={11} />
        <Link
          href={`/product/${product.id}`}
          className="hover:underline"
          style={{ color: 'inherit' }}
        >
          {product.zh}
        </Link>
        <CVIcon name="chev-r" size={11} />
        <span style={{ color: 'var(--cv-ink)' }}>食谱推荐</span>
      </div>

      <div className="px-4 md:px-6 xl:px-10 pt-4 md:pt-0">
        <div
          className="font-mono text-[10px] tracking-[1.5px] mb-2"
          style={{ color: 'var(--cv-ink-muted)' }}
        >
          RECIPES · 食谱推荐
        </div>
        <h1
          className="m-0 font-serif font-extrabold tracking-tight text-[22px] md:text-[28px] xl:text-[34px]"
          style={{ color: 'var(--cv-ink)' }}
        >
          {product.zh} 的食谱推荐
        </h1>
        <div className="mt-1 text-[12px] md:text-[13px]" style={{ color: 'var(--cv-ink-muted)' }}>
          共 {recipes.length} 款做法
        </div>
      </div>

      {/* Grid */}
      <div className="px-4 md:px-6 xl:px-10 mt-5 md:mt-8 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
        {recipes.map((r) => (
          <Link
            key={r.id}
            href={`/recipes/${r.id}`}
            className="block rounded-2xl overflow-hidden transition-transform hover:-translate-y-0.5"
            style={{
              background: 'var(--cv-surface)',
              border: '0.5px solid var(--cv-line)',
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <div className="aspect-square relative">
              {r.hasHeroImage ? (
                <img
                  src={`/api/recipes/${r.id}/hero-image`}
                  alt={r.titleZh}
                  className="w-full h-full object-cover bg-gray-200"
                />
              ) : (
                <CVPlaceholder label={r.titleEn} tone={toneFor(r.id)} ratio={1} />
              )}
            </div>
            <div className="p-3">
              <div
                className="font-serif font-bold text-[14px] md:text-[15px] leading-snug truncate"
                style={{ color: 'var(--cv-ink)' }}
              >
                {r.titleZh}
              </div>
              <div
                className="font-sans text-[10px] md:text-[11px] mt-0.5 truncate"
                style={{ color: 'var(--cv-ink-muted)' }}
              >
                {r.titleEn}
              </div>
              <div
                className="mt-2 flex items-center gap-2 text-[10px] md:text-[11px] flex-wrap"
                style={{ color: 'var(--cv-ink-soft)' }}
              >
                <span
                  className="px-1.5 py-0.5 rounded"
                  style={{ background: 'var(--cv-chip-bg)', color: 'var(--cv-chip-ink)' }}
                >
                  {CUISINE_ZH[r.cuisineType]}
                </span>
                <span className="inline-flex items-center gap-1">
                  <CVIcon name="clock" size={11} />
                  {r.timeMinutes}分钟
                </span>
                <span>{DIFFICULTY_ZH[r.difficulty]}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Bottom back CTA */}
      <div className="px-4 md:px-6 xl:px-10 mt-8 md:mt-12">
        <Link
          href={`/product/${product.id}`}
          className="flex items-center justify-center gap-1.5 w-full md:w-auto md:inline-flex md:px-6 h-11 rounded-full text-[13px] font-medium transition-opacity hover:opacity-90"
          style={{
            background: 'var(--cv-ink)',
            color: 'var(--cv-bg)',
            textDecoration: 'none',
          }}
        >
          <CVIcon name="chev-l" size={14} />
          返回 {product.zh}
        </Link>
      </div>
    </div>
  )
}
