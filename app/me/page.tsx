import { Suspense } from 'react'
import AboutScreen from '@/components/screens/AboutScreen'
import SettingsPanel from '@/components/ui/SettingsPanel'

export default function MePage() {
  return (
    <>
      <AboutScreen />
      <Suspense fallback={null}>
        <SettingsPanel />
      </Suspense>
    </>
  )
}
