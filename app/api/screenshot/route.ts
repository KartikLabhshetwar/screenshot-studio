import { NextRequest, NextResponse } from 'next/server'
import { getCachedScreenshot, cacheScreenshot, normalizeUrl, invalidateCache } from '@/lib/screenshot-cache'
import { checkRateLimit } from '@/lib/rate-limit'

export const maxDuration = 60

const SCREENSHOT_SERVICE_URL = process.env.SCREENSHOT_SERVICE_URL || 'http://localhost:3001'

async function captureViaService(url: string): Promise<{ screenshot: string; strategy: string }> {
  try {
    const response = await fetch(`${SCREENSHOT_SERVICE_URL}/screenshot`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        url,
        viewport: {
          width: 1920,
          height: 1080
        }
      }),
      signal: AbortSignal.timeout(55000),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error', type: 'unknown' }))
      
      if (errorData.type === 'timeout') {
        throw new Error('timeout')
      }
      if (errorData.type === 'connection_error') {
        throw new Error('connection_error')
      }
      if (errorData.type === 'ssl_error') {
        throw new Error('ssl_error')
      }
      
      throw new Error(errorData.error || `Service returned ${response.status}`)
    }

    const data = await response.json()
    
    if (!data.success) {
      throw new Error(data.error || 'Screenshot capture failed')
    }
    
    return {
      screenshot: data.screenshot,
      strategy: data.strategy || 'external-service',
    }
  } catch (error) {
    console.error('Screenshot service error:', error)
    throw error
  }
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    const rateLimit = checkRateLimit(ip)
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded. Please try again later.',
          retryAfter: Math.ceil((rateLimit.resetAt - Date.now()) / 1000)
        },
        { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil((rateLimit.resetAt - Date.now()) / 1000).toString(),
            'X-RateLimit-Limit': '20',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimit.resetAt.toString()
          }
        }
      )
    }

    const body = await request.json()
    const { url, forceRefresh } = body

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }

    let validUrl: URL
    try {
      validUrl = new URL(url)
      if (!['http:', 'https:'].includes(validUrl.protocol)) {
        return NextResponse.json(
          { error: 'URL must use http or https protocol' },
          { status: 400 }
        )
      }
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      )
    }

    const normalizedUrl = normalizeUrl(validUrl.toString())

    if (forceRefresh) {
      try {
        await invalidateCache(normalizedUrl)
      } catch (invalidateError) {
        console.warn('Failed to invalidate cache:', invalidateError)
      }
    }

    if (!forceRefresh) {
      try {
        const cachedScreenshot = await getCachedScreenshot(normalizedUrl)
        if (cachedScreenshot) {
          return NextResponse.json({
            screenshot: cachedScreenshot,
            url: normalizedUrl,
            cached: true,
          })
        }
      } catch (cacheError) {
        console.warn('Cache check failed:', cacheError)
      }
    }

    const { screenshot, strategy } = await captureViaService(normalizedUrl)

    try {
      await cacheScreenshot(normalizedUrl, screenshot)
    } catch (cacheError) {
      console.warn('Failed to cache screenshot:', cacheError)
    }

    return NextResponse.json({
      screenshot,
      url: normalizedUrl,
      cached: false,
      strategy,
    })
  } catch (error) {
    console.error('Screenshot error:', error)

    if (error instanceof Error) {
      if (error.message.includes('timeout') || error.message.includes('Timeout')) {
        return NextResponse.json(
          { error: 'Website took too long to load. Please try again or try a different URL.' },
          { status: 408 }
        )
      }

      if (error.message.includes('ECONNREFUSED') || error.message.includes('fetch failed')) {
        return NextResponse.json(
          { error: 'Screenshot service is unavailable. Please try again later.' },
          { status: 503 }
        )
      }

      if (error.message.includes('net::ERR_NAME_NOT_RESOLVED') || 
          error.message.includes('net::ERR_CONNECTION_REFUSED') ||
          error.message.includes('net::ERR_CONNECTION_TIMED_OUT') ||
          error.message.includes('NS_ERROR_UNKNOWN_HOST')) {
        return NextResponse.json(
          { error: 'Could not connect to the website. Please check the URL and try again.' },
          { status: 400 }
        )
      }

      if (error.message.includes('SSL') || 
          error.message.includes('certificate') ||
          error.message.includes('ERR_CERT')) {
        return NextResponse.json(
          { error: 'Website has SSL certificate issues. The screenshot may be incomplete.' },
          { status: 400 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Failed to capture screenshot. Please try again or contact support if the issue persists.' },
      { status: 500 }
    )
  }
}
