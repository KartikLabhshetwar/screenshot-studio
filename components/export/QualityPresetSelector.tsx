/**
 * Quality preset selector component for export options
 */

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import type { ExportFormat, QualityPreset } from '@/lib/export/types';
import { QUALITY_PRESET_LABELS } from '@/lib/export/types';

interface QualityPresetSelectorProps {
  qualityPreset: QualityPreset;
  format: ExportFormat;
  onQualityPresetChange: (preset: QualityPreset) => void;
}

const PRESETS: QualityPreset[] = ['high', 'medium', 'low'];

export function QualityPresetSelector({
  qualityPreset,
  format,
  onQualityPresetChange,
}: QualityPresetSelectorProps) {
  const currentLabel = QUALITY_PRESET_LABELS[qualityPreset];

  return (
    <div className="space-y-2">
      <Label className="text-sm font-semibold text-foreground">Quality</Label>
      <div className="flex gap-2">
        {PRESETS.map((preset) => {
          const isSelected = preset === qualityPreset;
          return (
            <Button
              key={preset}
              variant={isSelected ? 'default' : 'outline'}
              onClick={() => onQualityPresetChange(preset)}
              className={`flex-1 h-11 touch-manipulation ${
                isSelected
                  ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                  : 'bg-background hover:bg-accent'
              }`}
            >
              {QUALITY_PRESET_LABELS[preset].label}
            </Button>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground">
        {currentLabel.description[format]}
      </p>
    </div>
  );
}
