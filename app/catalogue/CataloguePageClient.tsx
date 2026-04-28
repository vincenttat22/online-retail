'use client'

import { useSearchParams } from 'next/navigation'
import CatalogueScreen from '@/components/screens/CatalogueScreen'
import type { Product } from '@/lib/types'

interface Props {
  products: Product[]
}

export default function CataloguePageClient({ products }: Props) {
  const params = useSearchParams()
  return (
    <CatalogueScreen
      products={products}
      initialCat={params.get('cat') ?? 'all'}
      initialQ={params.get('q') ?? ''}
    />
  )
}
