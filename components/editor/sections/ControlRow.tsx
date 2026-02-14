'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface ControlRowProps {
  label: string;
  children: React.ReactNode;
  className?: string;
  labelWidth?: string;
}

export function ControlRow({
  label,
  children,
  className,
  labelWidth = 'w-[60px]'
}: ControlRowProps) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <span className={cn('text-sm text-muted-foreground shrink-0', labelWidth)}>
        {label}
      </span>
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}
