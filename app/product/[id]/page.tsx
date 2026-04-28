import { PRODUCTS } from '@/lib/data'
import ProductDetailScreen from '@/components/screens/ProductDetailScreen'
import DesktopDetailScreen from '@/components/screens/desktop/DesktopDetailScreen'
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
      {/* Mobile */}
      <div className="md:hidden">
        <div className="mx-auto max-w-[430px] relative">
          <ProductDetailScreen productId={productId} />
        </div>
      </div>

      {/* Tablet / Desktop */}
      <div className="hidden md:block">
        <DesktopDetailScreen productId={productId} />
      </div>

      <SettingsPanel />
    </>
  )
}
