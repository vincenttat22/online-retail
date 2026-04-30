import { Suspense } from 'react'
import CataloguePageClient from './CataloguePageClient'
import SettingsPanel from '@/components/ui/SettingsPanel'
import { getProducts } from '@/lib/db/queries'

export const dynamic = 'force-dynamic'

export default async function CataloguePage() {
  const products = await getProducts()

  return (
    <>
      <Suspense>
        <CataloguePageClient products={products} />
      </Suspense>
      <SettingsPanel />
    </>
  )
}
