import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'

let _client: S3Client | null = null

function getClient(): S3Client {
  if (!_client) {
    _client = new S3Client({
      region: 'auto',
      endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.CF_R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.CF_R2_ACCESS_KEY_SECRET!,
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
    console.warn('[R2] R2 binding not found, will use S3Client fallback')
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
    const bucket = process.env.CF_R2_BUCKET || 'your-bucket-name'

    const response = await s3Client.send(
      new GetObjectCommand({
        Bucket: bucket,
        Key: key,
      }),
    )

    if (!response.Body) {
      throw new Error('Failed to fetch object from R2')
    }

    const chunks: Uint8Array[] = []
    for await (const chunk of response.Body as AsyncIterable<Uint8Array>) {
      chunks.push(chunk)
    }

    return {
      body: Buffer.concat(chunks),
      contentType: response.ContentType,
    }
  }
}
