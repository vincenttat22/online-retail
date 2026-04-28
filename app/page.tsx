import HomeScreen from '@/components/screens/HomeScreen'
import DesktopHomeScreen from '@/components/screens/desktop/DesktopHomeScreen'
import CVTabBar from '@/components/ui/CVTabBar'
import SettingsPanel from '@/components/ui/SettingsPanel'

export default function HomePage() {
  return (
    <>
      {/* Mobile */}
      <div className="md:hidden">
        <div className="mx-auto max-w-[430px] relative">
          <HomeScreen />
        </div>
        <CVTabBar />
      </div>

      {/* Tablet / Desktop */}
      <div className="hidden md:block">
        <DesktopHomeScreen />
      </div>

      <SettingsPanel />
    </>
  )
}
