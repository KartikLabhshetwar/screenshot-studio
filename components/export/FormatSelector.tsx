'use client';

import { SegmentedControl } from '@/components/ui/segmented-control';
import type { ExportFormat } from '@/lib/export/types';

interface FormatSelectorProps {
  format: ExportFormat;
  onFormatChange: (format: ExportFormat) => void;
}

const FORMATS: { value: ExportFormat; label: string; description: string }[] = [
  { value: 'jpeg', label: 'JPEG', description: 'Smaller files, great for sharing' },
  { value: 'png', label: 'PNG', description: 'Lossless, supports transparency' },
  { value: 'webp', label: 'WebP', description: 'Best compression, small & sharp' },
];

export function FormatSelector({ format, onFormatChange }: FormatSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">Format</label>
      <SegmentedControl
        value={format}
        onChange={(id) => onFormatChange(id as ExportFormat)}
        options={FORMATS.map((f) => ({
          id: f.value,
          label: f.label,
        }))}
      />
      <p className="text-xs text-muted-foreground">
        {FORMATS.find((f) => f.value === format)?.description}
      </p>
    </div>
  );
}
