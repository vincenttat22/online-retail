import type { Metadata, Viewport } from 'next'
import { Suspense } from 'react'
import './globals.css'
import { ThemeProvider } from '@/context/ThemeContext'
import CVTopNav from '@/components/ui/CVTopNav'

export const metadata: Metadata = {
  title: 'CV Shop · 卡门小铺',
  description: '只卖我们相信的好东西 · 从食物到生活，从日常到品质，用心为你甄选每一件商品',
  icons: {
    icon: '/favicon.ico',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#fbf6ee',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;700;900&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeProvider>
          <div className="min-h-screen bg-cv-bg">
            {/* Top nav: tablet & desktop only */}
            <div className="hidden md:block">
              <Suspense fallback={null}>
                <CVTopNav />
              </Suspense>
            </div>
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
