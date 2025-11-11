import { NextRequest, NextResponse } from 'next/server'
import chromium from '@sparticuz/chromium'
import { getCachedScreenshot, cacheScreenshot, normalizeUrl, invalidateCache } from '@/lib/screenshot-cache'
import { checkRateLimit } from '@/lib/rate-limit'

export const maxDuration = 60

interface CaptureOptions {
  url: string
  timeout?: number
  viewport?: { width: number; height: number }
}

async function captureWithPlaywright(options: CaptureOptions): Promise<string> {
  const { url, timeout = 30000, viewport = { width: 1920, height: 1080 } } = options
  
  const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV
  
  let browser = null
  
  try {
    const playwright = await import('playwright-core')
    
    if (isProduction) {
      browser = await playwright.chromium.launch({
        args: chromium.args,
        executablePath: await chromium.executablePath(),
        headless: true,
      })
    } else {
      browser = await playwright.chromium.launch({
        headless: true,
      })
    }

    const context = await browser.newContext({
      viewport,
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      extraHTTPHeaders: {
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      },
      bypassCSP: true,
      ignoreHTTPSErrors: true,
    })

    const page = await context.newPage()
    
    page.setDefaultNavigationTimeout(timeout)
    page.setDefaultTimeout(timeout)

    let navigationSuccess = false
    const strategies = [
      { waitUntil: 'networkidle' as const, timeout: 15000 },
      { waitUntil: 'load' as const, timeout: 20000 },
      { waitUntil: 'domcontentloaded' as const, timeout: 10000 },
    ]

    for (const strategy of strategies) {
      try {
        await page.goto(url, strategy)
        navigationSuccess = true
        break
      } catch (navError) {
        console.warn(`Navigation with ${strategy.waitUntil} failed, trying next strategy...`)
        continue
      }
    }

    if (!navigationSuccess) {
      throw new Error('All navigation strategies failed')
    }

    await page.waitForTimeout(2000)

    await page.evaluate(() => {
      window.scrollTo(0, 0)
    })

    const screenshotBuffer = await page.screenshot({
      type: 'png',
      fullPage: false,
    })

    const base64Screenshot = screenshotBuffer.toString('base64')

    if (!base64Screenshot || base64Screenshot.length === 0) {
      throw new Error('Screenshot capture returned empty result')
    }

    return base64Screenshot
  } finally {
    if (browser) {
      await browser.close().catch(console.error)
    }
  }
}

async function captureScreenshot(url: string): Promise<{ screenshot: string; strategy: string }> {
  const errors: string[] = []

  try {
    const screenshot = await captureWithPlaywright({
      url,
      timeout: 30000,
    })
    return { screenshot, strategy: 'playwright-standard' }
  } catch (error) {
    errors.push(`playwright-standard: ${error instanceof Error ? error.message : String(error)}`)
  }

  try {
    const screenshot = await captureWithPlaywright({
      url,
      timeout: 50000,
    })
    return { screenshot, strategy: 'playwright-extended' }
  } catch (error) {
    errors.push(`playwright-extended: ${error instanceof Error ? error.message : String(error)}`)
  }

  throw new Error(`All capture strategies failed: ${errors.join('; ')}`)
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

    const { screenshot, strategy } = await captureScreenshot(normalizedUrl)

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

      if (error.message.includes('Target closed') || 
          error.message.includes('Protocol error')) {
        return NextResponse.json(
          { error: 'Browser connection was interrupted. Please try again.' },
          { status: 500 }
        )
      }

      if (error.message.includes('Failed to launch') || 
          error.message.includes('Browser closed')) {
        return NextResponse.json(
          { error: 'Server is currently busy. Please try again in a moment.' },
          { status: 503 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Failed to capture screenshot. Please try again or contact support if the issue persists.' },
      { status: 500 }
    )
  }
}
