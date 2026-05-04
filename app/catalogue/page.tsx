import type { Metadata } from 'next'
import { Suspense } from 'react'
import CataloguePageClient from './CataloguePageClient'
import SettingsPanel from '@/components/ui/SettingsPanel'
import { getProducts, getCategories } from '@/lib/db/queries'
import { getDefaultMetadata } from '@/lib/metadata-utils'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  return getDefaultMetadata()
}

export default async function CataloguePage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ])

  return (
    <>
      <Suspense>
        <CataloguePageClient products={products} categories={categories} />
      </Suspense>
      <SettingsPanel />
    </>
  )
}
