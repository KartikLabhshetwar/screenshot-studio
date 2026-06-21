'use client';

import * as React from 'react';
import {
  RotateSquareIcon,
  VideoReplayIcon,
  Delete02Icon,
  Add01Icon,
} from 'hugeicons-react';
import {
  TransformsGallery,
  SectionWrapper,
} from './sections';
import { cn } from '@/lib/utils';
import { useImageStore, useEditorStore } from '@/lib/store';
import { ANIMATION_PRESETS, CATEGORY_LABELS } from '@/lib/animation/presets';
import type { AnimationPreset } from '@/types/animation';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { getBackgroundCSS } from '@/lib/constants/backgrounds';
import { useDrag } from '@use-gesture/react';
import { aspectRatios } from '@/lib/constants/aspect-ratios';

function useCanvasAspectRatio(): string {
  const { selectedAspectRatio } = useImageStore();
  const ar = aspectRatios.find((a) => a.id === selectedAspectRatio);
  if (!ar) return '4 / 3';
  return `${ar.width} / ${ar.height}`;
}

type RightTabType = 'transforms' | 'animate';

const rightTabs: { id: RightTabType; icon: React.ReactNode; label: string }[] = [
  { id: 'transforms', icon: <RotateSquareIcon size={18} />, label: '3D' },
  { id: 'animate', icon: <VideoReplayIcon size={18} />, label: 'Motion' },
];

type ControlMode = 'zoom' | 'tilt';

// Snap grid: 3x3 positions mapped to translateX/Y ranges
const SNAP_POINTS = [
  { x: -15, y: -15 }, { x: 0, y: -15 }, { x: 15, y: -15 },
  { x: -15, y: 0 },   { x: 0, y: 0 },   { x: 15, y: 0 },
  { x: -15, y: 15 },  { x: 0, y: 15 },  { x: 15, y: 15 },
];
const SNAP_THRESHOLD = 2.5; // snap when within this distance

function snapToGrid(x: number, y: number): { x: number; y: number } {
  for (const point of SNAP_POINTS) {
    if (Math.abs(x - point.x) < SNAP_THRESHOLD && Math.abs(y - point.y) < SNAP_THRESHOLD) {
      return { x: point.x, y: point.y };
    }
  }
  return { x, y };
}

