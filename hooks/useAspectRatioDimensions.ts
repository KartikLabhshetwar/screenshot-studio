import { useMemo, useState, useEffect } from 'react';
import { useImageStore } from '@/lib/store';
import { getAspectRatioPreset, calculateFitDimensions, getAspectRatioCSS } from '@/lib/aspect-ratio-utils';
import { MOBILE_BREAKPOINT } from '@/hooks/use-mobile';

export function useAspectRatioDimensions(options?: {
  maxWidth?: number;
  maxHeight?: number;
}) {
  const { selectedAspectRatio } = useImageStore();
  
  const dimensions = useMemo(() => {
    const preset = getAspectRatioPreset(selectedAspectRatio);
    if (!preset) {
      return { width: 1920, height: 1080, aspectRatio: '16/9' };
    }
    
    const { maxWidth, maxHeight } = options || {};
    
    if (maxWidth || maxHeight) {
      const fitDimensions = calculateFitDimensions(
        preset.width,
        preset.height,
        maxWidth,
        maxHeight
      );
      return {
        ...fitDimensions,
        aspectRatio: getAspectRatioCSS(preset.width, preset.height),
        originalWidth: preset.width,
        originalHeight: preset.height,
      };
    }
    
    return {
      width: preset.width,
      height: preset.height,
      aspectRatio: getAspectRatioCSS(preset.width, preset.height),
      originalWidth: preset.width,
      originalHeight: preset.height,
    };
  }, [selectedAspectRatio, options]);
  
  return dimensions;
}

export function useResponsiveCanvasDimensions() {
  const selectedAspectRatio = useImageStore((s) => s.selectedAspectRatio);
  const showTimeline = useImageStore((s) => s.showTimeline);
  const hasContent = useImageStore(
    (s) => !!s.uploadedImageUrl || s.slides.length > 0
  );
  const [viewportSize, setViewportSize] = useState({ width: 1920, height: 1080 });
  
  useEffect(() => {
    const updateViewportSize = () => {
      setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    
    updateViewportSize();

    window.addEventListener('resize', updateViewportSize);
    return () => window.removeEventListener('resize', updateViewportSize);
  }, []);
  
  const dimensions = useMemo(() => {
    const preset = getAspectRatioPreset(selectedAspectRatio);
    if (!preset) {
      return { width: 1920, height: 1080, aspectRatio: '16/9' };
    }
    
    // On mobile the side panels are hidden inside sheets, so we should not
    // subtract their desktop width (otherwise calculations go negative and
    // the canvas collapses). This keeps the preview and export canvases in sync.
    // Must match useIsMobile / EditorLayout (1024), not Tailwind md (768).
    const isMobileViewport = viewportSize.width < MOBILE_BREAKPOINT;
    // Panels are w-[260px] each (LeftEditPanel / RightSettingsPanel)
    const sidePanelsWidth = isMobileViewport ? 0 : 520;
    // Match stage chrome: p-3 (24) / md:p-6 (48). Keep a tiny gutter so the shell
    // never clips against the panels.
    const horizontalPadding = isMobileViewport ? 32 : 56;
    // header (h-16 = 64) + stage vertical pad
    let verticalPadding = isMobileViewport ? 120 : 112;
    // Desktop Animate chip docks under the stage (h-9 + bottom-4 + gap).
    // Portrait ratios are height-bound, so without this the chip overlaps.
    const reserveAnimateChip =
      !isMobileViewport && hasContent && !showTimeline;
    if (reserveAnimateChip) {
      verticalPadding += 56;
    }

    const rawAvailableWidth = viewportSize.width - sidePanelsWidth - horizontalPadding;
    const rawAvailableHeight = viewportSize.height - verticalPadding;

    // Fit exactly to the stage viewport — no overscale then CSS max-width clamp
    // (that combo was shrinking the empty upload frame).
    const MIN_AVAILABLE = 320;
    const maxWidth = Math.max(rawAvailableWidth, MIN_AVAILABLE);
    const maxHeight = Math.max(rawAvailableHeight, MIN_AVAILABLE);
    
    const fitDimensions = calculateFitDimensions(
      preset.width,
      preset.height,
      maxWidth,
      maxHeight
    );
    
    return {
      ...fitDimensions,
      aspectRatio: getAspectRatioCSS(preset.width, preset.height),
      originalWidth: preset.width,
      originalHeight: preset.height,
    };
  }, [
    selectedAspectRatio,
    viewportSize.width,
    viewportSize.height,
    hasContent,
    showTimeline,
  ]);
  
  return dimensions;
}
