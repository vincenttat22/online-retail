import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { dailyVisits } from '@/lib/db/schema'
import { sql } from 'drizzle-orm'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    let body: { path?: string } = {}
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    const { path } = body
    if (!path || typeof path !== 'string') {
      return NextResponse.json({ error: 'Path is required' }, { status: 400 })
    }

    // Get client IP using x-forwarded-for header
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1'
    
    // Get client User-Agent
    const userAgent = request.headers.get('user-agent') || 'Unknown'

    // Exclude common crawler/bot user-agents
    const isBot = /bot|spider|crawl|slurp|chrome-lighthouse|lighthouse/i.test(userAgent)
    if (isBot) {
      return NextResponse.json({ success: true, ignored: 'bot' })
    }

    // Determine the Melbourne localized date (YYYY-MM-DD)
    const today = new Date()
    const dateStr = today.toLocaleDateString('en-CA', { timeZone: 'Australia/Melbourne' })

    // Generate daily salt using date and AUTH_SECRET (or a fallback secret)
    const secret = process.env.AUTH_SECRET || process.env.DATABASE_URL || 'dev-secret-for-visitor-salt'
    const dailySalt = crypto.createHash('sha256').update(dateStr + secret).digest('hex')

    // Generate Visitor Hash
    const visitorHash = crypto
      .createHash('sha256')
      .update(ip + userAgent + dailySalt)
      .digest('hex')

    // Normalize path by stripping query parameters and hashes
    const cleanPath = path.split('?')[0].split('#')[0] || '/'

    // Upsert the page view count
    await db
      .insert(dailyVisits)
      .values({
        date: dateStr,
        visitorHash,
        path: cleanPath,
        views: 1,
      })
      .onConflictDoUpdate({
        target: [dailyVisits.date, dailyVisits.visitorHash, dailyVisits.path],
        set: {
          views: sql`${dailyVisits.views} + 1`,
          updatedAt: sql`now()`,
        },
      })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Track Visit API] Error tracking visit:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
