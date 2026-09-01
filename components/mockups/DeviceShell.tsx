"use client";

import type {
  ClipboardEventHandler,
  CSSProperties,
  DragEventHandler,
  KeyboardEventHandler,
  PointerEventHandler,
} from "react";
import { cn } from "@/lib/utils";
import type { DeviceScreenContent, MockupDefinition } from "@/types/mockup";

interface DeviceShellProps {
  definition: MockupDefinition;
  screen: DeviceScreenContent;
  editing?: boolean;
  onScreenClick?: () => void;
  onScreenDoubleClick?: () => void;
  onScreenFile?: (file: File) => void;
  onScreenPointerDown?: PointerEventHandler<HTMLDivElement>;
}

function Screen({
  screen,
  editing,
  className,
  style,
  emptyStatePosition,
  emptyStateWidth,
  emptyStateTransform,
  onClick,
  onDoubleClick,
  onFile,
  onPointerDown,
}: {
  screen: DeviceScreenContent;
  editing: boolean;
  className?: string;
  style?: CSSProperties;
  emptyStatePosition?: { x: number; y: number };
  emptyStateWidth?: number;
  emptyStateTransform?: string;
  onClick?: () => void;
  onDoubleClick?: () => void;
  onFile?: (file: File) => void;
  onPointerDown?: PointerEventHandler<HTMLDivElement>;
}): React.JSX.Element {
  const acceptDroppedImage = ((event) => {
    if (!onFile) return;
    event.preventDefault();
    event.stopPropagation();
    const file = Array.from(event.dataTransfer.files).find((item) => item.type.startsWith("image/"));
    if (file) onFile(file);
  }) satisfies DragEventHandler<HTMLDivElement>;

  const acceptPastedImage = ((event) => {
    if (!onFile) return;
    const file = Array.from(event.clipboardData.files).find((item) => item.type.startsWith("image/"));
    if (!file) return;
    event.preventDefault();
    event.stopPropagation();
    onFile(file);
  }) satisfies ClipboardEventHandler<HTMLDivElement>;

  return (
    <div
      className={cn(
        "group absolute overflow-hidden bg-muted",
        editing && "ring-2 ring-primary ring-offset-1 ring-offset-foreground/20",
        onClick && !screen.src && "cursor-pointer",
        className,
      )}
      onClick={(event) => {
        if (!onClick) return;
        event.stopPropagation();
        onClick();
      }}
      onKeyDown={((event) => {
        if (!onClick || (event.key !== "Enter" && event.key !== " ")) return;
        event.preventDefault();
        event.stopPropagation();
        onClick();
      }) satisfies KeyboardEventHandler<HTMLDivElement>}
      onDoubleClick={(event) => {
        event.stopPropagation();
        onDoubleClick?.();
      }}
      onDragOver={(event) => {
        if (!onFile) return;
        event.preventDefault();
        event.stopPropagation();
        event.dataTransfer.dropEffect = "copy";
      }}
      onDrop={acceptDroppedImage}
      onPaste={acceptPastedImage}
      onPointerDown={onPointerDown}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={onClick ? "Upload image to device screen" : undefined}
      data-device-screen-dropzone={onFile ? "" : undefined}
      data-export-clean-device-screen={editing ? "true" : undefined}
      style={{ ...style, touchAction: editing ? "none" : undefined }}
    >
      {screen.src ? (
        <img
          src={screen.src}
          alt="Device screen"
          draggable={false}
          className="block h-full w-full select-none"
          style={{
            objectFit: screen.fit,
            transform: `translate(${screen.offset.x}%, ${screen.offset.y}%) scale(${screen.scale})`,
            transformOrigin: "center",
            pointerEvents: "none",
          }}
        />
      ) : (
        <div className="relative h-full w-full bg-muted text-foreground/65 [container-type:size]">
          {onClick ? (
            <div
              data-export-exclude="true"
              className="absolute flex w-full -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-[7cqh] px-[6%] text-center"
              style={{
                left: `${(emptyStatePosition?.x ?? 0.5) * 100}%`,
                top: `${(emptyStatePosition?.y ?? 0.5) * 100}%`,
              }}
            >
              <div
                className="flex w-full flex-col items-center justify-center gap-[7cqh]"
                style={{
                  width: `${(emptyStateWidth ?? 1) * 100}%`,
                  transform: emptyStateTransform,
                  transformOrigin: "center",
                }}
              >
                <svg
                  viewBox="0 0 48 48"
                  fill="none"
                  aria-hidden="true"
                  className="aspect-square w-[14%] min-w-5 max-w-11 origin-center drop-shadow-sm transition-transform duration-100 ease-out will-change-transform group-active:scale-[0.92] motion-reduce:transform-none motion-reduce:transition-none"
                >
                  <line x1="24" y1="8" x2="24" y2="40" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="8" y1="24" x2="40" y2="24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
                <span className="max-w-full text-balance text-[clamp(6px,2.4cqw,18px)] font-medium leading-tight tracking-[-0.015em]">
                  Drag &amp; drop, click to browse, or paste
                </span>
              </div>
            </div>
          ) : null}
        </div>
      )}
      {editing ? (
        <div
          data-export-exclude="true"
          className="pointer-events-none absolute inset-0 bg-primary/5"
        />
      ) : null}
    </div>
  );
}

