import { NextRequest, NextResponse } from 'next/server'
import { clearOldCache } from '@/lib/screenshot-cache'
import { apiError, methodNotAllowed } from '@/lib/api/errors'

export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { secret } = body

    if (secret !== process.env.CLEANUP_SECRET) {
      return apiError(
        401,
        'unauthorized',
        'Unauthorized',
        'This maintenance endpoint requires the shared cleanup secret and is not part of the public API.'
      )
    }

    await clearOldCache()
    
    return NextResponse.json({ 
      success: true, 
      message: 'Cache cleanup completed' 
    })
  } catch (error) {
    console.error('Cache cleanup error:', error)
    return apiError(
      500,
      'internal_error',
      'Cache cleanup failed',
      'Retry the request. Check the server logs for the underlying storage error.'
    )
  }
}

export async function GET() {
  return methodNotAllowed(['POST'])
}

