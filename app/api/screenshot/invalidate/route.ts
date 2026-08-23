import { NextRequest, NextResponse } from 'next/server'
import { invalidateCache, invalidateCacheBatch } from '@/lib/screenshot-cache'
import { apiError, methodNotAllowed } from '@/lib/api/errors'

const URL_HINT = 'Send an absolute http or https URL, for example {"url": "https://example.com"}.'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url, urls } = body

    if (!url && !urls) {
      return apiError(
        400,
        'invalid_request',
        'Either "url" or "urls" is required',
        URL_HINT
      )
    }

    if (url && urls) {
      return apiError(
        400,
        'invalid_request',
        'Provide either "url" or "urls", not both',
        'Send a single "url" string or a "urls" array of strings, never both.'
      )
    }

    if (url) {
      if (typeof url !== 'string') {
        return apiError(400, 'invalid_request', '"url" must be a string', URL_HINT)
      }

      try {
        const validUrl = new URL(url)
        if (!['http:', 'https:'].includes(validUrl.protocol)) {
          return apiError(
            400,
            'invalid_url',
            'URL must use http or https protocol',
            URL_HINT
          )
        }
      } catch {
        return apiError(400, 'invalid_url', 'Invalid URL format', URL_HINT)
      }

      await invalidateCache(url)
      return NextResponse.json({
        success: true,
        message: `Cache invalidated for ${url}`,
      })
    }

    if (!Array.isArray(urls)) {
      return apiError(
        400,
        'invalid_request',
        '"urls" must be an array',
        'Send "urls" as a JSON array of absolute http or https URL strings.'
      )
    }

    if (urls.length === 0) {
      return apiError(
        400,
        'invalid_request',
        '"urls" array cannot be empty',
        'Include at least one absolute http or https URL in the "urls" array.'
      )
    }

    for (const u of urls) {
      if (typeof u !== 'string') {
        return apiError(
          400,
          'invalid_request',
          'All items in "urls" must be strings',
          'Send "urls" as a JSON array of absolute http or https URL strings.'
        )
      }

      try {
        const validUrl = new URL(u)
        if (!['http:', 'https:'].includes(validUrl.protocol)) {
          return apiError(
            400,
            'invalid_url',
            `URL must use http or https protocol: ${u}`,
            URL_HINT
          )
        }
      } catch {
        return apiError(400, 'invalid_url', `Invalid URL format: ${u}`, URL_HINT)
      }
    }

    await invalidateCacheBatch(urls)
    return NextResponse.json({
      success: true,
      message: `Cache invalidated for ${urls.length} URL(s)`,
      count: urls.length,
    })
  } catch (error) {
    console.error('Error invalidating cache:', error)
    return apiError(
      500,
      'internal_error',
      'Failed to invalidate cache',
      'Retry the request. Check the server logs for the underlying storage error.'
    )
  }
}

export async function GET() {
  return methodNotAllowed(['POST'])
}
