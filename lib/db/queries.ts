import { db } from './index'
import { products, productImages } from './schema'
import { eq } from 'drizzle-orm'
import type { Product } from '@/lib/types'

function toProduct(row: typeof products.$inferSelect): Product {
  return {
    id: row.id,
    zh: row.name,
    en: row.sku ?? '',
    price: Number(row.unitPrice),
    unit: '/件',
    desc: row.description ?? '',
    disc: 0,
  }
}

export async function getProducts(): Promise<Product[]> {
  const rows = await db
    .select()
    .from(products)
    .where(eq(products.active, true))
  return rows.map(toProduct)
}

export async function getProductById(id: number): Promise<Product | null> {
  const rows = await db
    .select()
    .from(products)
    .where(eq(products.id, id))
    .limit(1)
  return rows[0] ? toProduct(rows[0]) : null
}

export async function getProductImages(productId: number) {
  return db
    .select()
    .from(productImages)
    .where(eq(productImages.productId, productId))
}
