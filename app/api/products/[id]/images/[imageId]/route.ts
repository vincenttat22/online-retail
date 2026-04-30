import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { productImages } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { getFromR2Binding } from '@/lib/services/r2'

function getEnvFromRequest(request: NextRequest): any {
  const globalAny = globalThis as any

  try {
    const cloudflareContext = globalAny[Symbol.for('__cloudflare-context__')]
    if (cloudflareContext?.env) {
      console.log('[getEnvFromRequest] Found bindings via AsyncLocalStorage')
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
    const images = await db
      .select()
      .from(productImages)
      .where(eq(productImages.id, imgId))

    const image = images[0]
    if (!image || image.productId !== productId) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }

    // Extract R2 key from stored URL
    // URL format: products/{id}/{filename}
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

    // Return image with appropriate headers
    return new NextResponse(new Blob([uint8Array], { type: imageData.contentType || 'image/jpeg' }), {
      status: 200,
      headers: {
        'Content-Type': imageData.contentType || 'image/jpeg',
        'Content-Length': imageData.body.length.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable',
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
