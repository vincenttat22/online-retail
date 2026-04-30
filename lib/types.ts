export interface ProductImage {
  id: number
  r2Url: string
  altText?: string
  isPrimary?: boolean
}

export interface Product {
  id: number
  zh: string
  en: string
  cat?: 'MEAT_SEAFOOD' | 'SNACKS' | 'HOUSEHOLD' | 'BEAUTY_HEALTH' | 'OTHER'
  price: number
  unit?: string
  packSize?: number
  packUnit?: string
  desc: string
  disc: number
  badge?: string
  images?: ProductImage[]
}

export interface Bundle {
  id: string
  zh: string
  en: string
  items: number[]
  price: number
  orig: number
  tag: string
  theme: 'MEAT_SEAFOOD' | 'SNACKS' | 'HOUSEHOLD' | 'BEAUTY_HEALTH' | 'OTHER'
  member?: boolean
}

export type ColorTheme = 'bold' | 'selective' | 'neutral'

export interface Theme {
  name: string
  bg: string
  surface: string
  ink: string
  inkSoft: string
  inkMuted: string
  line: string
  lineSoft: string
  accent: string
  accentInk: string
  accentSoft: string
  gold: string
  goldSoft: string
  chipBg: string
  chipInk: string
  saleBg: string
  saleInk: string
  heroBg: string
  heroInk: string
}

export interface PromoFx {
  badges: boolean
  saleStrip: boolean
  countdown: boolean
  ribbon: boolean
  pulse: boolean
  flameSparkle: boolean
  bigTimer: boolean
  intensity: number
}
