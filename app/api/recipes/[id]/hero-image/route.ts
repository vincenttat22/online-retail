import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { recipes } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { getFromR2Binding, getEnvFromRequest } from '@/lib/services/r2'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const recipeId = parseInt(id)
    const env = getEnvFromRequest(request)

    const rows = await db
      .select({ heroImageUrl: recipes.heroImageUrl })
      .from(recipes)
      .where(eq(recipes.id, recipeId))

    const recipe = rows[0]
    if (!recipe || !recipe.heroImageUrl) {
      return NextResponse.json({ error: 'Hero image not found' }, { status: 404 })
    }

    const url = new URL(recipe.heroImageUrl)
    const pathparts = url.pathname.split('/').filter(Boolean)

    const recipesIndex = pathparts.findIndex((p) => p === 'recipes')
    let key: string

    if (recipesIndex !== -1) {
      key = pathparts.slice(recipesIndex).join('/')
    } else {
      key = pathparts.join('/')
    }

    const imageData = await getFromR2Binding(env, key)
    const uint8Array = new Uint8Array(imageData.body)

    return new NextResponse(new Blob([uint8Array], { type: imageData.contentType || 'image/jpeg' }), {
      status: 200,
      headers: {
        'Content-Type': imageData.contentType || 'image/jpeg',
        'Content-Length': imageData.body.length.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('Failed to serve recipe hero image:', error)
    return NextResponse.json({ error: 'Failed to load image' }, { status: 500 })
  }
}
