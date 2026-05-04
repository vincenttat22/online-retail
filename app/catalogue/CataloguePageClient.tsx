'use client'

import { useSearchParams } from 'next/navigation'
import CatalogueScreen from '@/components/screens/CatalogueScreen'
import type { Product } from '@/lib/types'
import type { DbProductCategory } from '@/lib/db/schema'

interface Props {
  products: Product[]
  categories: DbProductCategory[]
}

export default function CataloguePageClient({ products, categories }: Props) {
  const params = useSearchParams()
  return (
    <CatalogueScreen
      products={products}
      categories={categories}
      initialCat={params.get('cat') ?? 'all'}
      initialQ={params.get('q') ?? ''}
    />
  )
}
