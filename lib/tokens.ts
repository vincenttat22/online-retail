import type { ColorTheme, Theme, PromoFx } from './types'

export const CV_THEMES: Record<ColorTheme, Theme> = {
  bold: {
    name: '朱红 · Bold',
    bg: '#fbf6ee',
    surface: '#ffffff',
    ink: '#1a1614',
    inkSoft: '#5b524b',
    inkMuted: '#8e857d',
    line: 'rgba(26,22,20,0.08)',
    lineSoft: 'rgba(26,22,20,0.04)',
    accent: '#c43823',
    accentInk: '#ffffff',
    accentSoft: '#fbe9e2',
    gold: '#a07731',
    goldSoft: '#f3e9d1',
    chipBg: '#1a1614',
    chipInk: '#fbf6ee',
    saleBg: '#c43823',
    saleInk: '#ffffff',
    heroBg: '#c43823',
    heroInk: '#fbf6ee',
  },
  selective: {
    name: '克制 · Selective',
    bg: '#f5f1ea',
    surface: '#ffffff',
    ink: '#171513',
    inkSoft: '#5b524b',
    inkMuted: '#8e857d',
    line: 'rgba(23,21,19,0.08)',
    lineSoft: 'rgba(23,21,19,0.04)',
    accent: '#a3301f',
    accentInk: '#ffffff',
    accentSoft: '#f4e4dd',
    gold: '#9a7026',
    goldSoft: '#efe4cc',
    chipBg: '#171513',
    chipInk: '#f5f1ea',
    saleBg: '#a3301f',
    saleInk: '#ffffff',
    heroBg: '#171513',
    heroInk: '#f5f1ea',
  },
  neutral: {
    name: '素雅 · Neutral',
    bg: '#f4f0e9',
    surface: '#ffffff',
    ink: '#1c1a17',
    inkSoft: '#5b554d',
    inkMuted: '#928a7e',
    line: 'rgba(28,26,23,0.09)',
    lineSoft: 'rgba(28,26,23,0.04)',
    accent: '#3a342d',
    accentInk: '#f4f0e9',
    accentSoft: '#ece6db',
    gold: '#8c6d2a',
    goldSoft: '#ece2c8',
    chipBg: '#3a342d',
    chipInk: '#f4f0e9',
    saleBg: '#8c6d2a',
    saleInk: '#ffffff',
    heroBg: '#ece6db',
    heroInk: '#1c1a17',
  },
}

export function promoFx(level: number): PromoFx {
  const lv = Math.max(0, Math.min(10, level))
  return {
    badges: lv >= 1,
    saleStrip: lv >= 3,
    countdown: lv >= 4,
    ribbon: lv >= 6,
    pulse: lv >= 7,
    flameSparkle: lv >= 8,
    bigTimer: lv >= 5,
    intensity: lv,
  }
}

export const CATEGORIES = [
  { id: 'all',           zh: '全部',     en: 'All' },
  { id: 'MEAT_SEAFOOD',  zh: '肉类海鲜',  en: 'Meat & Seafood' },
  { id: 'SNACKS',        zh: '零食',     en: 'Snacks' },
  { id: 'FROZEN_FOOD',   zh: '冷冻食品',  en: 'Frozen Food' },
  { id: 'HOUSEHOLD',     zh: '日用品',   en: 'Household' },
  { id: 'BEAUTY_HEALTH', zh: '美容保健',  en: 'Beauty & Health' },
  { id: 'OTHER',         zh: '其他',     en: 'Other' },
] as const

export const PLACEHOLDER_TONES = ['a', 'b', 'c', 'd', 'e', 'f'] as const
export type PlaceholderTone = (typeof PLACEHOLDER_TONES)[number]

export const TONE_PALETTES: Record<PlaceholderTone, [string, string, string]> = {
  a: ['#e7ddc9', '#d6c9a8', '#8e7a52'],
  b: ['#e8d5cd', '#d6b9ae', '#8c5b4d'],
  c: ['#d8d8c8', '#bcbca8', '#5e5e4f'],
  d: ['#e5cebd', '#cea38a', '#7d4a32'],
  e: ['#dfc9b8', '#c8a585', '#704a30'],
  f: ['#e3dccc', '#c1b89e', '#6f6650'],
}

export function toneFor(id: number): PlaceholderTone {
  return PLACEHOLDER_TONES[(id - 1) % PLACEHOLDER_TONES.length]
}
