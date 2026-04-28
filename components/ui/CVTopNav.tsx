'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { useTheme } from '@/context/ThemeContext'
import CVIcon from './CVIcon'

const NAV_LINKS = [
  { label: '首页',     href: '/' },
  { label: '全部商品', href: '/catalogue' },
  { label: '优惠专区', href: '/promotions' },
  { label: '组合套装', href: '/promotions' },
  { label: '关于我们', href: '/' },
]

export default function CVTopNav() {
  const { theme } = useTheme()
  const pathname = usePathname()
  const router = useRouter()
  const [q, setQ] = useState('')

  const isActive = (href: string) => {
    if (href === '/' && pathname === '/') return true
    if (href !== '/' && pathname.startsWith(href)) return true
    return false
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
      <Link href="/" className="shrink-0 text-left">
        <div className="font-mono text-[9px] tracking-[2px]" style={{ color: theme.inkMuted }}>
          CV·SHOP
        </div>
        <div
          className="font-serif text-[18px] xl:text-[22px] font-black tracking-tight leading-none"
          style={{ color: theme.ink }}
        >
          严选小铺
        </div>
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
            onChange={(e) => setQ(e.target.value)}
            placeholder="搜索商品 · 红糖姜茶"
            className="flex-1 bg-transparent border-0 outline-0 text-[12px]"
            style={{ color: theme.ink, fontFamily: 'inherit' }}
          />
        </div>
      </form>

      {/* Icon actions */}
      <div className="flex gap-1.5 shrink-0">
        <button
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: theme.surface, color: theme.ink }}
        >
          <CVIcon name="heart" size={16} />
        </button>
        <button
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: theme.surface, color: theme.ink }}
        >
          <CVIcon name="cart" size={16} />
        </button>
        <button
          className="hidden xl:flex w-9 h-9 rounded-full items-center justify-center"
          style={{ background: theme.surface, color: theme.ink }}
        >
          <CVIcon name="user" size={16} />
        </button>
      </div>
    </header>
  )
}
