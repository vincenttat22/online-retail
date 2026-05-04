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
  recipe: Recipe
  product: Product | null
}

export default function RecipeDetailScreen({ recipe, product }: Props) {
  return (
    <div className="pb-32 md:pb-12 animate-cv-fade">
      {/* Mobile sticky back bar — back to product (fewer taps to checkout) */}
      {product && (
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
      )}

      {/* Desktop breadcrumb */}
      <div
        className="hidden md:flex items-center gap-1.5 text-[12px] px-6 xl:px-10 pt-6 xl:pt-9 mb-5 flex-wrap"
        style={{ color: 'var(--cv-ink-muted)' }}
      >
        <Link href="/" className="hover:underline" style={{ color: 'inherit' }}>
          首页
        </Link>
        <CVIcon name="chev-r" size={11} />
        {product && (
          <>
            <Link
              href={`/product/${product.id}`}
              className="hover:underline"
              style={{ color: 'inherit' }}
            >
              {product.zh}
            </Link>
            <CVIcon name="chev-r" size={11} />
            <Link
              href={`/product/${product.id}/recipes`}
              className="hover:underline"
              style={{ color: 'inherit' }}
            >
              食谱推荐
            </Link>
            <CVIcon name="chev-r" size={11} />
          </>
        )}
        <span style={{ color: 'var(--cv-ink)' }}>{recipe.titleZh}</span>
      </div>

      {/* Hero — small AI-reference thumbnail, not a billboard */}
      <div className="px-4 md:px-6 xl:px-10 pt-4 md:pt-6 max-w-[820px] mx-auto">
        <figure className="m-0 inline-block">
          <div
            className="rounded-xl overflow-hidden"
            style={{
              width: 'min(100%, 220px)',
              border: '0.5px solid var(--cv-line)',
            }}
          >
            {recipe.hasHeroImage ? (
              <img
                src={`/api/recipes/${recipe.id}/hero-image`}
                alt={recipe.titleZh}
                className="w-full aspect-square object-cover bg-gray-200"
              />
            ) : (
              <CVPlaceholder label={recipe.titleEn} tone={toneFor(recipe.id)} ratio={1} />
            )}
          </div>
          <figcaption
            className="mt-1.5 font-mono text-[9px] tracking-[1px] uppercase"
            style={{ color: 'var(--cv-ink-muted)' }}
          >
            AI 生成参考图 · reference only
          </figcaption>
        </figure>
      </div>

      <div className="px-4 md:px-6 xl:px-10 pt-4 md:pt-5 max-w-[820px] mx-auto">
        {/* Title */}
        <h1
          className="m-0 font-serif font-extrabold leading-snug tracking-tight text-[24px] md:text-[32px] xl:text-[38px]"
          style={{ color: 'var(--cv-ink)' }}
        >
          {recipe.titleZh}
        </h1>
        <div
          className="font-sans text-xs md:text-[14px] mt-1 tracking-wide"
          style={{ color: 'var(--cv-ink-muted)' }}
        >
          {recipe.titleEn}
        </div>

        {/* Stat row */}
        <div
          className="mt-4 md:mt-5 p-3.5 md:p-4 rounded-2xl flex items-center gap-3 md:gap-5 flex-wrap text-[12px] md:text-[13px]"
          style={{
            background: 'var(--cv-surface)',
            border: '0.5px solid var(--cv-line)',
            color: 'var(--cv-ink-soft)',
          }}
        >
          <span
            className="px-2 py-0.5 rounded font-medium"
            style={{ background: 'var(--cv-chip-bg)', color: 'var(--cv-chip-ink)' }}
          >
            {CUISINE_ZH[recipe.cuisineType]}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CVIcon name="clock" size={13} />
            {recipe.timeMinutes} 分钟
          </span>
          <span>{DIFFICULTY_ZH[recipe.difficulty]}</span>
          <span style={{ color: 'var(--cv-ink-muted)' }}>·</span>
          <span>{recipe.servings} 人份</span>
        </div>

        {/* Description */}
        {recipe.description && (
          <p
            className="mt-5 text-[13px] md:text-[14px] leading-relaxed whitespace-pre-wrap"
            style={{ color: 'var(--cv-ink-soft)' }}
          >
            {recipe.description}
          </p>
        )}

        {/* Ingredients */}
        {recipe.ingredients.length > 0 && (
          <section className="mt-7 md:mt-9">
            <div
              className="font-mono text-[10px] tracking-[1.5px] mb-2"
              style={{ color: 'var(--cv-ink-muted)' }}
            >
              INGREDIENTS · 配料
            </div>
            <h2
              className="m-0 mb-3 font-serif font-extrabold tracking-tight text-lg md:text-[20px]"
              style={{ color: 'var(--cv-ink)' }}
            >
              所需配料
            </h2>
            <ul className="m-0 p-0 list-none flex flex-col">
              {recipe.ingredients.map((ing) => {
                const qtyLine = [ing.quantity, ing.unit].filter(Boolean).join('')
                const inner = (
                  <div
                    className="flex items-center justify-between py-2.5 text-[13px] md:text-[14px]"
                    style={{ borderBottom: '0.5px solid var(--cv-line)' }}
                  >
                    <div className="flex flex-col">
                      <span style={{ color: 'var(--cv-ink)' }}>{ing.name}</span>
                      {ing.notes && (
                        <span
                          className="text-[11px] md:text-[12px] mt-0.5"
                          style={{ color: 'var(--cv-ink-muted)' }}
                        >
                          {ing.notes}
                        </span>
                      )}
                    </div>
                    <div
                      className="flex items-center gap-2 font-mono text-[12px] md:text-[13px]"
                      style={{ color: 'var(--cv-ink-soft)' }}
                    >
                      <span>{qtyLine}</span>
                      {ing.matchedProductId != null && (
                        <CVIcon name="chev-r" size={14} />
                      )}
                    </div>
                  </div>
                )
                return (
                  <li key={ing.id}>
                    {ing.matchedProductId != null ? (
                      <Link
                        href={`/product/${ing.matchedProductId}`}
                        style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                      >
                        {inner}
                      </Link>
                    ) : (
                      inner
                    )}
                  </li>
                )
              })}
            </ul>
          </section>
        )}

        {/* Instructions */}
        <section className="mt-7 md:mt-9">
          <div
            className="font-mono text-[10px] tracking-[1.5px] mb-2"
            style={{ color: 'var(--cv-ink-muted)' }}
          >
            INSTRUCTIONS · 做法
          </div>
          <h2
            className="m-0 mb-3 font-serif font-extrabold tracking-tight text-lg md:text-[20px]"
            style={{ color: 'var(--cv-ink)' }}
          >
            烹饪步骤
          </h2>
          <div
            className="text-[13px] md:text-[14px] leading-relaxed whitespace-pre-wrap"
            style={{ color: 'var(--cv-ink-soft)' }}
          >
            {recipe.instructions}
          </div>
        </section>

        {/* Desktop CTA pair */}
        {product && (
          <div className="hidden md:flex gap-2.5 mt-9">
            <Link
              href={`/product/${recipe.productId}/recipes`}
              className="inline-flex items-center justify-center gap-1.5 px-5 h-11 rounded-full text-[13px] font-medium transition-opacity hover:opacity-90"
              style={{
                background: 'var(--cv-surface)',
                border: '0.5px solid var(--cv-line)',
                color: 'var(--cv-ink)',
                textDecoration: 'none',
              }}
            >
              <CVIcon name="chev-l" size={14} />
              更多食谱
            </Link>
            <Link
              href={`/product/${product.id}`}
              className="inline-flex items-center justify-center px-6 h-11 rounded-full text-[13px] font-medium transition-opacity hover:opacity-90"
              style={{ background: 'var(--cv-ink)', color: 'var(--cv-bg)', textDecoration: 'none' }}
            >
              查看 {product.zh}
            </Link>
          </div>
        )}
      </div>

      {/* Mobile sticky CTA pair */}
      {product && (
        <div
          className="md:hidden fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] px-4 pt-3 pb-8 flex gap-2 z-30"
          style={{ background: 'var(--cv-bg)', borderTop: '0.5px solid var(--cv-line)' }}
        >
          <Link
            href={`/product/${recipe.productId}/recipes`}
            className="flex items-center justify-center gap-1.5 h-11 px-4 rounded-full text-[12px] font-medium shrink-0"
            style={{
              background: 'var(--cv-surface)',
              border: '0.5px solid var(--cv-line)',
              color: 'var(--cv-ink)',
              textDecoration: 'none',
            }}
          >
            <CVIcon name="chev-l" size={14} />
            更多食谱
          </Link>
          <Link
            href={`/product/${product.id}`}
            className="flex-1 flex items-center justify-center h-11 rounded-full text-[13px] font-medium truncate"
            style={{
              background: 'var(--cv-ink)',
              color: 'var(--cv-bg)',
              textDecoration: 'none',
            }}
          >
            查看 {product.zh}
          </Link>
        </div>
      )}
    </div>
  )
}
