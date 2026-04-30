# Hybrid R2 Image Loading for Catalog Project

## Overview
Implement a hybrid approach to load product images from Cloudflare R2 that works in both local development (S3Client) and production (native R2 binding). This approach keeps R2 URLs private and serves images through your app.

## Key Concept
- **Local Development**: Uses AWS S3Client with credentials from environment variables
- **Production (Cloudflare)**: Uses native R2 binding (faster, no HTTP overhead, internal routing)
- **Frontend**: Never sees raw R2 URLs, always requests images from `/api/products/[id]/images/[imageId]`

## Implementation

### 1. Environment Setup (wrangler.toml)

Configure R2 bucket binding in `wrangler.toml`:

```toml
[[r2_buckets]]
binding = "R2"
bucket_name = "your-bucket-name"

[vars]
CF_R2_BUCKET = "your-bucket-name"
```

For local development, add to `.env`:
```
CF_R2_BUCKET="your-bucket-name"
CLOUDFLARE_ACCOUNT_ID="your-account-id"
CF_R2_ACCESS_KEY_ID="your-key-id"
CF_R2_ACCESS_KEY_SECRET="your-secret"
```

### 2. R2 Service with Hybrid Support

Create `/src/services/r2.ts` with hybrid R2 binding detection:

```typescript
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { env } from '@/lib/env'

let _client: S3Client | null = null

function getClient(): S3Client {
  if (!_client) {
    _client = new S3Client({
      region: 'auto',
      endpoint: `https://${env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: env.CF_R2_ACCESS_KEY_ID,
        secretAccessKey: env.CF_R2_ACCESS_KEY_SECRET,
      },
    })
  }
  return _client
}

export function getR2Binding(env: any): any {
  const binding = env?.R2 || null
  if (binding) {
    console.log('[R2] Using native R2 binding')
  } else {
    console.warn('[R2] R2 binding not found, will use S3Client fallback', {
      hasEnv: !!env,
      envKeys: env ? Object.keys(env).slice(0, 10) : 'none',
    })
  }
  return binding
}

export async function getFromR2Binding(
  env: any,
  key: string,
): Promise<{ body: Buffer; contentType?: string }> {
  const r2Binding = getR2Binding(env)

  if (r2Binding) {
    // Use native R2 binding (production on Cloudflare)
    const object = await r2Binding.get(key)

    if (!object) {
      throw new Error('Object not found in R2')
    }

    const buffer = await object.arrayBuffer()
    return {
      body: Buffer.from(buffer),
      contentType: object.httpMetadata?.contentType,
    }
  } else {
    // Fall back to S3Client (local development)
    const s3Client = getClient()
    const bucket = env.CF_R2_BUCKET || 'your-bucket-name'

    const response = await s3Client.send(
      new GetObjectCommand({
        Bucket: bucket,
        Key: key,
      }),
    )

    if (!response.Body) {
      throw new Error('Failed to fetch object from R2')
    }

    const chunks = []
    for await (const chunk of response.Body as any) {
      chunks.push(chunk)
    }

    return {
      body: Buffer.concat(chunks),
      contentType: response.ContentType,
    }
  }
}
```

### 3. Image Serving Endpoint

Create `/src/app/api/products/[id]/images/[imageId]/route.ts` to serve images through your app:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/auth'
import { productImages } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { getFromR2Binding } from '@/services/r2'

// Access Cloudflare context from AsyncLocalStorage (set by OpenNext)
function getEnvFromRequest(request: NextRequest): any {
  const globalAny = globalThis as any

  try {
    const cloudflareContext = globalAny[Symbol.for('__cloudflare-context__')]
    if (cloudflareContext?.env) {
      console.log('[getEnvFromRequest] Found bindings via AsyncLocalStorage')
      if (cloudflareContext.env.R2) {
        console.log('[getEnvFromRequest] R2 binding is available!')
      }
      return cloudflareContext.env
    }
  } catch (e) {
    console.warn('[getEnvFromRequest] Failed to access AsyncLocalStorage:', e)
  }

  // Fallback to request context
  const asAny = request as any
  if (asAny.context?.env) {
    console.log('[getEnvFromRequest] Found bindings via request.context.env')
    return asAny.context.env
  }

  // Local development
  console.log('[getEnvFromRequest] Using process.env (local development)')
  return process.env
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; imageId: string }> },
) {
  try {
    const { id, imageId } = await params
    const productId = parseInt(id)
    const imgId = parseInt(imageId)
    const env = getEnvFromRequest(request)

    // Fetch image metadata from database
    const [image] = await db
      .select()
      .from(productImages)
      .where(eq(productImages.id, imgId))
      .limit(1)

    // Verify image belongs to the requested product
    if (!image || image.productId !== productId) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }

    // Extract R2 key from stored URL
    // URL format could be:
    // 1. {publicBase}/products/{id}/... (if CF_R2_PUBLIC_URL is set)
    // 2. https://{accountId}.r2.cloudflarestorage.com/{bucket}/products/{id}/... (if not)
    const url = new URL(image.r2Url)
    const pathparts = url.pathname.split('/').filter(Boolean)

    // Find the "products" segment and extract key from there
    const productsIndex = pathparts.findIndex((p) => p === 'products')
    let key: string

    if (productsIndex !== -1) {
      key = pathparts.slice(productsIndex).join('/')
    } else {
      // Fallback: if products not found, use full path
      key = pathparts.join('/')
    }

    // Fetch from R2 using hybrid approach
    const imageData = await getFromR2Binding(env, key)

    // Convert buffer to Uint8Array for Blob compatibility
    const uint8Array = new Uint8Array(imageData.body)

    // Return image with appropriate headers (no caching - always fresh from R2)
    return new NextResponse(new Blob([uint8Array], { type: imageData.contentType || 'image/jpeg' }), {
      status: 200,
      headers: {
        'Content-Type': imageData.contentType || 'image/jpeg',
        'Content-Length': imageData.body.length.toString(),
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    })
  } catch (error) {
    console.error('Failed to serve image:', error)
    return NextResponse.json(
      { error: 'Failed to load image' },
      { status: 500 },
    )
  }
}
```

