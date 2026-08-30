'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  id?: string;
  'aria-label'?: string;
  className?: string;
}

export function Switch({
  checked,
  onCheckedChange,
  id,
  className,
  ...rest
}: SwitchProps) {
  return (
    <button
      type="button"
      id={id}
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        'relative inline-flex h-5 w-8 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-150 ease-out outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
        checked ? 'bg-primary' : 'bg-foreground/15',
        className,
      )}
      {...rest}
    >
      <span
        className={cn(
          'pointer-events-none block size-3.5 translate-x-1 rounded-full bg-white shadow transition-transform duration-150 ease-out motion-reduce:transition-none',
          checked && 'translate-x-[15px]',
        )}
      />
    </button>
  );
}
