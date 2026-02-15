import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';

// Compact animation for "Share Everywhere" value prop
export const ShareExportDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const formats = [
    { label: 'PNG', size: '5x' },
    { label: 'JPG', size: '4x' },
    { label: 'WebP', size: '3x' },
  ];

  const platforms = ['𝕏', 'in', '💬', '▶'];

  // Selected format cycles
  const selectedFormat = Math.floor(interpolate(frame, [40, 120], [0, 2.99], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }));

  // HD indicator pulse
  const hdPulse = interpolate(frame, [0, 30, 60, 90, 120, 150], [0.6, 1, 0.6, 1, 0.6, 1], { extrapolateRight: 'clamp' });

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
      }}
    >
      {/* Format badges */}
      <div style={{ display: 'flex', gap: 8 }}>
        {formats.map((format, i) => {
          const delay = 10 + i * 12;
          const scale = spring({ frame: frame - delay, fps, config: { damping: 15, stiffness: 120 } });
          const isSelected = i === selectedFormat;

          return (
            <div
              key={i}
              style={{
                padding: '6px 12px',
                borderRadius: 8,
                backgroundColor: isSelected ? 'rgba(201,255,46,0.15)' : '#252525',
                border: isSelected ? '1px solid rgba(201,255,46,0.4)' : '1px solid rgba(255,255,255,0.1)',
                fontSize: 11,
                fontFamily: 'monospace',
                transform: `scale(${Math.min(scale, 1)})`,
                display: 'flex',
                gap: 4,
                transition: 'background-color 0.15s ease, border 0.15s ease',
              }}
            >
              <span style={{ color: isSelected ? '#fff' : 'rgba(255,255,255,0.7)' }}>{format.label}</span>
              <span style={{ color: '#c9ff2e' }}>{format.size}</span>
            </div>
          );
        })}
      </div>

      {/* Platform icons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>Share to:</span>
        {platforms.map((platform, i) => {
          const delay = 50 + i * 10;
          const scale = spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 150 } });

          return (
            <div
              key={i}
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                backgroundColor: '#252525',
                border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 11,
                color: 'rgba(255,255,255,0.7)',
                transform: `scale(${Math.min(scale, 1)})`,
              }}
            >
              {platform}
            </div>
          );
        })}
      </div>

      {/* HD indicator */}
      <div
        style={{
          position: 'absolute',
          bottom: 8,
          right: 8,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            backgroundColor: '#c9ff2e',
            opacity: hdPulse,
          }}
        />
        <span style={{ fontSize: 10, color: '#c9ff2e' }}>Up to 5x HD</span>
      </div>
    </div>
  );
};
