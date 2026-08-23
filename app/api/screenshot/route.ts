import { NextRequest, NextResponse } from 'next/server'
import { getCachedScreenshot, cacheScreenshot, normalizeUrl, invalidateCache } from '@/lib/screenshot-cache'
import { checkRateLimit } from '@/lib/rate-limit'
import { apiError, methodNotAllowed } from '@/lib/api/errors'

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
      const retryAfter = Math.ceil((rateLimit.resetAt - Date.now()) / 1000)
      return apiError(
        429,
        'rate_limited',
        'Rate limit exceeded. Please try again later.',
        `Wait ${retryAfter} seconds, then retry. This endpoint allows 20 requests per minute per IP address.`,
        { retryAfter },
        {
          'Retry-After': retryAfter.toString(),
          'X-RateLimit-Limit': '20',
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': rateLimit.resetAt.toString(),
        }
      )
    }

    const body = await request.json()
    const { url, forceRefresh, deviceType = 'desktop', colorScheme = 'light' } = body

    if (!url || typeof url !== 'string') {
      return apiError(
        400,
        'invalid_request',
        'URL is required',
        'Send a JSON body with a "url" string, for example {"url": "https://example.com"}.'
      )
    }

    if (!['desktop', 'mobile'].includes(deviceType)) {
      return apiError(
        400,
        'unsupported_value',
        'deviceType must be either "desktop" or "mobile"',
        'Omit deviceType to use the default "desktop", or set it to "desktop" or "mobile".'
      )
    }

    if (!['light', 'dark'].includes(colorScheme)) {
      return apiError(
        400,
        'unsupported_value',
        'colorScheme must be either "light" or "dark"',
        'Omit colorScheme to use the default "light", or set it to "light" or "dark".'
      )
    }

    let validUrl: URL
    try {
      validUrl = new URL(url)
      if (!['http:', 'https:'].includes(validUrl.protocol)) {
        return apiError(
          400,
          'invalid_url',
          'URL must use http or https protocol',
          'Prefix the address with https://, for example https://example.com.'
        )
      }
    } catch {
      return apiError(
        400,
        'invalid_url',
        'Invalid URL format',
        'Send an absolute URL including the scheme, for example https://example.com.'
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
        return apiError(
          408,
          'upstream_timeout',
          'Website took too long to load. Please try again or try a different URL.',
          'Retry the request, or capture a lighter page. The capture times out after 30 seconds.'
        )
      }

      if (error.message.includes('ECONNREFUSED') || error.message.includes('fetch failed')) {
        return apiError(
          503,
          'upstream_unavailable',
          'Screenshot service is unavailable. Please try again later.',
          'This is a transient upstream failure. Retry with exponential backoff.'
        )
      }

      if (error.message.includes('net::ERR_NAME_NOT_RESOLVED') || 
          error.message.includes('net::ERR_CONNECTION_REFUSED') ||
          error.message.includes('net::ERR_CONNECTION_TIMED_OUT') ||
          error.message.includes('NS_ERROR_UNKNOWN_HOST')) {
        return apiError(
          400,
          'invalid_url',
          'Could not connect to the website. Please check the URL and try again.',
          'Verify the host resolves and is publicly reachable, then retry.'
        )
      }

      if (error.message.includes('SSL') || 
          error.message.includes('certificate') ||
          error.message.includes('ERR_CERT')) {
        return apiError(
          400,
          'invalid_url',
          'Website has SSL certificate issues. The screenshot may be incomplete.',
          'Use a host with a valid TLS certificate, or capture the http:// address instead.'
        )
      }
    }

    return apiError(
      500,
      'internal_error',
      'Failed to capture screenshot. Please try again or contact support if the issue persists.',
      'Retry the request. If it keeps failing, report it at https://github.com/KartikLabhshetwar/screenshot-studio/issues'
    )
  }
}

export async function GET() {
  return methodNotAllowed(['POST'])
}
