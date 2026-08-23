import { NextRequest, NextResponse } from 'next/server';
import { apiError } from '@/lib/api/errors';

const ALLOWED_DOMAINS = [
  'pbs.twimg.com',
  'abs.twimg.com',
  'ton.twitter.com',
  'video.twimg.com',
];

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');
  if (!url) {
    return apiError(
      400,
      'invalid_request',
      'Missing url parameter',
      `Append ?url= followed by an encoded image URL on one of: ${ALLOWED_DOMAINS.join(', ')}.`
    );
  }

  try {
    const parsed = new URL(url);
    if (!ALLOWED_DOMAINS.includes(parsed.hostname)) {
      return apiError(
        403,
        'forbidden_domain',
        'Domain not allowed',
        `This proxy only serves images from: ${ALLOWED_DOMAINS.join(', ')}.`
      );
    }

    const response = await fetch(url);
    if (!response.ok) {
      return apiError(
        502,
        'upstream_failed',
        'Upstream fetch failed',
        `The upstream host returned ${response.status}. Verify the image URL is still live, then retry.`
      );
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const buffer = await response.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, immutable',
      },
    });
  } catch {
    return apiError(
      500,
      'internal_error',
      'Failed to fetch image',
      'Check that the url parameter is a valid absolute URL, then retry.'
    );
  }
}
