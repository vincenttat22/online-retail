'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { ColorTheme, Theme, PromoFx } from '@/lib/types'
import { CV_THEMES, promoFx } from '@/lib/tokens'

interface ThemeContextValue {
  colorTheme: ColorTheme
  setColorTheme: (t: ColorTheme) => void
  promoIntensity: number
  setPromoIntensity: (v: number) => void
  theme: Theme
  fx: PromoFx
}

const ThemeCtx = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [colorTheme, setColorThemeState] = useState<ColorTheme>('bold')
  const [promoIntensity, setPromoIntensityState] = useState(6)

  const theme = CV_THEMES[colorTheme]
  const fx = promoFx(promoIntensity)

  useEffect(() => {
    const saved = localStorage.getItem('cv-theme') as ColorTheme | null
    const savedIntensity = localStorage.getItem('cv-promo-intensity')
    if (saved && CV_THEMES[saved]) setColorThemeState(saved)
    if (savedIntensity) setPromoIntensityState(Number(savedIntensity))
  }, [])

  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--cv-bg', theme.bg)
    root.style.setProperty('--cv-surface', theme.surface)
    root.style.setProperty('--cv-ink', theme.ink)
    root.style.setProperty('--cv-ink-soft', theme.inkSoft)
    root.style.setProperty('--cv-ink-muted', theme.inkMuted)
    root.style.setProperty('--cv-line', theme.line)
    root.style.setProperty('--cv-accent', theme.accent)
    root.style.setProperty('--cv-accent-ink', theme.accentInk)
    root.style.setProperty('--cv-accent-soft', theme.accentSoft)
    root.style.setProperty('--cv-gold', theme.gold)
    root.style.setProperty('--cv-gold-soft', theme.goldSoft)
    root.style.setProperty('--cv-chip-bg', theme.chipBg)
    root.style.setProperty('--cv-chip-ink', theme.chipInk)
    root.style.setProperty('--cv-sale-bg', theme.saleBg)
    root.style.setProperty('--cv-sale-ink', theme.saleInk)
    root.style.setProperty('--cv-hero-bg', theme.heroBg)
    root.style.setProperty('--cv-hero-ink', theme.heroInk)
  }, [theme])

  const setColorTheme = useCallback((t: ColorTheme) => {
    setColorThemeState(t)
    localStorage.setItem('cv-theme', t)
  }, [])

  const setPromoIntensity = useCallback((v: number) => {
    setPromoIntensityState(v)
    localStorage.setItem('cv-promo-intensity', String(v))
  }, [])

  return (
    <ThemeCtx.Provider value={{ colorTheme, setColorTheme, promoIntensity, setPromoIntensity, theme, fx }}>
      {children}
    </ThemeCtx.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeCtx)
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider')
  return ctx
}
