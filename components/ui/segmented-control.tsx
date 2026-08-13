'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface SegmentedControlOption {
  id: string;
  label?: string;
  icon?: React.ReactNode;
  ariaLabel?: string;
}

interface SegmentedControlProps {
  options: SegmentedControlOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  indicatorClassName?: string;
  size?: 'sm' | 'md';
}

export function SegmentedControl({
  options,
  value,
  onChange,
  className,
  indicatorClassName,
  size = 'md',
}: SegmentedControlProps) {
  const activeIndex = Math.max(
    0,
    options.findIndex((o) => o.id === value)
  );
  const count = Math.max(options.length, 1);

  return (
    <div
      role="tablist"
      className={cn(
        'relative flex w-full overflow-hidden border border-foreground/10 bg-foreground/[0.04]',
        size === 'sm' ? 'h-8 p-0.5 rounded-md' : 'h-9 p-0.5 rounded-md',
        className
      )}
    >
      <div
        aria-hidden="true"
        className={cn(
          'absolute top-0.5 bottom-0.5 rounded-[5px] bg-foreground/[0.1]',
          'shadow-[var(--card-highlight-shadow)]',
          'transition-[left,width] duration-200 ease-out',
          'motion-reduce:transition-none',
          indicatorClassName
        )}
        style={{
          left: `calc(${(activeIndex / count) * 100}% + 2px)`,
          width: `calc(${100 / count}% - 4px)`,
        }}
      />
      {options.map((option) => {
        const isActive = value === option.id;
        return (
          <button
            key={option.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(option.id)}
            aria-label={option.ariaLabel ?? option.label}
            title={option.ariaLabel ?? option.label}
            className={cn(
              'relative z-10 flex h-full min-h-0 min-w-0 flex-1 items-center justify-center gap-1.5',
              'rounded-[5px] transition-colors duration-150',
              'outline-none focus-visible:ring-2 focus-visible:ring-foreground/25',
              size === 'sm' ? 'px-1 text-[10px]' : 'px-1.5 text-[11px]',
              isActive
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {option.icon ? (
              <span
                className={cn(
                  'shrink-0 [&_svg]:block',
                  isActive ? 'text-foreground' : 'text-current'
                )}
              >
                {option.icon}
              </span>
            ) : null}
            {option.label ? (
              <span className="truncate font-medium">{option.label}</span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
