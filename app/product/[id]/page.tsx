import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ProductDetailScreen from '@/components/screens/ProductDetailScreen'
import SettingsPanel from '@/components/ui/SettingsPanel'
import { getProductById, getProducts } from '@/lib/db/queries'
import { getBaseUrl } from '@/lib/metadata-utils'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const product = await getProductById(Number(id))

  if (!product) {
    return { title: 'CV Shop' }
  }

  const primaryImage = product.images?.find((i) => i.isPrimary) ?? product.images?.[0]
  const baseUrl = await getBaseUrl()

  const ogImageUrl = primaryImage
    ? `${baseUrl}/api/products/${id}/images/${primaryImage.id}`
    : undefined

  return {
    title: `${product.zh} · CV Shop`,
    description: product.desc,
    openGraph: {
      title: product.zh,
      description: product.desc,
      images: ogImageUrl ? [{ url: ogImageUrl }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: product.zh,
      description: product.desc,
      images: ogImageUrl ? [ogImageUrl] : [],
    },
  }
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params
  const [product, allProducts] = await Promise.all([
    getProductById(Number(id)),
    getProducts(),
  ])

  if (!product) notFound()

  const related = allProducts.filter((p) => p.id !== product.id).slice(0, 4)

  return (
    <>
      <ProductDetailScreen product={product} relatedProducts={related} />
      <SettingsPanel />
    </>
  )
}