function TransformPreview({ mode }: { mode: ControlMode }) {
  const {
    uploadedImageUrl,
    perspective3D,
    setPerspective3D,
    backgroundConfig,
    backgroundBorderRadius,
    borderRadius,
    imageShadow,
    imageScale,
    canvasDimensions,
  } = useImageStore();
  const { screenshot, setScreenshot } = useEditorStore();
  const cssAspectRatio = useCanvasAspectRatio();

  const containerRef = React.useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = React.useState(false);

  const previewImageUrl = uploadedImageUrl || screenshot?.src || null;

  // Max offset the image can travel from center (in canvas pixels)
  const maxOffsetX = canvasDimensions ? Math.max(1, canvasDimensions.canvasW / 2) : 1;
  const maxOffsetY = canvasDimensions ? Math.max(1, canvasDimensions.canvasH / 2) : 1;

  // Store initial values at drag start
  const startRef = React.useRef({ oX: 0, oY: 0, rX: 0, rY: 0 });

  // Snap threshold in canvas pixels — percentage of max offset
  const snapThresholdX = maxOffsetX * 0.08;
  const snapThresholdY = maxOffsetY * 0.08;

  const snapOffset = React.useCallback((rawX: number, rawY: number) => {
    // Check each grid point (mapped to canvas pixel offsets)
    for (const point of SNAP_POINTS) {
      const pointOffsetX = (point.x / 15) * maxOffsetX;
      const pointOffsetY = (point.y / 15) * maxOffsetY;
      if (
        Math.abs(rawX - pointOffsetX) < snapThresholdX &&
        Math.abs(rawY - pointOffsetY) < snapThresholdY
      ) {
        return { x: Math.round(pointOffsetX), y: Math.round(pointOffsetY) };
      }
    }
    return { x: Math.round(rawX), y: Math.round(rawY) };
  }, [maxOffsetX, maxOffsetY, snapThresholdX, snapThresholdY]);

  const bind = useDrag(
    ({ first, active, movement: [mx, my] }) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();

      if (first) {
        startRef.current = {
          oX: screenshot.offsetX,
          oY: screenshot.offsetY,
          rX: perspective3D.rotateX,
          rY: perspective3D.rotateY,
        };
      }

      setDragging(active);

      const dxNorm = mx / rect.width;
      const dyNorm = my / rect.height;

      if (mode === 'zoom') {
        // Map preview drag to 2D canvas offset with snap-to-grid
        const rawX = startRef.current.oX + dxNorm * maxOffsetX * 2;
        const rawY = startRef.current.oY + dyNorm * maxOffsetY * 2;
        const snapped = snapOffset(rawX, rawY);
        setScreenshot({ offsetX: snapped.x, offsetY: snapped.y });
      } else {
        setPerspective3D({
          rotateY: Math.max(-45, Math.min(45, startRef.current.rY + dxNorm * 90)),
          rotateX: Math.max(-45, Math.min(45, startRef.current.rX - dyNorm * 90)),
        });
      }
    },
    { pointer: { touch: true }, filterTaps: true }
  );

  const backgroundStyle = getBackgroundCSS(backgroundConfig);

  // Convert pixel offset to percentage for the preview image transform
  const offsetXPct = canvasDimensions && canvasDimensions.canvasW > 0
    ? (screenshot.offsetX / canvasDimensions.canvasW) * 100
    : 0;
  const offsetYPct = canvasDimensions && canvasDimensions.canvasH > 0
    ? (screenshot.offsetY / canvasDimensions.canvasH) * 100
    : 0;

  const transformStyle: React.CSSProperties = {
    transform: `translate(${perspective3D.translateX + offsetXPct}%, ${perspective3D.translateY + offsetYPct}%) rotateX(${perspective3D.rotateX}deg) rotateY(${perspective3D.rotateY}deg) rotateZ(${perspective3D.rotateZ}deg) scale(${perspective3D.scale * (imageScale / 100)})`,
    transition: dragging ? 'none' : 'transform 150ms ease-out',
    transformOrigin: 'center center',
  };

  // Handle position: zoom mode shows 2D offset, tilt mode shows rotation
  const handleX =
    mode === 'zoom'
      ? 50 + (screenshot.offsetX / maxOffsetX) * 50
      : 50 + (perspective3D.rotateY / 45) * 50;
  const handleY =
    mode === 'zoom'
      ? 50 + (screenshot.offsetY / maxOffsetY) * 50
      : 50 - (perspective3D.rotateX / 45) * 50;

  const previewBorderRadius = Math.round(backgroundBorderRadius * 0.15);
  const previewImageRadius = Math.round(Math.min(borderRadius, 20) * 0.3);

  // Check if currently snapped to a grid point
  const getSnappedPoint = () => {
    for (const point of SNAP_POINTS) {
      const pointOffsetX = (point.x / 15) * maxOffsetX;
      const pointOffsetY = (point.y / 15) * maxOffsetY;
      if (
        Math.abs(screenshot.offsetX - pointOffsetX) < snapThresholdX &&
        Math.abs(screenshot.offsetY - pointOffsetY) < snapThresholdY
      ) {
        return point;
      }
    }
    return null;
  };
  const snappedPoint = getSnappedPoint();

  return (
    <div
      ref={containerRef}
      {...bind()}
      className={cn(
        'relative w-full rounded-xl overflow-hidden border border-border/20 touch-none select-none',
        dragging ? 'cursor-grabbing' : 'cursor-grab'
      )}
      style={{ aspectRatio: cssAspectRatio }}
    >
      {/* Background - same as canvas */}
      <div
        className="absolute inset-0"
        style={{
          ...backgroundStyle,
          borderRadius: `${previewBorderRadius}px`,
        }}
      />

      {/* Snap grid overlay (zoom mode only) */}
      {mode === 'zoom' && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Center crosshair lines */}
          <div className="absolute left-1/2 top-[12%] bottom-[12%] w-px bg-foreground/15" />
          <div className="absolute top-1/2 left-[12%] right-[12%] h-px bg-foreground/15" />

          {/* Grid lines — horizontal thirds */}
          <div className="absolute left-[12%] right-[12%] top-[25%] h-px bg-foreground/8" />
          <div className="absolute left-[12%] right-[12%] bottom-[25%] h-px bg-foreground/8" />
          {/* Grid lines — vertical thirds */}
          <div className="absolute top-[12%] bottom-[12%] left-[25%] w-px bg-foreground/8" />
          <div className="absolute top-[12%] bottom-[12%] right-[25%] w-px bg-foreground/8" />

          {/* 3x3 snap dots */}
          {SNAP_POINTS.map((point, i) => {
            const left = 50 + (point.x / 15) * 50;
            const top = 50 + (point.y / 15) * 50;
            const isCenter = point.x === 0 && point.y === 0;
            const isSnapped = snappedPoint === point;
            return (
              <div
                key={i}
                className={cn(
                  'absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-150',
                  isSnapped
                    ? 'w-2.5 h-2.5 bg-primary ring-2 ring-primary/30'
                    : isCenter
                      ? 'w-2.5 h-2.5 bg-foreground/40 ring-1 ring-foreground/10'
                      : 'w-2 h-2 bg-foreground/30'
                )}
                style={{ left: `${left}%`, top: `${top}%` }}
              />
            );
          })}
        </div>
      )}

      {/* Transform preview - mirrors canvas rendering */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ perspective: `${perspective3D.perspective}px` }}
      >
        {previewImageUrl ? (
          <div className="w-[85%] h-[85%]" style={transformStyle}>
            <img
              src={previewImageUrl}
              alt="Preview"
              className="w-full h-full object-contain"
              draggable={false}
              style={{
                borderRadius: `${previewImageRadius}px`,
                filter: imageShadow.enabled
                  ? `drop-shadow(${imageShadow.offsetX * 0.15}px ${imageShadow.offsetY * 0.15}px ${(imageShadow.blur + imageShadow.spread) * 0.15}px ${imageShadow.color})`
                  : undefined,
              }}
            />
          </div>
        ) : (
          <div
            className="w-[85%] h-[85%] bg-muted-foreground/20 rounded-md border border-border/20"
            style={transformStyle}
          />
        )}
      </div>

      {/* Position indicator handle */}
      <div
        className={cn(
          'absolute w-7 h-7 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none',
          'bg-foreground/70 backdrop-blur-sm border-2 border-background/50',
          'transition-all duration-150',
          dragging && 'scale-110',
          snappedPoint && 'ring-2 ring-primary/50'
        )}
        style={{
          left: `${Math.max(8, Math.min(92, handleX))}%`,
          top: `${Math.max(8, Math.min(92, handleY))}%`,
        }}
      >
        <div className="absolute inset-1 rounded-full border border-background/30" />
      </div>

      {/* Inner border overlay */}
      <div className="absolute inset-0 rounded-xl border border-foreground/5 pointer-events-none" />
    </div>
  );
}

