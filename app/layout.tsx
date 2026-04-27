import type { Metadata, Viewport } from 'next'
import './globals.css'
import { ThemeProvider } from '@/context/ThemeContext'

export const metadata: Metadata = {
  title: 'CV Shop · 严选小铺',
  description: '精选日用百货 · 零食茶饮 · 美妆护肤',
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
            <div className="mx-auto max-w-[430px] min-h-screen relative bg-cv-bg">
              {children}
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
