'use client'

import { useSearchParams } from 'next/navigation'
import CatalogueScreen from '@/components/screens/CatalogueScreen'

export default function CataloguePageClient() {
  const params = useSearchParams()
  const cat = params.get('cat') ?? 'all'
  return <CatalogueScreen initialCat={cat} />
}