function PerspectiveSliders() {
  const { perspective3D, setPerspective3D } = useImageStore();

  return (
    <SectionWrapper title="Fine Tune" defaultOpen={false}>
      <div className="space-y-2">
        <Slider
          value={[perspective3D.perspective]}
          onValueChange={(value) => setPerspective3D({ perspective: value[0] })}
          min={500}
          max={3000}
          step={50}
          label="Depth"
          valueDisplay={`${perspective3D.perspective}px`}
        />
        <Slider
          value={[perspective3D.rotateX]}
          onValueChange={(value) => setPerspective3D({ rotateX: value[0] })}
          min={-60}
          max={60}
          step={1}
          label="Rotate X"
          valueDisplay={`${perspective3D.rotateX}°`}
        />
        <Slider
          value={[perspective3D.rotateY]}
          onValueChange={(value) => setPerspective3D({ rotateY: value[0] })}
          min={-60}
          max={60}
          step={1}
          label="Rotate Y"
          valueDisplay={`${perspective3D.rotateY}°`}
        />
        <Slider
          value={[perspective3D.rotateZ]}
          onValueChange={(value) => setPerspective3D({ rotateZ: value[0] })}
          min={-45}
          max={45}
          step={1}
          label="Rotate Z"
          valueDisplay={`${perspective3D.rotateZ}°`}
        />
        <Slider
          value={[perspective3D.scale]}
          onValueChange={(value) => setPerspective3D({ scale: value[0] })}
          min={0.5}
          max={1.5}
          step={0.01}
          label="Scale"
          valueDisplay={perspective3D.scale.toFixed(2)}
        />
      </div>
    </SectionWrapper>
  );
}

