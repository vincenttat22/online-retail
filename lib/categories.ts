export const PRODUCT_CATEGORIES = {
  SNACK: {
    en: 'SNACK',
    zh: '零食',
  },
  MEAT_SEAFOOD: {
    en: 'MEAT_SEAFOOD',
    zh: '肉类海鲜',
  },
  HOUSEHOLD: {
    en: 'HOUSEHOLD',
    zh: '日用品',
  },
  BEAUTY_HEALTH: {
    en: 'BEAUTY_HEALTH',
    zh: '美容保健',
  },
  OTHER: {
    en: 'OTHER',
    zh: '其他',
  },
} as const

export type CategoryKey = keyof typeof PRODUCT_CATEGORIES

export function getCategoryName(category: CategoryKey, lang: 'en' | 'zh' = 'en'): string {
  return PRODUCT_CATEGORIES[category]?.[lang] || category
}

export function getAllCategories(lang: 'en' | 'zh' = 'en'): Array<{ key: CategoryKey; name: string }> {
  return Object.entries(PRODUCT_CATEGORIES).map(([key, value]) => ({
    key: key as CategoryKey,
    name: value[lang],
  }))
}
