'use client';

import * as React from 'react';
import { ArrowDown01Icon } from 'hugeicons-react';
import { cn } from '@/lib/utils';

interface SectionWrapperProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
  action?: React.ReactNode;
}

export function SectionWrapper({
  title,
  children,
  defaultOpen = true,
  className,
  action
}: SectionWrapperProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <div className={cn('mb-1', className)}>
      <div
        className="w-full flex items-center justify-between gap-2 py-3 px-2 group"
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 flex-1"
        >
          <ArrowDown01Icon
            size={16}
            className={cn(
              'text-muted-foreground transition-transform duration-200',
              !isOpen && '-rotate-90'
            )}
          />
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground group-hover:text-foreground">
            {title}
          </span>
        </button>
        {action && <div>{action}</div>}
      </div>

      <div className={cn(
        'overflow-hidden transition-[max-height,opacity] duration-200 motion-reduce:transition-none',
        isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
      )}>
        <div className="px-2 pb-4 space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
}
