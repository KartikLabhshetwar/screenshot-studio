import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { aspectRatios } from '@/lib/constants/aspect-ratios';
import { useImageStore } from '@/lib/store';
import { AspectRatioPicker } from './aspect-ratio-picker';
import { Button } from '@/components/ui/button';
import * as React from 'react';
import { ArrowDown01Icon } from 'hugeicons-react';

const popularRatios = ['1_1', '9_16', '16_9', '4_5', 'og_image'];

export const AspectRatioDropdown = () => {
  const { selectedAspectRatio, setAspectRatio } = useImageStore();
  const current = aspectRatios.find((ar) => ar.id === selectedAspectRatio);
  const [open, setOpen] = React.useState(false);

  const handleQuickSelect = (id: string) => {
    setAspectRatio(id);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className="space-y-3">
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between h-auto py-2.5 px-3 border-border/50 hover:border-border hover:bg-accent/50"
          >
            <div className="flex items-center gap-2.5 flex-1 min-w-0">
              <div
                className="bg-primary/80 rounded shrink-0 border border-primary/30"
                style={{
                  width: '24px',
                  height: `${24 * (current?.ratio || 1)}px`,
                  maxHeight: '24px',
                  minHeight: '10px',
                }}
              />
              <div className="flex-1 min-w-0 text-left">
                <div className="text-sm font-medium text-foreground truncate">
                  {current?.name || 'Aspect Ratio'}
                </div>
                <div className="text-xs text-muted-foreground">
                  {current ? `${current.width}:${current.height}` : 'Select ratio'}
                </div>
              </div>
            </div>
            <ArrowDown01Icon size={16} className="text-muted-foreground shrink-0 ml-2" />
          </Button>
        </PopoverTrigger>

        <div className="flex items-center gap-1.5">
          <span className="text-xs text-muted-foreground">Quick:</span>
          <div className="flex items-center gap-1.5 flex-1">
            {popularRatios.map((id) => {
              const ratio = aspectRatios.find((ar) => ar.id === id);
              if (!ratio) return null;
              const isSelected = selectedAspectRatio === id;
              return (
                <button
                  key={id}
                  onClick={() => handleQuickSelect(id)}
                  className={`relative rounded-md border transition-all ${
                    isSelected
                      ? 'border-primary bg-primary/10'
                      : 'border-border/50 hover:border-border hover:bg-accent/50'
                  }`}
                  style={{
                    width: '32px',
                    height: `${32 * ratio.ratio}px`,
                    maxHeight: '32px',
                    minHeight: '12px',
                  }}
                  title={`${ratio.name} (${ratio.width}:${ratio.height})`}
                >
                  {isSelected && (
                    <div className="absolute inset-0 bg-primary/20 rounded-md" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <PopoverContent className="p-0 w-[420px] max-h-[600px]" align="start">
        <AspectRatioPicker onSelect={() => setOpen(false)} />
      </PopoverContent>
    </Popover>
  );
};

