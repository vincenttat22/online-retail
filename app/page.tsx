import type { Metadata } from 'next'
import HomeScreen from '@/components/screens/HomeScreen'
import { getActiveGroupBuy, getLastWeekTopSellers, getNewArrivals } from '@/lib/db/queries'
import { getDefaultMetadata } from '@/lib/metadata-utils'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  return getDefaultMetadata()
}

export default async function HomePage() {
  const [groupBuy, topSellers, newArrivals] = await Promise.all([
    getActiveGroupBuy(),
    getLastWeekTopSellers(),
    getNewArrivals(),
  ])

  return <HomeScreen groupBuy={groupBuy} topSellers={topSellers} newArrivals={newArrivals} />
}
