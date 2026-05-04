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

export const productCategories = pgTable(
  'product_categories',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 100 }).notNull().unique(),
    nameEn: varchar('name_en', { length: 100 }),
    description: text('description'),
    descriptionEn: text('description_en'),
    displayOrder: integer('display_order').default(0).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (t) => [index('product_categories_name_idx').on(t.name)],
)

export const products = pgTable(
  'products',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    sku: varchar('sku', { length: 50 }).unique(),
    barcode: varchar('barcode', { length: 100 }),
    unitPrice: numeric('unit_price', { precision: 10, scale: 2 }).notNull(),
    costPrice: numeric('cost_price', { precision: 10, scale: 2 }),
    category: varchar('category', { length: 100 }),
    fulfillmentType: fulfillmentTypeEnum('fulfillment_type').default('ON_DEMAND'),
    description: text('description'),
    imageUrl: text('image_url'),
    active: boolean('active').default(true),
    draft: boolean('draft').default(false).notNull(),
    isPublished: boolean('is_published').default(false).notNull(),
    currentStock: integer('current_stock'),
    packSize: numeric('pack_size', { precision: 10, scale: 3 }).default('1').notNull(),
    packUnit: varchar('pack_unit', { length: 16 }),
    unit: varchar('unit', { length: 16 }),
    createdAt: timestamp('created_at'),
  },
  (t) => [
    uniqueIndex('products_sku_idx').on(t.sku),
    index('products_category_idx').on(t.category),
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
export type DbProductCategory = typeof productCategories.$inferSelect
