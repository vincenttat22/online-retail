import HomeScreen from '@/components/screens/HomeScreen'
import CVTabBar from '@/components/ui/CVTabBar'
import SettingsPanel from '@/components/ui/SettingsPanel'

export default function HomePage() {
  return (
    <>
      <HomeScreen />
      <CVTabBar />
      <SettingsPanel />
    </>
  )
}
