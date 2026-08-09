'use client';

import { SafariToolbar, ChromeToolbar } from './BrowserToolbar';

export interface FrameConfig {
  enabled: boolean;
  type: 'none' | 'arc-light' | 'arc-dark' | 'macos-light' | 'macos-dark' | 'windows-light' | 'windows-dark' | 'photograph' | 'glass-light' | 'glass-dark' | 'outline-light' | 'border-light' | 'border-dark';
  width: number;
  color: string;
  padding?: number;
  title?: string;
  opacity?: number;
}

/**
 * Returns CSS styles for frames to be applied directly to the image element.
 * This ensures the border wraps the image properly with overflow:hidden.
 */
export function getFrameImageStyle(
  frame: FrameConfig,
  screenshotRadius: number
): React.CSSProperties | null {
  const arcBorderWidth = frame.width || 8;

  switch (frame.type) {
    case 'arc-light': {
      const lightOpacity = frame.opacity ?? 0.5;
      return {
        border: `${arcBorderWidth}px solid rgba(255, 255, 255, ${lightOpacity})`,
        borderRadius: `${screenshotRadius}px`,
        overflow: 'hidden',
        boxSizing: 'border-box',
      };
    }

    case 'arc-dark': {
      const darkOpacity = frame.opacity ?? 0.7;
      return {
        border: `${arcBorderWidth}px solid rgba(0, 0, 0, ${darkOpacity})`,
        borderRadius: `${screenshotRadius}px`,
        overflow: 'hidden',
        boxSizing: 'border-box',
      };
    }

    case 'photograph':
      // Polaroid style: 8px top/sides, 24px bottom
      return {
        borderWidth: '8px 8px 24px 8px',
        borderStyle: 'solid',
        borderColor: 'white',
        borderRadius: '8px',
        overflow: 'hidden',
        boxSizing: 'border-box',
      };

    default:
      return null;
  }
}

interface Frame3DOverlayProps {
  frame: FrameConfig;
  showFrame: boolean;
  framedW: number;
  framedH: number;
  frameOffset: number;
  windowPadding: number;
  windowHeader: number;
  eclipseBorder: number;
  imageScaledW: number;
  imageScaledH: number;
  screenshotRadius: number;
}

export function Frame3DOverlay({
  frame,
  showFrame,
  windowHeader,
  screenshotRadius,
}: Frame3DOverlayProps) {
  if (!showFrame || frame.type === 'none') {
    return null;
  }

  const isDark = frame.type.includes('dark');

  switch (frame.type) {
    case 'arc-light':
    case 'arc-dark':
    case 'photograph':
      // These frames return null here - the border is applied directly to the image
      // via the getFrameImageStyle() helper used in Perspective3DOverlay
      return null;

    case 'macos-light':
    case 'macos-dark':
      return <SafariToolbar windowHeader={windowHeader} isDark={isDark} title={frame.title} screenshotRadius={screenshotRadius} />;

    case 'windows-light':
    case 'windows-dark':
      return <ChromeToolbar windowHeader={windowHeader} isDark={isDark} title={frame.title} screenshotRadius={screenshotRadius} />;

    default:
      return null;
  }
}
