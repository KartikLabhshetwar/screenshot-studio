'use client';

export interface FrameConfig {
  enabled: boolean;
  type: 'none' | 'arc-light' | 'arc-dark' | 'macos-light' | 'macos-dark' | 'windows-light' | 'windows-dark' | 'photograph';
  width: number;
  color: string;
  padding?: number;
  title?: string;
}

/**
 * Returns CSS styles for frames to be applied directly to the image element.
 * This ensures the border wraps the image properly with overflow:hidden.
 */
export function getFrameImageStyle(
  frame: FrameConfig,
  screenshotRadius: number
): React.CSSProperties | null {
  const borderWidth = frame.width || 6;

  switch (frame.type) {
    case 'arc-light':
      return {
        border: `${borderWidth}px solid rgba(255, 255, 255, 0.5)`,
        borderRadius: `${screenshotRadius}px`,
        overflow: 'hidden',
        boxSizing: 'border-box',
      };

    case 'arc-dark':
      return {
        border: `${borderWidth}px solid rgba(0, 0, 0, 0.7)`,
        borderRadius: `${screenshotRadius}px`,
        overflow: 'hidden',
        boxSizing: 'border-box',
      };

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
  screenshotRadius,
}: Frame3DOverlayProps) {
  if (!showFrame || frame.type === 'none') {
    return null;
  }

  const isDark = frame.type.includes('dark');

  // Get border width from frame config, default to 6px for arc frames
  const borderWidth = frame.width || 6;

  // For arc frames, the border should wrap tightly around the image
  // The outer radius = inner radius + border width
  const arcOuterRadius = screenshotRadius + borderWidth;

  switch (frame.type) {
    case 'arc-light':
    case 'arc-dark':
    case 'photograph':
      // These frames return null here - the border is applied directly to the image
      // via the getFrameImageStyle() helper used in Perspective3DOverlay
      return null;

    case 'macos-light':
    case 'macos-dark':
      // macOS title bar: 22px height (matches windowHeader in canvas-dimensions)
      return (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '22px',
            background: isDark ? 'rgb(40, 40, 43)' : '#e8e8e8',
            borderRadius: '8px 8px 0 0',
            display: 'flex',
            alignItems: 'center',
            padding: '0 12px',
          }}
        >
          {/* Traffic lights */}
          <div
            style={{
              display: 'flex',
              gap: '5px',
              zIndex: 2,
            }}
          >
            <span
              style={{
                height: '6px',
                width: '6px',
                borderRadius: '50%',
                backgroundColor: 'rgb(255, 95, 87)',
              }}
            />
            <span
              style={{
                height: '6px',
                width: '6px',
                borderRadius: '50%',
                backgroundColor: 'rgb(254, 188, 46)',
              }}
            />
            <span
              style={{
                height: '6px',
                width: '6px',
                borderRadius: '50%',
                backgroundColor: 'rgb(40, 201, 65)',
              }}
            />
          </div>
          {/* Title - centered */}
          <div
            style={{
              position: 'absolute',
              width: '100%',
              left: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              pointerEvents: 'none',
              zIndex: 1,
            }}
          >
            <span
              style={{
                color: isDark ? 'rgb(159, 159, 159)' : '#4d4d4d',
                fontSize: '10px',
                fontWeight: 500,
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
                letterSpacing: '-0.2px',
              }}
            >
              {frame.title || 'file'}
            </span>
          </div>
        </div>
      );

    case 'windows-light':
    case 'windows-dark':
      return (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '28px',
            backgroundColor: isDark ? '#2d2d2d' : '#f3f3f3',
            borderRadius: '8px 8px 0 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 8px 0 16px',
          }}
        >
          <div style={{ color: isDark ? '#ffffff' : '#1a1a1a', fontSize: '13px' }}>
            {frame.title || ''}
          </div>
          <div style={{ display: 'flex', gap: '0' }}>
            <div style={{ width: '46px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '12px', height: '1px', backgroundColor: isDark ? '#ffffff' : '#1a1a1a' }} />
            </div>
            <div style={{ width: '46px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '12px', height: '12px', border: `1px solid ${isDark ? '#ffffff' : '#1a1a1a'}`, boxSizing: 'border-box' }} />
            </div>
            <div style={{ width: '46px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ position: 'relative', width: '12px', height: '12px' }}>
                <div style={{ position: 'absolute', width: '16px', height: '1px', backgroundColor: isDark ? '#ffffff' : '#1a1a1a', transform: 'rotate(45deg)', top: '5px', left: '-2px' }} />
                <div style={{ position: 'absolute', width: '16px', height: '1px', backgroundColor: isDark ? '#ffffff' : '#1a1a1a', transform: 'rotate(-45deg)', top: '5px', left: '-2px' }} />
              </div>
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
}
