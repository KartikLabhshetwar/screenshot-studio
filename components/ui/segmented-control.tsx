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
  const activeIndex = options.findIndex((o) => o.id === value);

  return (
    <div
      className={cn(
        'relative flex bg-muted dark:bg-muted/80 border border-border/20',
        size === 'sm' ? 'p-[2px] rounded-[10px]' : 'p-0.5 rounded-xl',
        className
      )}
    >
      <div
        className={cn(
          'absolute bg-background dark:bg-accent transition-all duration-200 ease-out',
          size === 'sm'
            ? 'top-[2px] bottom-[2px] rounded-[8px]'
            : 'top-0.5 bottom-0.5 rounded-[10px]',
          indicatorClassName
        )}
        style={{
          left: `calc(${activeIndex * (100 / options.length)}% + 2px)`,
          width: `calc(${100 / options.length}% - 4px)`,
        }}
      />
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => onChange(option.id)}
          aria-label={option.ariaLabel ?? option.label}
          title={option.ariaLabel ?? option.label}
          className={cn(
            'relative z-10 flex-1 flex items-center justify-center gap-1.5 transition-colors duration-150',
            size === 'sm'
              ? 'py-1.5 px-2 rounded-[8px]'
              : 'py-2 px-2.5 rounded-[10px]',
            value === option.id
              ? 'text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          {option.icon}
          {option.label && (
            <span
              className={cn(
                'font-medium',
                size === 'sm' ? 'text-[10px]' : 'text-[11px]'
              )}
            >
              {option.label}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
