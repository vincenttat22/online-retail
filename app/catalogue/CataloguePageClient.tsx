'use client'

import { useSearchParams } from 'next/navigation'
import CatalogueScreen from '@/components/screens/CatalogueScreen'

export default function CataloguePageClient() {
  const params = useSearchParams()
  return (
    <CatalogueScreen
      initialCat={params.get('cat') ?? 'all'}
      initialQ={params.get('q') ?? ''}
    />
  )
}