### 4. Frontend Image Loading

In your React components, fetch images through the endpoint:

```typescript
// Store R2 URL in database (from upload or migration)
const imageUrl = `/api/products/${productId}/images/${imageId}`

// Use in img tag
<img src={imageUrl} alt="Product image" />

// Or with Next.js Image component
<Image 
  src={imageUrl} 
  alt="Product image"
  width={300}
  height={300}
  loader={({ src }) => src} // Pass through without optimization
/>
```

## How It Works

### Local Development
1. Environment has `CF_R2_ACCESS_KEY_ID`, `CF_R2_ACCESS_KEY_SECRET`, `CLOUDFLARE_ACCOUNT_ID`
2. `getEnvFromRequest()` falls back to `process.env`
3. `getFromR2Binding()` detects no R2 binding, uses S3Client
4. S3Client connects to R2 via HTTPS with credentials

### Production (Cloudflare)
1. OpenNext stores Cloudflare context in AsyncLocalStorage under `Symbol.for('__cloudflare-context__')`
2. `getEnvFromRequest()` accesses it via `globalThis[Symbol.for('__cloudflare-context__')].env`
3. `env.R2` binding is available
4. `getFromR2Binding()` uses native R2 binding (no HTTP, internal Cloudflare routing, faster)

## Database Schema

Store image metadata with R2 URL:

```typescript
export const productImages = pgTable(
  'product_images',
  {
    id: serial('id').primaryKey(),
    productId: integer('product_id').notNull(),
    r2Url: text('r2_url').notNull(), // Full R2 URL from upload
    altText: text('alt_text'),
    isPrimary: boolean('is_primary').default(false).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    productIdIdx: index('product_images_product_id_idx').on(table.productId),
  }),
)
```

## Key Benefits
✅ Private R2 URLs - never exposed to frontend  
✅ Hybrid: S3Client locally, native binding in production  
✅ Better performance on Cloudflare (no HTTPS overhead)  
✅ Same API endpoint works everywhere (`/api/products/[id]/images/[imageId]`)  
✅ Easy image updates - just change what's served without frontend changes

## Testing
1. **Local**: Upload image, verify it loads via S3Client
2. **Production**: Deploy to Cloudflare, verify logs show R2 binding detection
3. **Load test**: Native R2 binding should be faster than S3Client approach
