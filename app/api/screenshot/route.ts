import { NextRequest, NextResponse } from 'next/server'
import puppeteer from 'puppeteer-core'
import chromium from '@sparticuz/chromium'

export const maxDuration = 10

export async function POST(request: NextRequest) {
  let browser: Awaited<ReturnType<typeof puppeteer.launch>> | null = null

  try {
    const body = await request.json()
    const { url } = body

    // Validate URL
    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }

    // Validate URL format
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

    // Launch browser with Chromium optimized for serverless
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    })

    const page = await browser.newPage()

    // Set viewport to desktop size (1920x1080)
    await page.setViewport({
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
    })

    // Navigate with optimized settings for speed
    try {
      await page.goto(validUrl.toString(), {
        waitUntil: 'domcontentloaded', // Faster than networkidle2
        timeout: 7000, // 7 seconds max (leaving 3s for screenshot)
      })
    } catch (error) {
      await browser.close()
      return NextResponse.json(
        { error: 'Failed to load website. The site may be taking too long to respond.' },
        { status: 408 }
      )
    }

    // Wait briefly for any critical dynamic content
    await new Promise(resolve => setTimeout(resolve, 500))

    // Take viewport screenshot
    const screenshot = await page.screenshot({
      fullPage: false,
      type: 'png',
      encoding: 'base64',
    })

    // Close browser
    await browser.close()
    browser = null

    return NextResponse.json({
      screenshot: screenshot as string,
      url: validUrl.toString(),
    })
  } catch (error) {
    // Ensure browser is closed on error
    if (browser) {
      try {
        await browser.close()
      } catch (closeError) {
        console.error('Error closing browser:', closeError)
      }
    }

    console.error('Screenshot error:', error)

    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('net::ERR_NAME_NOT_RESOLVED')) {
        return NextResponse.json(
          { error: 'Could not resolve the website address. Please check the URL.' },
          { status: 400 }
        )
      }
      if (error.message.includes('net::ERR_CONNECTION_REFUSED')) {
        return NextResponse.json(
          { error: 'Connection refused. The website may be down or blocking requests.' },
          { status: 400 }
        )
      }
      if (error.message.includes('Navigation timeout') || error.message.includes('Timeout')) {
        return NextResponse.json(
          { error: 'The website took too long to load. Please try again.' },
          { status: 408 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Failed to capture screenshot. Please try again.' },
      { status: 500 }
    )
  }
}

