import { Suspense } from 'react'
import CataloguePageClient from './CataloguePageClient'
import CVTabBar from '@/components/ui/CVTabBar'
import SettingsPanel from '@/components/ui/SettingsPanel'

export default function CataloguePage() {
  return (
    <>
      <Suspense>
        <CataloguePageClient />
      </Suspense>
      <CVTabBar />
      <SettingsPanel />
    </>
  )
}
