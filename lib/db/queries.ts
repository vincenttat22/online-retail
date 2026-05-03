import { db } from './index'
import { products, productImages } from './schema'
import { eq, and } from 'drizzle-orm'
import type { Product } from '@/lib/types'

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
  try {
    const rows = await db
      .select()
      .from(products)
      .leftJoin(productImages, eq(products.id, productImages.productId))
      .where(and(
        eq(products.active, true),
        eq(products.isPublished, true),
      ))

    const productMap = new Map<number, any>();

    for (const row of rows) {
      const productRow = row.products;
      if (!productMap.has(productRow.id)) {
        productMap.set(productRow.id, {
          row: productRow,
          images: []
        });
      }

      if (row.product_images) {
        productMap.get(productRow.id)!.images.push({
          id: row.product_images.id,
          r2Url: row.product_images.r2Url,
          altText: row.product_images.altText ?? undefined,
          isPrimary: row.product_images.isPrimary ?? false,
        });
      }
    }

    return Array.from(productMap.values()).map(({ row, images }) =>
      toProduct(row, images)
    );
  } catch (error) {
    console.error('Failed to fetch products:', error)
    return []
  }
}

export async function getProductById(id: number): Promise<Product | null> {
  try {
    const rows = await db
      .select()
      .from(products)
      .leftJoin(productImages, eq(products.id, productImages.productId))
      .where(and(
        eq(products.id, id),
        eq(products.isPublished, true),
      ))

    if (!rows.length) return null

    const productRow = rows[0].products
    const images = rows
      .filter(row => row.product_images !== null)
      .map(row => ({
        id: row.product_images!.id,
        r2Url: row.product_images!.r2Url,
        altText: row.product_images!.altText ?? undefined,
        isPrimary: row.product_images!.isPrimary ?? false,
      }))

    return toProduct(productRow, images)
  } catch (error) {
    console.error(`Failed to fetch product ${id}:`, error)
    return null
  }
}

export async function getProductImages(productId: number) {
  return db
    .select()
    .from(productImages)
    .where(eq(productImages.productId, productId))
}
