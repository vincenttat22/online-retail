import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import RecipeDetailScreen from '@/components/screens/RecipeDetailScreen'
import { getProductById, getRecipeById } from '@/lib/db/queries'
import { getBaseUrl } from '@/lib/metadata-utils'

interface Props {
  params: Promise<{ id: string }>
}

const CUISINE_ZH = { chinese: '中式', western: '西式', fusion: '中西合璧' } as const

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const recipeId = Number(id)
  const recipe = await getRecipeById(recipeId)
  if (!recipe) return { title: 'CV Shop' }

  const product = await getProductById(recipe.productId)
  const baseUrl = await getBaseUrl()

  let ogImageUrl: string | undefined
  if (recipe.hasHeroImage) {
    ogImageUrl = `${baseUrl}/api/recipes/${recipeId}/hero-image`
  } else if (product) {
    const pImg = product.images?.find((i) => i.isPrimary) ?? product.images?.[0]
    if (pImg) ogImageUrl = `${baseUrl}/api/products/${product.id}/images/${pImg.id}`
  }

  const description =
    recipe.description?.trim() ||
    (product
      ? `${product.zh} 的家常做法 — ${CUISINE_ZH[recipe.cuisineType]}，约 ${recipe.timeMinutes} 分钟，${recipe.servings} 人份。`
      : recipe.titleEn)

  return {
    title: `${recipe.titleZh} · CV Shop`,
    description,
    openGraph: {
      title: recipe.titleZh,
      description,
      images: ogImageUrl ? [{ url: ogImageUrl }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: recipe.titleZh,
      description,
      images: ogImageUrl ? [ogImageUrl] : [],
    },
  }
}

export default async function RecipeDetailPage({ params }: Props) {
  const { id } = await params
  const recipe = await getRecipeById(Number(id))
  if (!recipe) notFound()

  const product = await getProductById(recipe.productId)
  return <RecipeDetailScreen recipe={recipe} product={product} />
}
