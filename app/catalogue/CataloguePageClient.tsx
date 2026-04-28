'use client'

import { useSearchParams } from 'next/navigation'
import CatalogueScreen from '@/components/screens/CatalogueScreen'
import DesktopCatalogueScreen from '@/components/screens/desktop/DesktopCatalogueScreen'

export default function CataloguePageClient() {
  const params = useSearchParams()
  const cat = params.get('cat') ?? 'all'
  const q = params.get('q') ?? ''

  return (
    <>
      {/* Mobile */}
      <div className="md:hidden">
        <div className="mx-auto max-w-[430px] relative">
          <CatalogueScreen initialCat={cat} />
        </div>
      </div>

      {/* Tablet / Desktop */}
      <div className="hidden md:block">
        <DesktopCatalogueScreen initialCat={cat} initialQ={q} />
      </div>
    </>
  )
}
