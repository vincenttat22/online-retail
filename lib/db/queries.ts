import { cache } from 'react'
import { db } from './index'
import {
  products,
  productImages,
  productCategories,
  recipes,
  recipeIngredients,
  snailLists,
  orders,
  orderItems,
} from './schema'
import { eq, and, inArray, desc, asc, sql, gte, lt, isNotNull } from 'drizzle-orm'
import type { Product, Recipe, RecipeIngredient, GroupBuyData, GroupBuyProduct, TopSeller, NewArrivalProduct } from '@/lib/types'

function toProduct(row: typeof products.$inferSelect, categoryValue: string | null, images: any[] = []): Product {
  return {
    id: row.id,
    zh: row.name,
    en: '',
    sku: row.sku ?? undefined,
    cat: categoryValue as any,
    price: Number(row.unitPrice),
    unit: row.unit ?? undefined,
    packSize: row.packSize ? Number(row.packSize) : undefined,
    packUnit: row.packUnit ?? undefined,
    desc: row.description ?? '',
    disc: 0,
    images: images.length > 0 ? images : undefined,
    pinyinName: row.pinyinName ?? null,
  }
}

function toImage(row: typeof productImages.$inferSelect) {
  return {
    id: row.id,
    r2Url: row.r2Url,
    altText: row.altText ?? undefined,
    isPrimary: row.isPrimary ?? false,
  }
}

export async function getProducts(limit?: number): Promise<Product[]> {
  try {
    if (limit) {
      // Two-step: limit unique products first, then fetch their images separately.
      // A single JOIN + LIMIT would limit rows not products, returning fewer than expected.
      const productRows = await db
        .select()
        .from(products)
        .leftJoin(productCategories, eq(products.category, productCategories.name))
        .where(and(
          eq(products.active, true),
          eq(products.isPublished, true),
        ))
        .limit(limit)

      if (!productRows.length) return []

      const ids = productRows.map((r) => r.products.id)
      const imageRows = await db
        .select()
        .from(productImages)
        .where(inArray(productImages.productId, ids))

      const imagesByProduct = new Map<number, ReturnType<typeof toImage>[]>()
      for (const img of imageRows) {
        if (!imagesByProduct.has(img.productId)) imagesByProduct.set(img.productId, [])
        imagesByProduct.get(img.productId)!.push(toImage(img))
      }

      return productRows.map((row) => toProduct(row.products, row.product_categories?.name ?? null, imagesByProduct.get(row.products.id) ?? []))
    } else {
      const rows = await db
        .select()
        .from(products)
        .leftJoin(productCategories, eq(products.category, productCategories.name))
        .leftJoin(productImages, eq(products.id, productImages.productId))
        .where(and(
          eq(products.active, true),
          eq(products.isPublished, true),
        ))

      const productMap = new Map<number, any>()
      for (const row of rows) {
        const productRow = row.products
        if (!productMap.has(productRow.id)) {
          productMap.set(productRow.id, { row: productRow, categoryValue: row.product_categories?.name ?? null, images: [] })
        }
        if (row.product_images) {
          productMap.get(productRow.id)!.images.push(toImage(row.product_images))
        }
      }

      return Array.from(productMap.values()).map(({ row, categoryValue, images }) => toProduct(row, categoryValue, images))
    }
  } catch (error) {
    console.error('Failed to fetch products:', error)
    return []
  }
}

export const getProductById = cache(async (id: number): Promise<Product | null> => {
  try {
    const rows = await db
      .select()
      .from(products)
      .leftJoin(productCategories, eq(products.category, productCategories.name))
      .leftJoin(productImages, eq(products.id, productImages.productId))
      .where(and(
        eq(products.id, id),
        eq(products.isPublished, true),
      ))

    if (!rows.length) return null

    const productRow = rows[0].products
    const categoryValue = rows[0].product_categories?.name ?? null
    const images = rows
      .filter(row => row.product_images !== null)
      .map(row => toImage(row.product_images!))

    return toProduct(productRow, categoryValue, images)
  } catch (error) {
    console.error(`Failed to fetch product ${id}:`, error)
    return null
  }
})

function toIngredient(row: typeof recipeIngredients.$inferSelect): RecipeIngredient {
  const followsMatch = row.matchConfidence === 'exact' || row.matchConfidence === 'fuzzy'
  return {
    id: row.id,
    name: row.name,
    quantity: row.quantity ?? undefined,
    unit: row.unit ?? undefined,
    matchedProductId: followsMatch && row.matchedProductId != null ? row.matchedProductId : undefined,
    notes: row.notes ?? undefined,
    displayOrder: row.displayOrder,
  }
}

function toRecipe(row: typeof recipes.$inferSelect): Recipe {
  return {
    id: row.id,
    productId: row.productId,
    titleZh: row.titleZh,
    titleEn: row.titleEn,
    cuisineType: row.cuisineType,
    difficulty: row.difficulty,
    timeMinutes: row.timeMinutes,
    servings: row.servings,
    description: row.description ?? undefined,
    instructions: row.instructions,
    hasHeroImage: row.heroImageUrl != null,
    ingredients: [],
  }
}

