import { NextRequest, NextResponse } from 'next/server';
import { getTweet } from 'react-tweet/api';
import { apiError } from '@/lib/api/errors';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const tweet = await getTweet(id);
    if (!tweet) {
      return apiError(
        404,
        'not_found',
        'Tweet not found',
        'Check the numeric status id. Deleted, private, and suspended-account tweets are not retrievable.',
        { data: null }
      );
    }
    return NextResponse.json({ data: tweet });
  } catch {
    return apiError(
      500,
      'internal_error',
      'Failed to fetch tweet',
      'The upstream syndication API failed. Retry with exponential backoff.',
      { data: null }
    );
  }
}
