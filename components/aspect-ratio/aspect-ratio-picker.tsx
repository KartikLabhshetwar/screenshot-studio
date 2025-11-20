import { aspectRatios } from '@/lib/constants/aspect-ratios';
import { useImageStore } from '@/lib/store';

interface AspectRatioPickerProps {
  onSelect?: () => void;
}

export const AspectRatioPicker = ({ onSelect }: AspectRatioPickerProps = {} as AspectRatioPickerProps) => {
  const { selectedAspectRatio, setAspectRatio } = useImageStore();

  const groupedRatios = aspectRatios.reduce((acc, ratio) => {
    if (!acc[ratio.category]) {
      acc[ratio.category] = [];
    }
    acc[ratio.category].push(ratio);
    return acc;
  }, {} as Record<string, typeof aspectRatios>);

  const categories = Object.keys(groupedRatios);

  const handleSelect = (id: string) => {
    setAspectRatio(id);
    onSelect?.();
  };

  return (
    <div className="max-h-[500px] overflow-y-auto">
      <div className="p-4 pb-3 border-b border-border/50">
        <h4 className="text-sm font-semibold text-foreground">All Aspect Ratios</h4>
        <p className="text-xs text-muted-foreground mt-1">Choose the perfect format for your content</p>
      </div>
      <div className="p-4 space-y-5">
        {categories.map((category) => (
          <div key={category} className="space-y-2.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {category}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {groupedRatios[category].map((aspectRatio) => {
                const isSelected = selectedAspectRatio === aspectRatio.id;
                return (
                  <button
                    key={aspectRatio.id}
                    onClick={() => handleSelect(aspectRatio.id)}
                    className={`relative rounded-lg overflow-hidden border transition-all group ${
                      isSelected
                        ? 'border-primary ring-1 ring-primary/30 bg-primary/5'
                        : 'border-border/50 hover:border-primary/50 hover:bg-accent/30'
                    }`}
                    style={{
                      aspectRatio: `${aspectRatio.width} / ${aspectRatio.height}`,
                      maxHeight: '80px',
                    }}
                    title={aspectRatio.description}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-muted/40 to-muted/20" />
                    
                    <div className={`absolute top-1 left-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${
                      isSelected
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-background/80 text-foreground backdrop-blur-sm'
                    }`}>
                      {aspectRatio.width}:{aspectRatio.height}
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-1.5 bg-gradient-to-t from-black/70 via-black/40 to-transparent">
                      <div className={`text-[10px] font-medium truncate ${
                        isSelected ? 'text-primary-foreground' : 'text-white'
                      }`}>
                        {aspectRatio.name}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

