import { PRODUCTS } from '@/lib/data'
import ProductDetailScreen from '@/components/screens/ProductDetailScreen'
import SettingsPanel from '@/components/ui/SettingsPanel'

export async function generateStaticParams() {
  return PRODUCTS.map((p) => ({ id: String(p.id) }))
}

interface Props {
  params: Promise<{ id: string }>
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params
  const productId = Number(id)
  return (
    <>
      <ProductDetailScreen productId={productId} />
      <SettingsPanel />
    </>
  )
}
