'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useTheme } from '@/context/ThemeContext'
import CVIcon from './CVIcon'

const NAV_LINKS = [
  { label: '全部商品', href: '/catalogue' },
  { label: '关于',     href: '/me' },
]

export default function CVTopNav() {
  const { theme } = useTheme()
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [q, setQ] = useState(searchParams.get('q') ?? '')

  useEffect(() => {
    setQ(searchParams.get('q') ?? '')
  }, [searchParams])

  const isActive = (href: string) => {
    if (href === '/' && pathname === '/') return true
    if (href !== '/' && pathname.startsWith(href)) return true
    if (href === '/me' && pathname.startsWith('/about')) return true
    return false
  }

  const handleChange = (value: string) => {
    setQ(value)
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set('q', value)
    else params.delete('q')
    const qs = params.toString()
    const target = `/catalogue${qs ? `?${qs}` : ''}`
    if (pathname === '/catalogue') {
      router.replace(target, { scroll: false })
    } else {
      router.push(target)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(q ? `/catalogue?q=${encodeURIComponent(q)}` : '/catalogue')
  }

  return (
    <header
      className="flex items-center gap-4 xl:gap-8 px-6 xl:px-10 py-3.5 xl:py-4 sticky top-0 z-30"
      style={{ background: theme.bg, borderBottom: `0.5px solid ${theme.line}` }}
    >
      {/* Logo */}
      <Link href="/" className="shrink-0 text-left drop-shadow-md">
        <Image
          src="/CV-logo-white.svg"
          alt="CV Shop"
          width={50}
          height={60}
          priority
        />
      </Link>

      {/* Divider */}
      <div className="hidden xl:block w-px h-7 shrink-0" style={{ background: theme.line }} />

      {/* Nav links */}
      <nav className="flex gap-4 xl:gap-6 flex-1 overflow-x-auto">
        {NAV_LINKS.map((l) => {
          const active = isActive(l.href)
          return (
            <Link
              key={l.label}
              href={l.href}
              className="text-[13px] whitespace-nowrap py-1 border-b-[1.5px] transition-colors"
              style={{
                color: active ? theme.ink : theme.inkSoft,
                fontWeight: active ? 600 : 400,
                borderColor: active ? theme.accent : 'transparent',
              }}
            >
              {l.label}
            </Link>
          )
        })}
      </nav>

      {/* Search */}
      <form onSubmit={handleSearch} className="shrink-0">
        <div
          className="flex items-center gap-2 px-3.5 rounded-full h-9 w-[200px] xl:w-[280px]"
          style={{ background: theme.surface, border: `0.5px solid ${theme.line}` }}
        >
          <CVIcon name="search" size={14} stroke={theme.inkMuted} />
          <input
            value={q}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="搜索商品 · 红糖姜茶"
            className="flex-1 bg-transparent border-0 outline-none focus:outline-none focus:ring-0 text-[12px] min-w-0"
            style={{ color: theme.ink, fontFamily: 'inherit' }}
          />
          {q && (
            <button
              type="button"
              onClick={() => handleChange('')}
              className="p-0 border-0 bg-transparent cursor-pointer shrink-0"
              style={{ color: theme.inkMuted }}
            >
              <CVIcon name="x" size={12} />
            </button>
          )}
        </div>
      </form>

    </header>
  )
}
