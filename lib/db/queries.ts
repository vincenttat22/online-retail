import { db } from './index'
import { products, productImages } from './schema'
import { eq, and } from 'drizzle-orm'
import type { Product } from '@/lib/types'

async function getImagesForProduct(productId: number) {
  const images = await db
    .select()
    .from(productImages)
    .where(eq(productImages.productId, productId))
  return images.map(img => ({
    id: img.id,
    r2Url: img.r2Url,
    altText: img.altText ?? undefined,
    isPrimary: img.isPrimary ?? false,
  }))
}

function toProduct(row: typeof products.$inferSelect, images: any[] = []): Product {
  return {
    id: row.id,
    zh: row.name,
    en: row.sku ?? '',
    cat: row.category as any,
    price: Number(row.unitPrice),
    unit: row.unit ?? undefined,
    packSize: row.packSize ? Number(row.packSize) : undefined,
    packUnit: row.packUnit ?? undefined,
    desc: row.description ?? '',
    disc: 0,
    images: images.length > 0 ? images : undefined,
  }
}

export async function getProducts(): Promise<Product[]> {
  const rows = await db
    .select()
    .from(products)
    .where(and(
      eq(products.active, true),
      eq(products.isPublished, true),
    ))

  return Promise.all(
    rows.map(async (row) => {
      const images = await getImagesForProduct(row.id)
      return toProduct(row, images)
    })
  )
}

export async function getProductById(id: number): Promise<Product | null> {
  const rows = await db
    .select()
    .from(products)
    .where(and(
      eq(products.id, id),
      eq(products.isPublished, true),
    ))
    .limit(1)

  if (!rows[0]) return null
  const images = await getImagesForProduct(rows[0].id)
  return toProduct(rows[0], images)
}

export async function getProductImages(productId: number) {
  return db
    .select()
    .from(productImages)
    .where(eq(productImages.productId, productId))
}
