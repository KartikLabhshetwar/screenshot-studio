'use client';

import * as React from 'react';
import { useImageStore } from '@/lib/store';
import { getAspectRatioPreset } from '@/lib/aspect-ratio-utils';
import { domToCanvas } from 'modern-screenshot';
import { ArrowDown01Icon, Cancel01Icon, LinkSquare02Icon, Loading03Icon, NewTwitterIcon } from 'hugeicons-react';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { Button } from '@/components/ui/button';

// ── Helpers ──────────────────────────────────────────────────────────────────

function parseTweetId(input: string): string | null {
  const trimmed = input.trim();
  if (/^\d+$/.test(trimmed)) return trimmed;
  const match = trimmed.match(/(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/);
  return match?.[1] ?? null;
}

function proxyUrl(url: string): string {
  return `/api/image-proxy?url=${encodeURIComponent(url)}`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  return String(n);
}

// ── Tweet data types ─────────────────────────────────────────────────────────

interface TweetUser {
  name: string;
  screen_name: string;
  profile_image_url_https: string;
  verified: boolean;
  is_blue_verified: boolean;
}

interface TweetPhoto {
  url: string;
  width: number;
  height: number;
}

interface TweetMediaDetail {
  media_url_https: string;
  type: string;
}

interface TweetEntity {
  urls?: { url: string; display_url: string; expanded_url: string }[];
  hashtags?: { text: string }[];
  user_mentions?: { screen_name: string }[];
}

interface TweetData {
  text: string;
  user: TweetUser;
  created_at: string;
  favorite_count: number;
  conversation_count?: number;
  photos?: TweetPhoto[];
  mediaDetails?: TweetMediaDetail[];
  entities?: TweetEntity;
  quoted_tweet?: TweetData;
}

function processText(tweet: TweetData): string {
  let text = tweet.text;
  if (tweet.entities?.urls) {
    for (const url of tweet.entities.urls) {
      text = text.replace(url.url, url.display_url);
    }
  }
  text = text.replace(/\s*https:\/\/t\.co\/\w+\s*$/, '');
  return text.trim();
}

// ── SVG Icons ────────────────────────────────────────────────────────────────

function XLogo({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill={color}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function VerifiedBadge() {
  return (
    <svg viewBox="0 0 22 22" width="16" height="16" style={{ flexShrink: 0 }}>
      <path
        fill="#1d9bf0"
        d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.69-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.636.433 1.221.878 1.69.47.446 1.055.752 1.69.883.635.13 1.294.083 1.902-.143.272.587.702 1.087 1.24 1.443s1.167.551 1.813.568c.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.222 1.26.27 1.894.141.634-.131 1.219-.437 1.69-.882.445-.47.749-1.055.878-1.691.13-.634.075-1.293-.148-1.9.586-.272 1.084-.702 1.438-1.241.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z"
      />
    </svg>
  );
}

function HeartIcon({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill={color}>
      <path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z" />
    </svg>
  );
}

function ReplyIcon({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill={color}>
      <path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z" />
    </svg>
  );
}

// ── Tweet Card ───────────────────────────────────────────────────────────────

// Standard Twitter/X feed column width is 598px.
// Capture at this width, then scale up to fill the canvas.
const TWEET_WIDTH = 598;

function TweetCard({ tweet, theme }: { tweet: TweetData; theme: 'light' | 'dark' }) {
  const isDark = theme === 'dark';

  const colors = isDark
    ? { bg: '#000000', text: '#e7e9ea', secondary: '#71767b', border: '#2f3336' }
    : { bg: '#ffffff', text: '#0f1419', secondary: '#536471', border: '#cfd9de' };

  const avatarUrl = proxyUrl(
    tweet.user.profile_image_url_https.replace('_normal', '_200x200')
  );
  const displayText = processText(tweet);
  const date = formatDate(tweet.created_at);

  const photos: string[] = [];
  if (tweet.photos) {
    for (const p of tweet.photos) photos.push(p.url);
  } else if (tweet.mediaDetails) {
    for (const m of tweet.mediaDetails) {
      if (m.type === 'photo') photos.push(m.media_url_https);
    }
  }

  // Sizes match standard Twitter/X card proportions at 550px.
  // domToCanvas reflows the clone to CAPTURE_WIDTH; scale: 2 gives 1100px retina output.
  return (
    <div
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        padding: '20px 24px',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <img
          src={avatarUrl}
          alt=""
          width={40}
          height={40}
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            flexShrink: 0,
            objectFit: 'cover',
          }}
          crossOrigin="anonymous"
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span
              style={{
                fontWeight: 700,
                fontSize: 15,
                lineHeight: 1.25,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {tweet.user.name}
            </span>
            {(tweet.user.is_blue_verified || tweet.user.verified) && <VerifiedBadge />}
          </div>
          <div style={{ color: colors.secondary, fontSize: 14, lineHeight: 1.25 }}>
            @{tweet.user.screen_name}
          </div>
        </div>
        <div style={{ flexShrink: 0 }}>
          <XLogo color={colors.text} />
        </div>
      </div>

      <div
        style={{
          fontSize: 17,
          lineHeight: 1.5,
          marginTop: 12,
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word',
          letterSpacing: '-0.01em',
        }}
      >
        {displayText}
      </div>

      {photos.length > 0 && (
        <div
          style={{
            marginTop: 12,
            display: 'grid',
            gridTemplateColumns: photos.length > 1 ? '1fr 1fr' : '1fr',
            gap: 2,
            borderRadius: 16,
            overflow: 'hidden',
            border: `1px solid ${colors.border}`,
          }}
        >
          {photos.slice(0, 4).map((url, i) => (
            <img
              key={i}
              src={proxyUrl(url)}
              alt=""
              style={{
                width: '100%',
                height: photos.length === 1 ? 'auto' : 200,
                maxHeight: photos.length === 1 ? 300 : undefined,
                objectFit: 'cover',
                display: 'block',
              }}
              crossOrigin="anonymous"
            />
          ))}
        </div>
      )}

      <div
        style={{
          marginTop: 12,
          paddingTop: 12,
          borderTop: `1px solid ${colors.border}`,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          color: colors.secondary,
          fontSize: 13,
        }}
      >
        <span>{date}</span>
        {(tweet.conversation_count ?? 0) > 0 && (
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <ReplyIcon color={colors.secondary} />
            {formatNumber(tweet.conversation_count!)}
          </span>
        )}
        {tweet.favorite_count > 0 && (
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <HeartIcon color={colors.secondary} />
            {formatNumber(tweet.favorite_count)}
          </span>
        )}
      </div>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────

type Status = 'idle' | 'loading' | 'loaded' | 'capturing';

export function TweetImportSection() {
  const { setUploadedImageUrl, setImageOpacity, setImageScale, setBorderRadius, selectedAspectRatio } = useImageStore();

  const [urlInput, setUrlInput] = React.useState('');
  const [tweetData, setTweetData] = React.useState<TweetData | null>(null);
  const [tweetTheme, setTweetTheme] = React.useState<'light' | 'dark'>('dark');
  const [status, setStatus] = React.useState<Status>('idle');
  const [error, setError] = React.useState<string | null>(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const requestAbortRef = React.useRef<AbortController | null>(null);

  // Separate ref for the off-screen full-width capture element
  const hiddenCaptureRef = React.useRef<HTMLDivElement>(null);
  // Preview: render at TWEET_WIDTH, scale down to sidebar width
  const previewWrapRef = React.useRef<HTMLDivElement>(null);
  const previewInnerRef = React.useRef<HTMLDivElement>(null);
  const [previewScale, setPreviewScale] = React.useState(1);
  const [previewHeight, setPreviewHeight] = React.useState<number | undefined>(undefined);

  // Recalculate scale + height whenever the wrapper or inner content changes
  React.useEffect(() => {
    const wrap = previewWrapRef.current;
    const inner = previewInnerRef.current;
    if (!wrap || !inner) return;

    const update = () => {
      const wrapW = wrap.clientWidth;
      const s = wrapW > 0 ? wrapW / TWEET_WIDTH : 1;
      setPreviewScale(s);
      setPreviewHeight(inner.scrollHeight * s);
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(wrap);
    ro.observe(inner);
    return () => ro.disconnect();
  }, [tweetData, tweetTheme]);

  // ── Fetch tweet ──
  const fetchTweet = React.useCallback(
    async (input: string) => {
      const id = parseTweetId(input);
      if (!id) {
        setError('Enter a valid tweet URL or ID');
        return;
      }

      setStatus('loading');
      setError(null);
      setTweetData(null);

      requestAbortRef.current?.abort();
      const controller = new AbortController();
      requestAbortRef.current = controller;
      let timedOut = false;
      const timeoutId = window.setTimeout(() => {
        timedOut = true;
        controller.abort();
      }, 20000);

      try {
        const res = await fetch(`/api/tweet/${id}`, { signal: controller.signal });
        const json = await res.json();
        if (requestAbortRef.current !== controller) return;

        if (!res.ok || !json.data) {
          setError(json.error || 'Tweet not found');
          setStatus('idle');
        } else {
          setTweetData(json.data as TweetData);
          setStatus('loaded');
        }
      } catch {
        if (requestAbortRef.current !== controller) return;
        setError(timedOut ? 'Tweet preview timed out. Try again' : 'Failed to fetch tweet');
        setStatus('idle');
      } finally {
        window.clearTimeout(timeoutId);
        if (requestAbortRef.current === controller) {
          requestAbortRef.current = null;
        }
      }
    },
    []
  );

  React.useEffect(() => {
    return () => requestAbortRef.current?.abort();
  }, []);

  const handleCancelFetch = React.useCallback(() => {
    requestAbortRef.current?.abort();
    requestAbortRef.current = null;
    setStatus('idle');
    setError(null);
  }, []);

  const handleDismissPreview = React.useCallback(() => {
    setTweetData(null);
    setStatus('idle');
  }, []);

  // ── Add to canvas ──
  // Captures from the hidden off-screen element which is already at TWEET_WIDTH.
  // Scales to fill canvas (same approach as CodeSnippetSection).
  const handleAddToCanvas = React.useCallback(async () => {
    if (!hiddenCaptureRef.current) return;
    setStatus('capturing');

    try {
      // Wait for images in the hidden capture element to load
      const images = hiddenCaptureRef.current.querySelectorAll('img');
      await Promise.all(
        Array.from(images).map(
          (img) =>
            new Promise<void>((resolve) => {
              if (img.complete) return resolve();
              img.onload = () => resolve();
              img.onerror = () => resolve();
            })
        )
      );

      // Scale to fill canvas width, minimum 2x for retina
      const preset = getAspectRatioPreset(selectedAspectRatio);
      const targetWidth = preset?.width || 1920;
      const captureScale = Math.max(2, targetWidth / TWEET_WIDTH);

      const captureBg = tweetTheme === 'dark' ? '#000000' : '#ffffff';
      const canvas = await domToCanvas(hiddenCaptureRef.current, {
        scale: captureScale,
        backgroundColor: captureBg,
      });

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, 'image/png')
      );

      if (blob) {
        const url = URL.createObjectURL(blob);
        setUploadedImageUrl(url, 'tweet-screenshot.png');
        setImageOpacity(1);
        setImageScale(100);
        setBorderRadius(16);
        setTweetData(null);
        setUrlInput('');
        setStatus('idle');
      }
    } catch (e) {
      console.error('Tweet capture failed:', e);
      setError('Failed to capture tweet');
      setStatus('loaded');
    }
  }, [setUploadedImageUrl, setImageOpacity, setImageScale, setBorderRadius, tweetTheme, selectedAspectRatio]);

  return (
    <>
      <div className="mb-1 px-2">
        <div className="overflow-hidden rounded-md border border-foreground/10 bg-foreground/[0.04] transition-colors hover:bg-foreground/[0.06]">
          <button
            type="button"
            onClick={() => setIsOpen((open) => !open)}
            aria-expanded={isOpen}
            aria-controls="tweet-import-content"
            className="group flex w-full items-center gap-3 px-3 py-3 text-left"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-foreground/[0.06] text-foreground">
              <NewTwitterIcon size={18} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium text-foreground">Add a Tweet</span>
              <span className="block truncate text-xs text-muted-foreground">Turn any X post into an image</span>
            </span>
            <ArrowDown01Icon
              size={16}
              className={`shrink-0 text-muted-foreground transition-transform duration-200 motion-reduce:transition-none group-hover:text-foreground ${isOpen ? "rotate-180" : ""}`}
              aria-hidden="true"
            />
          </button>

          <div
            id="tweet-import-content"
            hidden={!isOpen}
          >
            <div>
              <div className="space-y-3 border-t border-foreground/10 px-3 pb-3 pt-3">
          <p className="whitespace-nowrap text-[10px] leading-4 text-muted-foreground">
            Fetch, preview, then add to canvas.
          </p>

          <div className="space-y-2">
            <label
              htmlFor="tweet-url"
              className="block text-[10px] font-medium leading-4 text-foreground"
            >
              Tweet URL
            </label>

            <div className="relative">
              <LinkSquare02Icon
                size={14}
                aria-hidden="true"
                className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/50"
              />
              <input
                id="tweet-url"
                type="url"
                value={urlInput}
                onChange={(event) => {
                  setUrlInput(event.target.value);
                  if (error) setError(null);
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') fetchTweet(urlInput);
                }}
                placeholder="https://x.com/user/status/..."
                spellCheck={false}
                autoComplete="off"
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? 'tweet-url-error' : undefined}
                className="h-9 w-full rounded-md border border-foreground/10 bg-foreground/4 pl-8 pr-9 text-[11px] text-foreground outline-none transition-[border-color,box-shadow] max-[768px]:h-11 placeholder:text-muted-foreground/50 focus-visible:border-foreground/30 focus-visible:ring-2 focus-visible:ring-ring/40"
              />
              {urlInput ? (
                <button
                  type="button"
                  onClick={() => {
                    setUrlInput('');
                    setError(null);
                    setTweetData(null);
                    setStatus('idle');
                  }}
                  aria-label="Clear tweet URL"
                  className="absolute right-1.5 top-1/2 flex size-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-muted-foreground after:absolute after:-inset-2 after:content-[''] hover:bg-foreground/6 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                >
                  <Cancel01Icon size={13} aria-hidden="true" />
                </button>
              ) : null}
            </div>

            {error ? (
              <div
                id="tweet-url-error"
                role="alert"
                className="rounded-md border border-destructive/20 bg-destructive/10 px-2.5 py-2 text-[10px] leading-4 text-destructive"
              >
                {error}
              </div>
            ) : null}

            {status === 'idle' && urlInput.trim() && !tweetData && !error ? (
              <div>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => fetchTweet(urlInput)}
                  className="h-9 w-full text-[11px] max-[768px]:h-11"
                >
                  Fetch tweet
                </Button>
                <p className="mt-2 text-[9px] leading-4 text-muted-foreground">
                  You will review the screenshot before it reaches the canvas.
                </p>
              </div>
            ) : null}
          </div>

          {status === 'loading' ? (
            <div
              role="status"
              aria-live="polite"
              className="rounded-md border border-foreground/10 bg-foreground/4 p-3"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-foreground/8 text-foreground">
                  <Loading03Icon
                    size={15}
                    aria-hidden="true"
                    className="motion-safe:animate-spin"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold leading-4 text-foreground">
                    Fetching tweet
                  </p>
                  <p className="text-[9px] leading-4 text-muted-foreground">
                    Fetching post details and media
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCancelFetch}
                  className="ml-auto min-h-6 cursor-pointer rounded-md px-2 py-1 text-[9px] font-medium text-muted-foreground max-[768px]:min-h-11 hover:bg-foreground/6 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : null}

          {tweetData && status !== 'loading' ? (
            <div className="space-y-2.5">
              <SegmentedControl
                size="sm"
                value={tweetTheme}
                onChange={(id) => setTweetTheme(id as 'light' | 'dark')}
                options={[
                  { id: 'light', label: 'Light' },
                  { id: 'dark', label: 'Dark' },
                ]}
                className="w-full"
              />

              <div className="relative">
                <button
                  type="button"
                  onClick={handleDismissPreview}
                  disabled={status === 'capturing'}
                  aria-label="Dismiss preview"
                  className="absolute right-2 top-2 z-10 flex size-6 cursor-pointer items-center justify-center rounded-md bg-foreground/10 text-muted-foreground backdrop-blur-sm after:absolute after:-inset-2.5 after:content-[''] transition-colors hover:bg-foreground/20 hover:text-foreground disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                >
                  <Cancel01Icon size={12} aria-hidden="true" />
                </button>
                <div
                  ref={previewWrapRef}
                  className="rounded-md border border-foreground/10 ring-1 ring-foreground/4"
                  style={{
                    overflow: 'hidden',
                    height: previewHeight,
                    backgroundColor: tweetTheme === 'dark' ? '#000000' : '#ffffff',
                  }}
                >
                  <div
                    ref={previewInnerRef}
                    style={{
                      width: TWEET_WIDTH,
                      transform: `scale(${previewScale})`,
                      transformOrigin: 'top left',
                    }}
                  >
                    <TweetCard tweet={tweetData} theme={tweetTheme} />
                  </div>
                </div>
              </div>

              <Button
                type="button"
                size="sm"
                onClick={handleAddToCanvas}
                disabled={status === 'capturing'}
                className="h-9 w-full text-[11px] max-[768px]:h-11"
              >
                {status === 'capturing' ? (
                  <>
                    <Loading03Icon
                      size={13}
                      aria-hidden="true"
                      className="motion-safe:animate-spin"
                    />
                    Adding{'\u2026'}
                  </>
                ) : (
                  'Add to canvas'
                )}
              </Button>
            </div>
          ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>

    {tweetData && (
      <div
        aria-hidden
        style={{
          position: 'fixed',
          left: '-99999px',
          top: 0,
          pointerEvents: 'none',
          zIndex: -1,
        }}
      >
        <div
          ref={hiddenCaptureRef}
          style={{
            width: TWEET_WIDTH,
            backgroundColor: tweetTheme === 'dark' ? '#000000' : '#ffffff',
          }}
        >
          <TweetCard tweet={tweetData} theme={tweetTheme} />
        </div>
      </div>
    )}
    </>
  );
}
