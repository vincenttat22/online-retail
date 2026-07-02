'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

export function VisitorTracker() {
  const pathname = usePathname()
  const lastTrackedPath = useRef<string | null>(null)

  useEffect(() => {
    // Only track when the pathname changes to a new path
    if (pathname && pathname !== lastTrackedPath.current) {
      lastTrackedPath.current = pathname
      
      // Avoid tracking non-page paths (API routes, static files, next dev routes, etc.)
      const isApiRoute = pathname.startsWith('/api')
      const isNextRoute = pathname.startsWith('/_next')
      const isStaticFile = pathname.includes('.')
      
      if (isApiRoute || isNextRoute || isStaticFile) {
        return
      }

      fetch('/api/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ path: pathname }),
      }).catch((err) => {
        console.error('[VisitorTracker] Failed to track page view:', err)
      })
    }
  }, [pathname])

  return null
}
