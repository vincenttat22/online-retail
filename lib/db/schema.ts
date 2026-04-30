import {
  pgTable,
  pgEnum,
  serial,
  varchar,
  integer,
  numeric,
  text,
  boolean,
  timestamp,
  uniqueIndex,
  index,
} from 'drizzle-orm/pg-core'

export const fulfillmentTypeEnum = pgEnum('fulfillment_type', ['ON_DEMAND', 'STOCK', 'DROPSHIP'])
export const categoryEnum = pgEnum('category', ['MEAT_SEAFOOD', 'SNACKS', 'HOUSEHOLD', 'BEAUTY_HEALTH', 'OTHER'])

export const products = pgTable(
  'products',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    sku: varchar('sku', { length: 50 }).unique(),
    barcode: varchar('barcode', { length: 100 }),
    unitPrice: numeric('unit_price', { precision: 10, scale: 2 }).notNull(),
    costPrice: numeric('cost_price', { precision: 10, scale: 2 }),
    category: categoryEnum('category').default('OTHER'),
    fulfillmentType: fulfillmentTypeEnum('fulfillment_type').default('ON_DEMAND'),
    description: text('description'),
    imageUrl: text('image_url'),
    active: boolean('active').default(true),
    draft: boolean('draft').default(false).notNull(),
    isPublished: boolean('is_published').default(false).notNull(),
    createdAt: timestamp('created_at'),
  },
  (t) => [
    uniqueIndex('products_sku_idx').on(t.sku),
    index('products_fulfillment_type_idx').on(t.fulfillmentType),
    index('products_active_idx').on(t.active),
    index('products_draft_idx').on(t.draft),
    index('products_is_published_idx').on(t.isPublished),
  ],
)

export const productImages = pgTable(
  'product_images',
  {
    id: serial('id').primaryKey(),
    productId: integer('product_id')
      .references(() => products.id, { onDelete: 'cascade' })
      .notNull(),
    r2Url: varchar('r2_url', { length: 500 }).notNull(),
    altText: varchar('alt_text', { length: 255 }),
    isPrimary: boolean('is_primary').default(false),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (t) => [index('product_images_product_id_idx').on(t.productId)],
)


export type DbProduct = typeof products.$inferSelect
export type DbProductImage = typeof productImages.$inferSelect
