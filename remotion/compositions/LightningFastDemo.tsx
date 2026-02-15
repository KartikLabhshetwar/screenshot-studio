import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';

// Compact animation for "Lightning Fast" value prop
export const LightningFastDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Timer countdown: 3 -> 2 -> 1 -> done
  const timerValue = Math.max(0, 3 - Math.floor(frame / 40));
  const showDone = frame >= 120;

  // Before card
  const beforeOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });

  // Arrow pulse
  const arrowScale = interpolate(frame, [0, 30, 60, 90, 120], [0.8, 1.1, 0.9, 1.1, 1], { extrapolateRight: 'clamp' });

  // After card transformation
  const afterGradient = interpolate(frame, [40, 120], [0, 1], { extrapolateRight: 'clamp' });
  const afterGlow = interpolate(frame, [100, 140], [0, 1], { extrapolateRight: 'clamp' });
  const afterScale = spring({ frame: frame - 40, fps, config: { damping: 15, stiffness: 100 } });

  // Screenshot inside transforms
  const screenshotRound = interpolate(frame, [60, 100], [2, 8], { extrapolateRight: 'clamp' });
  const screenshotShadow = interpolate(frame, [80, 120], [0, 15], { extrapolateRight: 'clamp' });

  // Loop fade
  const fadeOut = interpolate(frame, [160, 180], [1, 0], { extrapolateRight: 'clamp' });

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#1a1a1a',
        borderRadius: 12,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        opacity: fadeOut,
        position: 'relative',
      }}
    >
      {/* Timer badge */}
      <div
        style={{
          position: 'absolute',
          top: 8,
          right: 8,
          padding: '4px 10px',
          borderRadius: 20,
          backgroundColor: '#c9ff2e',
          color: '#000',
          fontSize: 11,
          fontWeight: 700,
        }}
      >
        {showDone ? '✓' : `${timerValue} sec`}
      </div>

      {/* Before/After container */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%' }}>
        {/* Before */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            opacity: beforeOpacity,
          }}
        >
          <div
            style={{
              width: '100%',
              aspectRatio: '4/3',
              backgroundColor: 'rgba(255,255,255,0.05)',
              borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: '60%',
                aspectRatio: '16/10',
                backgroundColor: '#2a2a2a',
                borderRadius: 2,
              }}
            />
          </div>
          <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>Before</span>
        </div>

        {/* Arrow */}
        <div
          style={{
            color: '#c9ff2e',
            fontSize: 16,
            transform: `scale(${arrowScale})`,
          }}
        >
          →
        </div>

        {/* After */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              width: '100%',
              aspectRatio: '4/3',
              background: `linear-gradient(135deg, rgba(201,255,46,${0.1 + afterGradient * 0.15}) 0%, rgba(168,85,247,${0.1 + afterGradient * 0.15}) 100%)`,
              borderRadius: 8,
              border: `1px solid rgba(201,255,46,${0.2 + afterGradient * 0.3})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 0 ${afterGlow * 20}px rgba(201,255,46,${afterGlow * 0.2})`,
              transform: `scale(${Math.min(afterScale, 1)})`,
            }}
          >
            <div
              style={{
                width: '60%',
                aspectRatio: '16/10',
                backgroundColor: 'rgba(255,255,255,0.9)',
                borderRadius: screenshotRound,
                boxShadow: `0 ${screenshotShadow}px ${screenshotShadow * 1.5}px rgba(0,0,0,0.3)`,
              }}
            />
          </div>
          <span style={{ fontSize: 9, color: '#c9ff2e', marginTop: 4 }}>After</span>
        </div>
      </div>
    </div>
  );
};
