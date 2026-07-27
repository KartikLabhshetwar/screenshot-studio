'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const REPO = 'KartikLabhshetwar/screenshot-studio';
const CACHE_KEY = 'gh-stars-v2';
const CACHE_TTL = 5 * 60 * 1000;

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"
      />
    </svg>
  );
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z" />
    </svg>
  );
}

function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef(0);

  useEffect(() => {
    // Always animate from 0 to value
    cancelAnimationFrame(rafRef.current);
    setDisplay(0);

    const start = performance.now();
    const duration = 1400;

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      setDisplay(Math.round(value * eased));
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [value]);

  return <>{display.toLocaleString()}</>;
}

function useStarCount() {
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    // Check cache
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { count, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_TTL && count > 0) {
          setStars(count);
          return;
        }
      }
    } catch { /* empty */ }

    fetch(`https://api.github.com/repos/${REPO}`, {
      headers: { Accept: 'application/vnd.github.v3+json' },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.stargazers_count != null) {
          const count = data.stargazers_count;
          setStars(count);
          try {
            localStorage.setItem(
              CACHE_KEY,
              JSON.stringify({ count, timestamp: Date.now() })
            );
          } catch { /* empty */ }
        }
      })
      .catch(() => {});
  }, []);

  return stars;
}

export function GitHubStarButton({ compact }: { compact?: boolean }) {
  const stars = useStarCount();

  return (
    <Link
      href={`https://github.com/${REPO}`}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'inline-flex items-center gap-1.5 rounded-lg border border-border/60 transition-colors',
        'text-muted-foreground hover:text-foreground hover:border-border hover:bg-muted/50',
        compact ? 'h-8 px-2.5 text-xs' : 'h-9 px-3 text-sm'
      )}
    >
      <GitHubIcon className={compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
      {!compact && (
        <span className="font-medium hidden sm:inline">Star</span>
      )}
      {stars !== null && stars > 0 && (
        <>
          <span className="w-px h-3.5 bg-border/60" />
          <span className="font-medium flex items-center gap-0.5 tabular-nums">
            <StarIcon
              className={cn(
                'text-amber-400',
                compact ? 'w-2.5 h-2.5' : 'w-3 h-3'
              )}
            />
            <AnimatedNumber value={stars} />
          </span>
        </>
      )}
    </Link>
  );
}