export const getRecipesByProductId = cache(async (productId: number): Promise<Recipe[]> => {
  try {
    const rows = await db
      .select()
      .from(recipes)
      .leftJoin(recipeIngredients, eq(recipeIngredients.recipeId, recipes.id))
      .where(and(eq(recipes.productId, productId), eq(recipes.status, 'published')))
      .orderBy(desc(recipes.generatedAt), asc(recipeIngredients.displayOrder))

    const byId = new Map<number, Recipe>()
    for (const row of rows) {
      const r = row.recipes
      if (!byId.has(r.id)) byId.set(r.id, toRecipe(r))
      if (row.recipe_ingredients) {
        byId.get(r.id)!.ingredients.push(toIngredient(row.recipe_ingredients))
      }
    }
    return Array.from(byId.values())
  } catch (error) {
    console.error(`Failed to fetch recipes for product ${productId}:`, error)
    return []
  }
})

export const getRecipeById = cache(async (id: number): Promise<Recipe | null> => {
  try {
    const rows = await db
      .select()
      .from(recipes)
      .leftJoin(recipeIngredients, eq(recipeIngredients.recipeId, recipes.id))
      .where(and(eq(recipes.id, id), eq(recipes.status, 'published')))
      .orderBy(asc(recipeIngredients.displayOrder))

    if (!rows.length) return null

    const recipe = toRecipe(rows[0].recipes)
    for (const row of rows) {
      if (row.recipe_ingredients) {
        recipe.ingredients.push(toIngredient(row.recipe_ingredients))
      }
    }
    return recipe
  } catch (error) {
    console.error(`Failed to fetch recipe ${id}:`, error)
    return null
  }
})

export const getCategories = cache(async () => {
  try {
    return await db.select().from(productCategories).orderBy(productCategories.displayOrder)
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    return []
  }
})

// ─────────────────────────────────────────────────────────────────────────
// HOMEPAGE / JIELONG QUERIES
// ─────────────────────────────────────────────────────────────────────────

async function fetchProductsByIds(ids: number[]): Promise<Map<number, Product>> {
  if (!ids.length) return new Map()

  const productRows = await db
    .select()
    .from(products)
    .leftJoin(productCategories, eq(products.category, productCategories.name))
    .where(inArray(products.id, ids))

  const imageRows = await db
    .select()
    .from(productImages)
    .where(inArray(productImages.productId, ids))

  const imagesByProduct = new Map<number, ReturnType<typeof toImage>[]>()
  for (const img of imageRows) {
    if (!imagesByProduct.has(img.productId)) imagesByProduct.set(img.productId, [])
    imagesByProduct.get(img.productId)!.push(toImage(img))
  }

  const map = new Map<number, Product>()
  for (const row of productRows) {
    map.set(
      row.products.id,
      toProduct(row.products, row.product_categories?.name ?? null, imagesByProduct.get(row.products.id) ?? []),
    )
  }
  return map
}

// Sydney's UTC offset (in minutes) observed at the given instant. Handles the
// AEST/AEDT daylight-saving switch via Intl instead of a hardcoded +10.
function sydneyOffsetMinutes(at: Date): number {
  const offsetPart = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Australia/Sydney',
    timeZoneName: 'shortOffset',
  })
    .formatToParts(at)
    .find((p) => p.type === 'timeZoneName')?.value
  const match = offsetPart?.match(/GMT([+-]\d+)(?::(\d+))?/)
  if (!match) return 600 // fall back to AEST (+10) if Intl data is unavailable
  return parseInt(match[1], 10) * 60 + (match[1].startsWith('-') ? -1 : 1) * parseInt(match[2] ?? '0', 10)
}

// Resolves the [start, end) UTC instants for "last week" (Mon 00:00 -> next
// Mon 00:00) as observed in Australia/Sydney local time, relative to `now`.
function getLastWeekRangeSydney(now: Date = new Date()): { start: Date; end: Date } {
  const offsetMinutes = sydneyOffsetMinutes(now)
  const shifted = new Date(now.getTime() + offsetMinutes * 60000)
  const dow = shifted.getUTCDay() // 0 = Sun .. 6 = Sat
  const daysSinceMonday = (dow + 6) % 7
  const thisMondayShifted = new Date(
    Date.UTC(shifted.getUTCFullYear(), shifted.getUTCMonth(), shifted.getUTCDate() - daysSinceMonday),
  )
  const thisMonday = new Date(thisMondayShifted.getTime() - offsetMinutes * 60000)
  const lastMonday = new Date(thisMonday.getTime() - 7 * 24 * 3600 * 1000)
  return { start: lastMonday, end: thisMonday }
}

