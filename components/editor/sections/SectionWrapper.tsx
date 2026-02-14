'use client';

import * as React from 'react';
import { ArrowDown01Icon } from 'hugeicons-react';
import { cn } from '@/lib/utils';

interface SectionWrapperProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export function SectionWrapper({
  title,
  children,
  defaultOpen = true,
  className
}: SectionWrapperProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <div className={cn('mb-1', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-2 py-3 px-2 hover:bg-surface-2/30 rounded-lg transition-colors group"
      >
        <ArrowDown01Icon
          size={16}
          className={cn(
            'text-text-tertiary transition-transform duration-200',
            !isOpen && '-rotate-90'
          )}
        />
        <span className="text-xs font-semibold uppercase tracking-wider text-text-tertiary group-hover:text-text-secondary">
          {title}
        </span>
      </button>

      <div className={cn(
        'overflow-hidden transition-all duration-200',
        isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
      )}>
        <div className="px-2 pb-4 space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
}
