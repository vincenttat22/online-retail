import { notFound } from 'next/navigation'
import ProductDetailScreen from '@/components/screens/ProductDetailScreen'
import SettingsPanel from '@/components/ui/SettingsPanel'
import { getProductById, getProducts } from '@/lib/db/queries'

export async function generateStaticParams() {
  const products = await getProducts()
  return products.map((p) => ({ id: String(p.id) }))
}

interface Props {
  params: Promise<{ id: string }>
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
