import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 10

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url } = body

    const screenshotApiKey = process.env.SCREENSHOTAPI_KEY

    // Validate API key is provided
    if (!screenshotApiKey) {
      return NextResponse.json(
        { error: 'ScreenshotAPI.net API key is required. Please set SCREENSHOTAPI_KEY in your environment variables.' },
        { status: 400 }
      )
    }

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

    const encodedUrl = encodeURIComponent(validUrl.toString())


    const apiUrl = `https://shot.screenshotapi.net/v3/screenshot?token=${screenshotApiKey}&url=${encodedUrl}&output=image&width=1920&height=1080&file_type=PNG&full_page=false`

    try {
      const response = await fetch(apiUrl, {
        headers: {
          'Accept': 'image/png',
        },
        signal: AbortSignal.timeout(8000), // 8s timeout
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('ScreenshotAPI.net error:', response.status, errorText)
        
        if (response.status === 401) {
          return NextResponse.json(
            { error: 'Invalid API key. Please check your SCREENSHOTAPI_KEY.' },
            { status: 401 }
          )
        }
        
        if (response.status === 429) {
          return NextResponse.json(
            { error: 'Rate limit exceeded. Please try again later.' },
            { status: 429 }
          )
        }

        return NextResponse.json(
          { error: `ScreenshotAPI.net returned error: ${response.status}` },
          { status: response.status }
        )
      }

      // Get image as buffer
      const imageBuffer = await response.arrayBuffer()
      const screenshotBase64 = Buffer.from(imageBuffer).toString('base64')

      return NextResponse.json({
        screenshot: screenshotBase64,
        url: validUrl.toString(),
      })
    } catch (error) {
      console.error('ScreenshotAPI.net request error:', error)

      if (error instanceof Error && error.name === 'TimeoutError') {
        return NextResponse.json(
          { error: 'Screenshot request timed out. Please try again.' },
          { status: 408 }
        )
      }

      return NextResponse.json(
        { error: 'Failed to capture screenshot. Please try again.' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Screenshot error:', error)

    return NextResponse.json(
      { error: 'Failed to capture screenshot. Please try again.' },
      { status: 500 }
    )
  }
}

