'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import CVIcon from './CVIcon'

const TABS = [
  { id: 'home',  href: '/',           icon: 'home',  label: '首页' },
  { id: 'cat',   href: '/catalogue',  icon: 'grid',  label: '分类' },
  { id: 'promo', href: '/promotions', icon: 'gift',  label: '优惠' },
  { id: 'me',    href: '/me',         icon: 'user',  label: '我的' },
]

export default function CVTabBar() {
  const pathname = usePathname()

  const activeTab =
    pathname === '/' ? 'home'
    : pathname.startsWith('/catalogue') ? 'cat'
    : pathname.startsWith('/promotions') ? 'promo'
    : pathname.startsWith('/me') ? 'me'
    : 'home'

  return (
    <div
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] pb-7 pt-2 flex justify-around items-center z-30"
      style={{ background: `linear-gradient(to top, var(--cv-bg) 70%, transparent)` }}
    >
      {TABS.map((t) => {
        const isActive = activeTab === t.id
        return (
          <Link
            key={t.id}
            href={t.href}
            className="flex flex-col items-center gap-0.5 px-2.5 py-1"
            style={{ color: isActive ? 'var(--cv-accent)' : 'var(--cv-ink-muted)' }}
          >
            <CVIcon name={t.icon} size={22} sw={isActive ? 2 : 1.6} />
            <span className={`text-[10px] tracking-wide ${isActive ? 'font-semibold' : 'font-normal'}`}>
              {t.label}
            </span>
          </Link>
        )
      })}
    </div>
  )
}