function ZoomSlider() {
  const imageScale = useImageStore((s) => s.imageScale);
  const setImageScale = useImageStore((s) => s.setImageScale);

  return (
    <Slider
      value={[imageScale / 100]}
      onValueChange={(value) => setImageScale(Math.round(value[0] * 100))}
      min={0.1}
      max={2}
      step={0.01}
      label="Zoom"
      valueDisplay={`${Math.round(imageScale)}%`}
    />
  );
}

function TransformControls() {
  const perspective3D = useImageStore((s) => s.perspective3D);
  const setPerspective3D = useImageStore((s) => s.setPerspective3D);
  const [controlMode, setControlMode] = React.useState<ControlMode>('zoom');

  return (
    <div className="space-y-3">
      {/* Zoom / Tilt toggle */}
      <SegmentedControl
        options={[
          { id: 'zoom', label: 'Zoom' },
          { id: 'tilt', label: 'Tilt' },
        ]}
        value={controlMode}
        onChange={(v) => setControlMode(v as ControlMode)}
        size="sm"
      />

      {/* Interactive preview */}
      <TransformPreview mode={controlMode} />

      {/* Primary slider based on mode */}
      {controlMode === 'zoom' ? (
        <ZoomSlider />
      ) : (
        <Slider
          value={[perspective3D.rotateZ]}
          onValueChange={(value) => setPerspective3D({ rotateZ: value[0] })}
          min={-45}
          max={45}
          step={1}
          label="Rotation"
          valueDisplay={`${perspective3D.rotateZ}°`}
        />
      )}
    </div>
  );
}

// ─── Animation Tab (same pattern as 3D) ────────────────────────────────────

const ANIM_PRESET_BY_CATEGORY = ANIMATION_PRESETS.reduce(
  (acc, preset) => {
    if (!acc[preset.category]) {
      acc[preset.category] = [];
    }
    acc[preset.category].push(preset);
    return acc;
  },
  {} as Record<string, AnimationPreset[]>
);

