"use client";

import { useImageStore } from "@/lib/store";
import { useResponsiveCanvasDimensions } from "@/hooks/useAspectRatioDimensions";
import { getBackgroundCSS } from "@/lib/constants/backgrounds";
import { cn } from "@/lib/utils";

type CanvasStageShellProps = {
  children?: React.ReactNode;
  breathe?: boolean;
  showBackground?: boolean;
  className?: string;
  id?: string;
  style?: React.CSSProperties;
};

export function CanvasStageShell({
  children,
  breathe = false,
  showBackground = false,
  className,
  id,
  style,
}: CanvasStageShellProps): React.JSX.Element {
  const backgroundBorderRadius = useImageStore((s) => s.backgroundBorderRadius);
  const backgroundConfig = useImageStore((s) => s.backgroundConfig);
  const responsiveDimensions = useResponsiveCanvasDimensions();
  const backgroundStyle = showBackground
    ? getBackgroundCSS(backgroundConfig)
    : undefined;

  return (
    <div
      id={id}
      className={cn(
        "relative shrink-0 transition-[border-radius] duration-300",
        "shadow-xl ring-1 ring-foreground/10",
        breathe && "canvas-stage-breathe",
        className
      )}
      style={{
        width: `${responsiveDimensions.width}px`,
        height: `${responsiveDimensions.height}px`,
        borderRadius: `${backgroundBorderRadius}px`,
        ...style,
      }}
    >
      {showBackground ? (
        <div className="absolute inset-0" style={backgroundStyle} aria-hidden />
      ) : null}
      {children}
    </div>
  );
}