// snail_lists.ended_at is a `timestamp without time zone` column, but the
// literal digits stored in it are Sydney wall-clock time (the Telegram bot
// that writes it runs with the server's local Australia/Sydney clock — see
// `parseCustomEndTime`/`target.setHours(...)` in online-shop's webhook).
// Drizzle's default column reader instead assumes naive timestamps are UTC
// (`new Date(value + '+0000')`), which silently shifts this value by the
// Sydney UTC offset (e.g. "09:00:00" gets read as 09:00 UTC = 19:00 Sydney,
// 10 hours later than intended). We bypass that by reading the raw text and
// parsing it ourselves as Sydney local time.
function parseSydneyNaiveTimestamp(text: string | null): Date | null {
  if (!text) return null
  const m = text.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2}):(\d{2})/)
  if (!m) return null
  const [, y, mo, d, h, mi, s] = m.map(Number)
  const approxUtc = new Date(Date.UTC(y, mo - 1, d, h, mi, s))
  const offsetMinutes = sydneyOffsetMinutes(approxUtc)
  return new Date(approxUtc.getTime() - offsetMinutes * 60000)
}

export const getActiveGroupBuy = cache(async (): Promise<GroupBuyData | null> => {
  try {
    const [list] = await db
      .select({
        id: snailLists.id,
        title: snailLists.title,
        createdAt: snailLists.createdAt,
        endedAtRaw: sql<string | null>`${snailLists.endedAt}::text`,
      })
      .from(snailLists)
      .orderBy(desc(snailLists.createdAt))
      .limit(1)
    if (!list) return null
    const endedAt = parseSydneyNaiveTimestamp(list.endedAtRaw)

    const [totalRow] = await db
      .select({ count: sql<number>`count(distinct ${orders.id})` })
      .from(orders)
      .where(eq(orders.snailListId, list.id))
    const totalOrders = Number(totalRow?.count ?? 0)

    // Unlimited: every distinct product ordered in this snail list, ranked by
    // order count. The homepage preview only shows the top 12 as cards, but
    // "查看完整列表" needs the full set to link to the catalogue filtered to
    // exactly what's in this Jielong.
    const itemRows = await db
      .select({
        productId: orderItems.productId,
        orderCount: sql<number>`count(distinct ${orders.id})`,
      })
      .from(orderItems)
      .innerJoin(orders, eq(orders.id, orderItems.orderId))
      .where(eq(orders.snailListId, list.id))
      .groupBy(orderItems.productId)
      .orderBy(desc(sql`count(distinct ${orders.id})`))

    const allProductIds = itemRows.map((r) => r.productId).filter((id): id is number => id != null)
    const previewRows = itemRows.slice(0, 12)

    const productMap = await fetchProductsByIds(previewRows.map((r) => r.productId).filter((id): id is number => id != null))

    const productsOut: GroupBuyProduct[] = previewRows
      .map((r) => {
        const p = r.productId != null ? productMap.get(r.productId) : undefined
        if (!p) return null
        return { ...p, orderCount: Number(r.orderCount) }
      })
      .filter((p): p is GroupBuyProduct => p !== null)

    return {
      snailListId: list.id,
      title: list.title,
      endedAt: endedAt ? endedAt.toISOString() : null,
      totalOrders,
      products: productsOut,
      allProductIds,
    }
  } catch (error) {
    console.error('Failed to fetch active group buy:', error)
    return null
  }
})

export const getLastWeekTopSellers = cache(async (limit = 5): Promise<TopSeller[]> => {
  try {
    const { start, end } = getLastWeekRangeSydney()

    const itemRows = await db
      .select({
        productId: orderItems.productId,
        orderCount: sql<number>`count(distinct ${orders.id})`,
      })
      .from(orderItems)
      .innerJoin(orders, eq(orders.id, orderItems.orderId))
      .where(and(gte(orders.createdAt, start), lt(orders.createdAt, end)))
      .groupBy(orderItems.productId)
      .orderBy(desc(sql`count(distinct ${orders.id})`))
      .limit(limit)

    const ids = itemRows.map((r) => r.productId).filter((id): id is number => id != null)
    const productMap = await fetchProductsByIds(ids)

    return itemRows
      .map((r, i) => {
        const p = r.productId != null ? productMap.get(r.productId) : undefined
        if (!p) return null
        return { ...p, rank: i + 1, orderCount: Number(r.orderCount) }
      })
      .filter((p): p is TopSeller => p !== null)
  } catch (error) {
    console.error('Failed to fetch last week top sellers:', error)
    return []
  }
})

export const getNewArrivals = cache(async (limit = 6): Promise<NewArrivalProduct[]> => {
  try {
    const idRows = await db
      .select({ id: products.id, createdAt: products.createdAt })
      .from(products)
      .where(and(
        eq(products.active, true),
        eq(products.isPublished, true),
        isNotNull(products.createdAt),
      ))
      .orderBy(desc(products.createdAt))
      .limit(limit)

    if (!idRows.length) return []
    const productMap = await fetchProductsByIds(idRows.map((r) => r.id))
    const now = Date.now()

    return idRows
      .map((r) => {
        const p = productMap.get(r.id)
        if (!p) return null
        const daysAgo = Math.max(0, Math.floor((now - new Date(r.createdAt!).getTime()) / 86400000))
        return { ...p, daysAgo }
      })
      .filter((p): p is NewArrivalProduct => p !== null)
  } catch (error) {
    console.error('Failed to fetch new arrivals:', error)
    return []
  }
})
