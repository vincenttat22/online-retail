import { cache } from 'react'
import { db } from './index'
import {
  products,
  productImages,
  productCategories,
  recipes,
  recipeIngredients,
} from './schema'
import { eq, and, inArray, desc, asc } from 'drizzle-orm'
import type { Product, Recipe, RecipeIngredient } from '@/lib/types'

function toProduct(row: typeof products.$inferSelect, categoryValue: string | null, images: any[] = []): Product {
  return {
    id: row.id,
    zh: row.name,
    en: row.sku ?? '',
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