function frameClasses(finish: MockupDefinition["finish"]): string {
  if (finish === "light") return "border-foreground/20 bg-background shadow-foreground/20";
  if (finish === "graphite") return "border-background/20 bg-foreground/80 shadow-foreground/30";
  return "border-background/15 bg-foreground shadow-foreground/30";
}

function perspectiveStyle(perspective: MockupDefinition["perspective"]): CSSProperties {
  if (perspective === "left") return { transform: "perspective(900px) rotateY(-16deg) rotateZ(-2deg)" };
  if (perspective === "right") return { transform: "perspective(900px) rotateY(16deg) rotateZ(2deg)" };
  return {};
}

export function DeviceShell({
  definition,
  screen,
  editing = false,
  onScreenClick,
  onScreenDoubleClick,
  onScreenFile,
  onScreenPointerDown,
}: DeviceShellProps): React.JSX.Element {
  const shellClass = frameClasses(definition.finish);
  const screenProps = {
    screen,
    editing,
    onClick: onScreenClick,
    onDoubleClick: onScreenDoubleClick,
    onFile: onScreenFile,
    onPointerDown: onScreenPointerDown,
  };

  if (definition.asset) {
    const { asset } = definition;
    const screenBleed = definition.family === "watch"
      ? { x: 0.008, y: 0.005 }
      : definition.family === "phone" && definition.perspective === "front"
        ? { x: 0.004, y: 0.003 }
        : { x: 0, y: 0 };
    const screenMask = {
      WebkitMaskImage: `url(${asset.maskSrc})`,
      maskImage: `url(${asset.maskSrc})`,
      WebkitMaskPosition: "center",
      maskPosition: "center",
      WebkitMaskRepeat: "no-repeat",
      maskRepeat: "no-repeat",
      WebkitMaskSize: "100% 100%",
      maskSize: "100% 100%",
    };
    return (
      <div className="relative h-full w-full">
        <Screen
          {...screenProps}
          emptyStatePosition={asset.emptyStatePosition}
          emptyStateWidth={asset.emptyStateWidth}
          emptyStateTransform={asset.emptyStateTransform}
          style={{
            left: `${(asset.screen.x - screenBleed.x) * 100}%`,
            top: `${(asset.screen.y - screenBleed.y) * 100}%`,
            width: `${(asset.screen.width + screenBleed.x * 2) * 100}%`,
            height: `${(asset.screen.height + screenBleed.y * 2) * 100}%`,
            ...screenMask,
          }}
        />
        <img
          src={asset.src}
          alt=""
          aria-hidden="true"
          draggable={false}
          className="pointer-events-none absolute inset-0 block h-full w-full select-none"
        />
      </div>
    );
  }

  if (definition.family === "phone") {
    return (
      <div className="relative h-full w-full" style={perspectiveStyle(definition.perspective)}>
        <div className={cn("absolute inset-0 rounded-[15%] border shadow-xl", shellClass)}>
          <Screen {...screenProps} className="inset-[3.8%] rounded-[12%]" />
          <div className="pointer-events-none absolute left-1/2 top-[5.5%] h-[2.5%] w-[29%] -translate-x-1/2 rounded-full bg-foreground/90" />
          <div className="pointer-events-none absolute -left-[1.5%] top-[24%] h-[13%] w-[2.2%] rounded-l-full bg-foreground/60" />
          <div className="pointer-events-none absolute -right-[1.5%] top-[29%] h-[19%] w-[2.2%] rounded-r-full bg-foreground/60" />
        </div>
      </div>
    );
  }

  if (definition.family === "watch") {
    return (
      <div className="relative h-full w-full" style={perspectiveStyle(definition.perspective)}>
        <div className="absolute left-[31%] top-0 h-full w-[38%] rounded-[22%] bg-foreground/30 shadow-lg" />
        <div className={cn("absolute left-[4%] top-[20%] h-[60%] w-[92%] rounded-[24%] border shadow-xl", shellClass)}>
          <Screen {...screenProps} className="inset-[7%] rounded-[20%]" />
          <div className="pointer-events-none absolute -right-[6%] top-[30%] h-[19%] w-[7%] rounded-r-full bg-foreground/70" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full" style={perspectiveStyle(definition.perspective)}>
      <div className={cn("absolute left-[6%] top-[2%] h-[72%] w-[88%] rounded-[3%] border shadow-xl", shellClass)}>
        <Screen {...screenProps} className="inset-[3%] rounded-[1.5%]" />
        <div className="pointer-events-none absolute left-1/2 top-[1.2%] size-[1.2%] -translate-x-1/2 rounded-full bg-background/30" />
      </div>
      <div className={cn("absolute bottom-[17%] left-0 h-[8%] w-full rounded-b-[35%] border shadow-lg", shellClass)}>
        <div className="absolute left-1/2 top-0 h-[35%] w-[14%] -translate-x-1/2 rounded-b-full bg-foreground/10" />
      </div>
    </div>
  );
}
