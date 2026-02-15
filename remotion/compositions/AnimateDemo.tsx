import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';

// Compact animation for "Animate Everything" value prop
export const AnimateDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animation presets to demo
  const presets = ['Zoom In', 'Pan Left', 'Ken Burns', 'Tilt 3D', 'Fade'];

  // Cycle through presets
  const activePreset = Math.floor(interpolate(frame, [30, 150], [0, 4.99], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }));

  // Preview animation based on active preset
  const getPreviewTransform = () => {
    const localFrame = frame % 36;
    switch (activePreset) {
      case 0: // Zoom In
        return {
          scale: interpolate(localFrame, [0, 36], [0.85, 1.1], { extrapolateRight: 'clamp' }),
          x: 0,
          y: 0,
        };
      case 1: // Pan Left
        return {
          scale: 1,
          x: interpolate(localFrame, [0, 36], [10, -10], { extrapolateRight: 'clamp' }),
          y: 0,
        };
      case 2: // Ken Burns
        return {
          scale: interpolate(localFrame, [0, 36], [1, 1.15], { extrapolateRight: 'clamp' }),
          x: interpolate(localFrame, [0, 36], [0, -8], { extrapolateRight: 'clamp' }),
          y: interpolate(localFrame, [0, 36], [0, -5], { extrapolateRight: 'clamp' }),
        };
      case 3: // Tilt 3D
        return {
          scale: 1,
          x: 0,
          y: 0,
          rotateY: interpolate(localFrame, [0, 36], [0, 15], { extrapolateRight: 'clamp' }),
        };
      case 4: // Fade
        return {
          scale: 1,
          x: 0,
          y: 0,
          opacity: interpolate(localFrame, [0, 18, 36], [0.4, 1, 0.4], { extrapolateRight: 'clamp' }),
        };
      default:
        return { scale: 1, x: 0, y: 0 };
    }
  };

  const preview = getPreviewTransform();

  // Timeline playhead animation
  const playheadX = interpolate(frame, [0, 180], [0, 100], { extrapolateRight: 'clamp' });

  // Entrance
  const entrance = spring({ frame, fps, config: { damping: 15, stiffness: 100 } });

  // Loop fade
  const fadeOut = interpolate(frame, [170, 180], [1, 0], { extrapolateRight: 'clamp' });

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#1a1a1a',
        borderRadius: 12,
        padding: 12,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        opacity: fadeOut,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        perspective: 600,
      }}
    >
      {/* Preview area */}
      <div
        style={{
          flex: 1,
          backgroundColor: '#0f0f0f',
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: '50%',
            aspectRatio: '16/10',
            background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
            borderRadius: 8,
            transform: `scale(${preview.scale || 1}) translate(${preview.x || 0}px, ${preview.y || 0}px) rotateY(${preview.rotateY || 0}deg)`,
            opacity: preview.opacity || 1,
            boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: '70%',
              aspectRatio: '16/10',
              backgroundColor: '#1a1a1a',
              borderRadius: 6,
            }}
          />
        </div>
      </div>

      {/* Mini timeline */}
      <div
        style={{
          height: 36,
          backgroundColor: '#252525',
          borderRadius: 8,
          padding: '6px 10px',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}
      >
        {/* Preset pills */}
        <div style={{ display: 'flex', gap: 6 }}>
          {presets.map((preset, i) => {
            const delay = 10 + i * 8;
            const scale = Math.min(spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 120 } }), 1);
            const isActive = i === activePreset;

            return (
              <div
                key={i}
                style={{
                  padding: '2px 8px',
                  borderRadius: 4,
                  fontSize: 8,
                  fontWeight: 500,
                  backgroundColor: isActive ? 'rgba(201,255,46,0.2)' : 'rgba(255,255,255,0.05)',
                  color: isActive ? '#c9ff2e' : 'rgba(255,255,255,0.5)',
                  border: isActive ? '1px solid rgba(201,255,46,0.3)' : '1px solid transparent',
                  transform: `scale(${scale})`,
                  whiteSpace: 'nowrap',
                }}
              >
                {preset}
              </div>
            );
          })}
        </div>

        {/* Timeline track */}
        <div style={{ height: 4, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 2, position: 'relative' }}>
          {/* Playhead */}
          <div
            style={{
              position: 'absolute',
              left: `${playheadX}%`,
              top: -2,
              width: 2,
              height: 8,
              backgroundColor: '#c9ff2e',
              borderRadius: 1,
            }}
          />
          {/* Progress */}
          <div
            style={{
              width: `${playheadX}%`,
              height: '100%',
              backgroundColor: 'rgba(201,255,46,0.3)',
              borderRadius: 2,
            }}
          />
        </div>
      </div>

      {/* Preset count */}
      <div
        style={{
          position: 'absolute',
          top: 8,
          right: 8,
          padding: '4px 10px',
          borderRadius: 20,
          backgroundColor: 'rgba(255,255,255,0.1)',
          border: '1px solid rgba(255,255,255,0.15)',
          fontSize: 10,
          color: 'rgba(255,255,255,0.8)',
        }}
      >
        20+ effects
      </div>
    </div>
  );
};
