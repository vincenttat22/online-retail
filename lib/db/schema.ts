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
  jsonb,
  uniqueIndex,
  index,
  date,
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
    packSize: numeric('pack_size', { precision: 10, scale: 3 }).default('1').notNull(),
    packUnit: varchar('pack_unit', { length: 16 }),
    unit: varchar('unit', { length: 16 }),
    minimumQuantity: numeric('minimum_quantity', { precision: 10, scale: 3 }),
    pinyinName: varchar('pinyin_name', { length: 500 }),
    createdAt: timestamp('created_at'),
  },
  (t) => [
    uniqueIndex('products_sku_idx').on(t.sku),
    index('products_category_idx').on(t.category),
    index('products_fulfillment_type_idx').on(t.fulfillmentType),
    index('products_active_idx').on(t.active),
    index('products_draft_idx').on(t.draft),
    index('products_is_published_idx').on(t.isPublished),
    index('products_pinyin_name_idx').on(t.pinyinName),
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

// ─────────────────────────────────────────────────────────────────────────
// JieLong (snail list / order) tables — owned by the `online-shop` admin app
// schema, declared here read-only since both apps share the same database.
// Only the columns this storefront actually reads are included.
// ─────────────────────────────────────────────────────────────────────────

export const snailLists = pgTable('snail_lists', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }),
  endedAt: timestamp('ended_at'),
  createdAt: timestamp('created_at').defaultNow(),
})

export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  customerId: integer('customer_id'),
  snailListId: integer('snail_list_id'),
  createdAt: timestamp('created_at').defaultNow(),
})

export const orderItems = pgTable('order_items', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id').notNull(),
  productId: integer('product_id'),
  quantity: numeric('quantity', { precision: 10, scale: 3 }).notNull(),
})

export const cuisineTypeEnum = pgEnum('cuisine_type', ['chinese', 'western', 'fusion'])
export const recipeDifficultyEnum = pgEnum('recipe_difficulty', ['easy', 'medium', 'hard'])
export const recipeStatusEnum = pgEnum('recipe_status', ['draft', 'published'])
export const ingredientMatchConfidenceEnum = pgEnum('ingredient_match_confidence', [
  'none',
  'exact',
  'fuzzy',
])

export const recipes = pgTable(
  'recipes',
  {
    id: serial('id').primaryKey(),
    productId: integer('product_id')
      .references(() => products.id, { onDelete: 'cascade' })
      .notNull(),
    titleZh: varchar('title_zh', { length: 255 }).notNull(),
    titleEn: varchar('title_en', { length: 255 }).notNull(),
    cuisineType: cuisineTypeEnum('cuisine_type').notNull(),
    difficulty: recipeDifficultyEnum('difficulty').notNull(),
    timeMinutes: integer('time_minutes').notNull(),
    servings: integer('servings').notNull(),
    description: text('description'),
    instructions: text('instructions').notNull(),
    heroImageUrl: text('hero_image_url'),
    sourceUrls: jsonb('source_urls'),
    understanding: jsonb('understanding'),
    generatedByModel: varchar('generated_by_model', { length: 64 }),
    status: recipeStatusEnum('status').default('draft').notNull(),
    generatedAt: timestamp('generated_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => [
    index('recipes_product_id_idx').on(t.productId),
    index('recipes_cuisine_type_idx').on(t.cuisineType),
    index('recipes_status_idx').on(t.status),
  ],
)

export const recipeIngredients = pgTable(
  'recipe_ingredients',
  {
    id: serial('id').primaryKey(),
    recipeId: integer('recipe_id')
      .references(() => recipes.id, { onDelete: 'cascade' })
      .notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    quantity: varchar('quantity', { length: 64 }),
    unit: varchar('unit', { length: 32 }),
    matchedProductId: integer('matched_product_id').references(() => products.id, {
      onDelete: 'set null',
    }),
    matchConfidence: ingredientMatchConfidenceEnum('match_confidence').default('none').notNull(),
    notes: text('notes'),
    displayOrder: integer('display_order').default(0).notNull(),
  },
  (t) => [
    index('recipe_ingredients_recipe_id_idx').on(t.recipeId),
    index('recipe_ingredients_matched_product_id_idx').on(t.matchedProductId),
  ],
)

export type DbRecipe = typeof recipes.$inferSelect
export type DbRecipeIngredient = typeof recipeIngredients.$inferSelect

// ═══════════════════════════════════════════════════════════════════════════
// DAILY VISIT COUNT TRACKER
// ═══════════════════════════════════════════════════════════════════════════

export const dailyVisits = pgTable(
  'daily_visits',
  {
    id: serial('id').primaryKey(),
    date: date('date').notNull(),
    visitorHash: varchar('visitor_hash', { length: 64 }).notNull(),
    path: varchar('path', { length: 2048 }).notNull(),
    views: integer('views').default(1).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => [
    uniqueIndex('daily_visits_date_visitor_hash_path_idx').on(t.date, t.visitorHash, t.path),
    index('daily_visits_date_idx').on(t.date),
    index('daily_visits_path_idx').on(t.path),
  ]
)
