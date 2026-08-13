"use client";

export function CanvasStageLoadingOverlay(): React.JSX.Element {
  return (
    <div
      className="absolute inset-0 z-20 flex items-center justify-center overflow-hidden rounded-[inherit]"
      aria-busy="true"
      aria-label="Preparing image"
    >
      <div className="canvas-stage-shimmer absolute inset-0" aria-hidden />
      <div className="relative flex flex-col items-center gap-3">
        <div
          className="h-9 w-9 rounded-full border-2 border-foreground/15 border-t-white/80 animate-spin"
          aria-hidden
        />
        <p className="text-sm font-medium text-foreground/75 tracking-wide">
          Preparing image
        </p>
      </div>
    </div>
  );
}
