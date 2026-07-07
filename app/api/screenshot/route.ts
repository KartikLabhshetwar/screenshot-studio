import { NextRequest, NextResponse } from 'next/server'
import { getCachedScreenshot, cacheScreenshot, normalizeUrl, invalidateCache } from '@/lib/screenshot-cache'
import { checkRateLimit } from '@/lib/rate-limit'

export const maxDuration = 60

const MICROLINK_API_URL = process.env.SCREENSHOT_API_URL || 'https://api.microlink.io'
type DeviceType = 'desktop' | 'mobile'
type ColorScheme = 'light' | 'dark'

async function captureViaService(
  url: string,
  deviceType: DeviceType = 'desktop',
  colorScheme: ColorScheme = 'light'
): Promise<{ screenshot: string; strategy: string }> {
  try {
    const viewport = deviceType === 'mobile'
      ? { width: '375', height: '667', isMobile: 'true' }
      : { width: '1920', height: '1080', isMobile: 'false' }

    const params = new URLSearchParams({
      url,
      screenshot: 'true',
      meta: 'false',
      'viewport.width': viewport.width,
      'viewport.height': viewport.height,
      'viewport.isMobile': viewport.isMobile,
      colorScheme,
    })

    const metaResponse = await fetch(`${MICROLINK_API_URL}/?${params.toString()}`, {
      method: 'GET',
      signal: AbortSignal.timeout(30000),
    })

    const metaJson = await metaResponse.json()

    if (metaJson.status !== 'success' || !metaJson.data?.screenshot?.url) {
      const message = metaJson.data?.url || metaJson.data?.message || `Screenshot API returned ${metaResponse.status}`
      if (metaResponse.status === 408 || metaResponse.status === 504) {
        throw new Error('timeout')
      }
      if (metaResponse.status === 429) {
        throw new Error('connection_error')
      }
      throw new Error(message)
    }

    const imageResponse = await fetch(metaJson.data.screenshot.url, {
      signal: AbortSignal.timeout(25000),
    })

    if (!imageResponse.ok) {
      throw new Error(`Screenshot API returned ${imageResponse.status}`)
    }

    const arrayBuffer = await imageResponse.arrayBuffer()

    if (arrayBuffer.byteLength === 0) {
      throw new Error('Empty response from screenshot API')
    }

    const buffer = Buffer.from(arrayBuffer)

    const firstBytes = buffer.subarray(0, 8)
    const isPng = firstBytes[0] === 0x89 && firstBytes[1] === 0x50 && firstBytes[2] === 0x4E && firstBytes[3] === 0x47
    const isJpeg = firstBytes[0] === 0xFF && firstBytes[1] === 0xD8

    if (!isPng && !isJpeg) {
      throw new Error('Invalid image format received from screenshot API: expected PNG or JPEG')
    }

    const base64Screenshot = buffer.toString('base64')

    return {
      screenshot: base64Screenshot,
      strategy: 'microlink',
    }
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('timeout')
    }
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('connection_error')
    }
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
    const { url, forceRefresh, deviceType = 'desktop', colorScheme = 'light' } = body

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }

    if (!['desktop', 'mobile'].includes(deviceType)) {
      return NextResponse.json(
        { error: 'deviceType must be either "desktop" or "mobile"' },
        { status: 400 }
      )
    }

    if (!['light', 'dark'].includes(colorScheme)) {
      return NextResponse.json(
        { error: 'colorScheme must be either "light" or "dark"' },
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
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      )
    }

    const normalizedUrl = normalizeUrl(validUrl.toString())
    const cacheKey = `${normalizedUrl}:${deviceType}:${colorScheme}`

    if (forceRefresh) {
      try {
        await invalidateCache(normalizedUrl)
      } catch (invalidateError) {
        console.warn('Failed to invalidate cache:', invalidateError)
      }
    }

    if (!forceRefresh) {
      try {
        const cachedScreenshot = await getCachedScreenshot(cacheKey)
        if (cachedScreenshot) {
          return NextResponse.json({
            screenshot: cachedScreenshot,
            url: normalizedUrl,
            cached: true,
            deviceType,
            colorScheme,
          })
        }
      } catch (cacheError) {
        console.warn('Cache check failed:', cacheError)
      }
    }

    const { screenshot, strategy } = await captureViaService(normalizedUrl, deviceType, colorScheme)

    try {
      await cacheScreenshot(cacheKey, screenshot)
    } catch (cacheError) {
      console.warn('Failed to cache screenshot:', cacheError)
    }

    return NextResponse.json({
      screenshot,
      url: normalizedUrl,
      cached: false,
      strategy,
      deviceType,
      colorScheme,
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
