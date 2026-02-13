/**
 * Format selector component for export options
 */

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import type { ExportFormat } from '@/lib/export/types';

interface FormatSelectorProps {
  format: ExportFormat;
  onFormatChange: (format: ExportFormat) => void;
}

const FORMATS: { value: ExportFormat; label: string; description: string }[] = [
  { value: 'png', label: 'PNG', description: 'Lossless, supports transparency' },
  { value: 'jpeg', label: 'JPEG', description: 'Smaller files, no transparency' },
];

export function FormatSelector({ format, onFormatChange }: FormatSelectorProps) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-semibold text-foreground">Format</Label>
      <div className="flex gap-2">
        {FORMATS.map((f) => {
          const isSelected = f.value === format;
          return (
            <Button
              key={f.value}
              variant={isSelected ? 'default' : 'outline'}
              onClick={() => onFormatChange(f.value)}
              className={`flex-1 h-11 touch-manipulation ${
                isSelected
                  ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                  : 'bg-background hover:bg-accent'
              }`}
            >
              {f.label}
            </Button>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground">
        {FORMATS.find((f) => f.value === format)?.description}
      </p>
    </div>
  );
}

