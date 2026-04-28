import { Suspense } from 'react'
import CataloguePageClient from './CataloguePageClient'
import CVTabBar from '@/components/ui/CVTabBar'
import SettingsPanel from '@/components/ui/SettingsPanel'
import { getProducts } from '@/lib/db/queries'

export default async function CataloguePage() {
  const products = await getProducts()

  return (
    <>
      <Suspense>
        <CataloguePageClient products={products} />
      </Suspense>
      <CVTabBar />
      <SettingsPanel />
    </>
  )
}
