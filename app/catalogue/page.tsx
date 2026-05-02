import type { Metadata } from 'next'
import { Suspense } from 'react'
import CataloguePageClient from './CataloguePageClient'
import SettingsPanel from '@/components/ui/SettingsPanel'
import { getProducts } from '@/lib/db/queries'
import { getDefaultMetadata } from '@/lib/metadata-utils'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  return getDefaultMetadata()
}

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
