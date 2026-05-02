import type { Metadata } from 'next'
import { headers } from 'next/headers'

const DEFAULT_TITLE = 'CV Shop · 卡门小铺'
const DEFAULT_DESCRIPTION = '只卖我们相信的好东西 · 从食物到生活，从日常到品质，用心为你甄选每一件商品'
const OG_DESCRIPTION = '只卖我们相信的好东西。从食物到生活，从日常到品质，用心为你甄选每一件商品'
const LOGO_IMAGE = '/CV-thumb-01.png'

export async function getBaseUrl(): Promise<string> {
  const headersList = await headers()
  const host = headersList.get('host') ?? 'localhost:3000'
  const protocol = host.includes('localhost') ? 'http' : 'https'
  return `${protocol}://${host}`
}

export async function getDefaultMetadata(overrides?: Partial<Metadata>): Promise<Metadata> {
  const baseUrl = await getBaseUrl()
  const imageUrl = `${baseUrl}${LOGO_IMAGE}`

  return {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    openGraph: {
      title: 'CV Shop',
      description: OG_DESCRIPTION,
      images: [
        {
          url: imageUrl,
          width: 240,
          height: 280,
          alt: 'CV Shop Logo',
        },
      ],
    },
    twitter: {
      card: 'summary',
      title: 'CV Shop',
      description: OG_DESCRIPTION,
      images: [imageUrl],
    },
    ...overrides,
  }
}