function AnimationControls() {
  const {
    uploadedImageUrl,
    backgroundConfig,
    borderRadius,
    imageShadow,
    animationClips,
    addAnimationClip,
    clearAnimationClips,
    setShowTimeline,
    setTimelineDuration,
    timeline,
  } = useImageStore();

  const { screenshot } = useEditorStore();
  const cssAspectRatio = useCanvasAspectRatio();
  const previewImageUrl = uploadedImageUrl || screenshot?.src || null;

  const [expandedCategories, setExpandedCategories] = React.useState<Set<string>>(
    new Set(Object.keys(ANIM_PRESET_BY_CATEGORY).slice(0, 1))
  );

  const toggleCategory = (name: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const handlePresetClick = (preset: AnimationPreset) => {
    const lastClipEnd = animationClips.reduce((max, clip) => {
      return Math.max(max, clip.startTime + clip.duration);
    }, 0);
    const newEndTime = lastClipEnd + preset.duration;
    if (newEndTime > timeline.duration) {
      setTimelineDuration(newEndTime);
    }
    addAnimationClip(preset.id, lastClipEnd);
    setShowTimeline(true);
  };

  const backgroundStyle = getBackgroundCSS(backgroundConfig);
  const hasAnimation = animationClips.length > 0;

  return (
    <div className="space-y-3">
      {/* Status bar */}
      {hasAnimation && (
        <div className="flex items-center justify-between px-2 py-1.5 rounded-lg bg-primary/10 border border-primary/20">
          <span className="text-xs font-medium text-primary">
            {animationClips.length} clip{animationClips.length > 1 ? 's' : ''}
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-[10px] text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={clearAnimationClips}
          >
            <Delete02Icon size={12} className="mr-1" />
            Clear
          </Button>
        </div>
      )}

      {/* Divider */}
      <div className="flex items-center gap-2 pt-1">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Animation Presets
        </span>
        <div className="flex-1 h-px bg-border/30" />
      </div>

      {/* Preset categories - same pattern as TransformsGallery */}
      {Object.entries(ANIM_PRESET_BY_CATEGORY).map(([category, presets]) => {
        const isExpanded = expandedCategories.has(category);
        const categoryLabel = CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS] || category;
        return (
          <div key={category}>
            <button
              onClick={() => toggleCategory(category)}
              className="w-full flex items-center gap-2 py-1.5 group"
            >
              <span
                className={cn(
                  'text-[10px] font-semibold uppercase tracking-widest transition-colors',
                  isExpanded ? 'text-muted-foreground' : 'text-muted-foreground/60'
                )}
              >
                {categoryLabel}
              </span>
              <div className="flex-1 h-px bg-border/30" />
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                className={cn(
                  'text-muted-foreground/50 transition-transform duration-200',
                  !isExpanded && '-rotate-90'
                )}
              >
                <path d="M3 2L7 5L3 8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {isExpanded && (
              <div className="space-y-2 pt-1 pb-2">
                {presets.map((preset) => {
                  const isApplied = animationClips.some((c) => c.presetId === preset.id);
                  return (
                    <button
                      key={preset.id}
                      onClick={() => handlePresetClick(preset)}
                      className={cn(
                        'relative w-full rounded-xl overflow-hidden transition-all duration-200 group/card',
                        'border-2',
                        isApplied
                          ? 'border-primary ring-1 ring-primary/20'
                          : 'border-border/30 hover:border-border/60'
                      )}
                      style={{ aspectRatio: cssAspectRatio }}
                    >
                      {/* Background - matches canvas */}
                      <div className="absolute inset-0" style={backgroundStyle} />

                      {/* Preview */}
                      <div className="absolute inset-0 flex items-center justify-center p-2">
                        {previewImageUrl ? (
                          <div className="w-[85%] h-[85%]">
                            <img
                              src={previewImageUrl}
                              alt={preset.name}
                              className="w-full h-full object-contain"
                              style={{
                                borderRadius: `${Math.min(borderRadius, 6)}px`,
                                boxShadow: imageShadow.enabled
                                  ? 'rgba(0, 0, 0, 0.35) 0px 2px 8px -1px, rgba(0, 0, 0, 0.25) 0px 6px 20px -3px'
                                  : undefined,
                              }}
                            />
                          </div>
                        ) : (
                          <div className="w-[85%] h-[85%] bg-muted-foreground/20 rounded-md border border-border/20" />
                        )}
                      </div>

                      {/* Hover add indicator */}
                      <div className="absolute inset-0 bg-foreground/40 opacity-0 group-hover/card:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="bg-foreground/20 backdrop-blur-sm rounded-full p-2">
                          <Add01Icon size={16} className="text-background" />
                        </div>
                      </div>

                      {/* Duration badge */}
                      <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 bg-foreground/60 backdrop-blur-sm rounded-md text-[9px] font-medium text-background/90">
                        {(preset.duration / 1000).toFixed(1)}s
                      </div>

                      {/* Name badge */}
                      <div
                        className={cn(
                          'absolute bottom-0 inset-x-0 flex justify-center pb-1.5 transition-opacity duration-150',
                          isApplied ? 'opacity-100' : 'opacity-0 group-hover/card:opacity-100'
                        )}
                      >
                        <span
                          className={cn(
                            'px-2 py-0.5 rounded-full text-[10px] font-medium backdrop-blur-md',
                            isApplied
                              ? 'bg-primary/90 text-primary-foreground'
                              : 'bg-foreground/60 text-background'
                          )}
                        >
                          {preset.name}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {/* Info */}
      {!previewImageUrl && (
        <div className="p-3 rounded-lg bg-muted/50 border border-border text-center">
          <p className="text-xs text-muted-foreground">
            Upload an image to see animation previews
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Main Panel ─────────────────────────────────────────────────────────────

export function RightSettingsPanel() {
  const { activeRightPanelTab } = useImageStore();
  const [activeTab, setActiveTab] = React.useState<RightTabType>('transforms');

  // Sync with store — when timeline or other components set the right panel tab to animate/transforms
  React.useEffect(() => {
    if (activeRightPanelTab === 'animate' || activeRightPanelTab === 'transforms') {
      setActiveTab(activeRightPanelTab);
    }
  }, [activeRightPanelTab]);

  const [contentKey, setContentKey] = React.useState<RightTabType>(activeTab);
  const [transitioning, setTransitioning] = React.useState(false);

  React.useEffect(() => {
    if (activeTab !== contentKey) {
      setTransitioning(true);
      const timeout = setTimeout(() => {
        setContentKey(activeTab);
        setTransitioning(false);
      }, 150);
      return () => clearTimeout(timeout);
    }
  }, [activeTab, contentKey]);

  return (
    <div className="w-[240px] h-full bg-card flex flex-col overflow-hidden border-l border-border/40 shrink-0">
      {/* Tab Navigation */}
      <div className="px-2.5 py-2.5 border-b border-border/30 shrink-0">
        <div className="flex gap-1 p-0.5 bg-muted/80 dark:bg-muted/50 rounded-lg border border-border/20">
          {rightTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center justify-center py-2 px-2 rounded-md',
                  'transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]',
                  isActive
                    ? 'bg-background dark:bg-accent text-foreground flex-[1.8] shadow-sm'
                    : 'text-muted-foreground hover:text-foreground flex-1'
                )}
              >
                <span className="shrink-0">{tab.icon}</span>
                <span
                  className={cn(
                    'text-[11px] font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]',
                    isActive
                      ? 'max-w-[60px] opacity-100 ml-1.5'
                      : 'max-w-0 opacity-0 ml-0'
                  )}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div
          className="p-3 transition-all duration-150 ease-out"
          style={{
            opacity: transitioning ? 0 : 1,
            transform: transitioning ? 'translateY(4px)' : 'translateY(0)',
          }}
        >
          {contentKey === 'transforms' && (
            <div className="space-y-3">
              <TransformControls />

              {/* Divider */}
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Layout Presets
                </span>
                <div className="flex-1 h-px bg-border/30" />
              </div>

              <TransformsGallery />
              <PerspectiveSliders />
            </div>
          )}

          {contentKey === 'animate' && <AnimationControls />}
        </div>
      </div>
    </div>
  );
}
