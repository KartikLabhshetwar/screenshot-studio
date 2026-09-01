"use client";

interface CanvasObjectTopControlsProps {
  handleScale?: number;
  onRotatePointerDown: (event: React.PointerEvent<HTMLButtonElement>) => void;
  onRotateKeyDown?: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
  onRemove: (event: React.MouseEvent<HTMLButtonElement>) => void;
  objectLabel: string;
}

export function CanvasObjectTopControls({
  handleScale = 1,
  onRotatePointerDown,
  onRotateKeyDown,
  onRemove,
  objectLabel,
}: CanvasObjectTopControlsProps): React.JSX.Element {
  return (
    <>
      <div
        data-resize-handle="true"
        style={{
          position: "absolute",
          top: `${-35 * handleScale}px`,
          left: "50%",
          width: "1px",
          height: `${30 * handleScale}px`,
          backgroundColor: "color-mix(in srgb, var(--canvas-selection) 50%, transparent)",
          transform: `translateX(-0.5px) scaleX(${handleScale})`,
          pointerEvents: "none",
          zIndex: 20,
        }}
      />

      <button
        type="button"
        data-resize-handle="true"
        onPointerDown={onRotatePointerDown}
        onKeyDown={onRotateKeyDown}
        aria-label={`Rotate ${objectLabel}`}
        title={`Rotate ${objectLabel}`}
        className="after:absolute after:-bottom-[11px] after:-left-[18px] after:-right-1 after:-top-[11px] after:content-[''] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        style={{
          position: "absolute",
          top: `${-52 * handleScale}px`,
          left: "50%",
          transform: `translateX(-50%) scale(${handleScale})`,
          transformOrigin: "top center",
          width: "22px",
          height: "22px",
          padding: 0,
          backgroundColor: "var(--canvas-control-surface)",
          border: "2px solid color-mix(in srgb, var(--canvas-selection) 80%, transparent)",
          borderRadius: "50%",
          cursor: "grab",
          zIndex: 21,
          pointerEvents: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="color-mix(in srgb, var(--canvas-selection) 80%, transparent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21.5 2v6h-6" />
          <path d="M21.34 13.72A10 10 0 1 1 18.57 4.62L21.5 8" />
        </svg>
      </button>

      <button
        type="button"
        data-resize-handle="true"
        onClick={onRemove}
        aria-label={`Remove ${objectLabel}`}
        title={`Remove ${objectLabel}`}
        className="after:absolute after:-bottom-[11px] after:-left-1 after:-right-[18px] after:-top-[11px] after:content-[''] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        style={{
          position: "absolute",
          top: `${-52 * handleScale}px`,
          left: "50%",
          transform: `translateX(calc(-50% + ${30 * handleScale}px)) scale(${handleScale})`,
          transformOrigin: "top center",
          width: "22px",
          height: "22px",
          padding: 0,
          backgroundColor: "var(--canvas-control-surface)",
          border: "2px solid color-mix(in srgb, var(--canvas-destructive) 80%, transparent)",
          borderRadius: "50%",
          cursor: "pointer",
          zIndex: 21,
          pointerEvents: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="color-mix(in srgb, var(--canvas-destructive) 80%, transparent)" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </>
  );
}
