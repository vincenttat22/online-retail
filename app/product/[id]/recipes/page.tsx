import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import RecipeListScreen from '@/components/screens/RecipeListScreen'
import { getProductById, getRecipesByProductId } from '@/lib/db/queries'
import { getBaseUrl } from '@/lib/metadata-utils'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const productId = Number(id)
  const product = await getProductById(productId)
  if (!product) return { title: 'CV Shop' }

  const recipes = await getRecipesByProductId(productId)
  if (recipes.length === 0) {
    return { title: `${product.zh} · CV Shop` }
  }

  const primaryImage = product.images?.find((i) => i.isPrimary) ?? product.images?.[0]
  const baseUrl = await getBaseUrl()
  const ogImageUrl = primaryImage
    ? `${baseUrl}/api/products/${productId}/images/${primaryImage.id}`
    : undefined

  const title = `${product.zh} 的食谱推荐 · CV Shop`
  const description = `精选 ${recipes.length} 款 ${product.zh} 的家常烹饪做法，配料齐全，步骤清晰，让您轻松上手。`

  return {
    title,
    description,
    openGraph: {
      title: `${product.zh} 的食谱推荐`,
      description,
      images: ogImageUrl ? [{ url: ogImageUrl }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.zh} 的食谱推荐`,
      description,
      images: ogImageUrl ? [ogImageUrl] : [],
    },
  }
}

export default async function ProductRecipesPage({ params }: Props) {
  const { id } = await params
  const productId = Number(id)
  const [product, recipes] = await Promise.all([
    getProductById(productId),
    getRecipesByProductId(productId),
  ])
  if (!product) notFound()
  if (recipes.length === 0) notFound()

  return <RecipeListScreen product={product} recipes={recipes} />
}
