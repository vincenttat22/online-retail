import PromotionsScreen from '@/components/screens/PromotionsScreen'
import DesktopPromotionsScreen from '@/components/screens/desktop/DesktopPromotionsScreen'
import CVTabBar from '@/components/ui/CVTabBar'
import SettingsPanel from '@/components/ui/SettingsPanel'

export default function PromotionsPage() {
  return (
    <>
      {/* Mobile */}
      <div className="md:hidden">
        <div className="mx-auto max-w-[430px] relative">
          <PromotionsScreen />
        </div>
        <CVTabBar />
      </div>

      {/* Tablet / Desktop */}
      <div className="hidden md:block">
        <DesktopPromotionsScreen />
      </div>

      <SettingsPanel />
    </>
  )
}
