import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';

// Compact animation for "Beautiful by Default" value prop
export const BeautifulPresetsDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const gradients = [
    'linear-gradient(135deg, #f97316 0%, #ec4899 100%)',
    'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
    'linear-gradient(135deg, #22c55e 0%, #14b8a6 100%)',
    'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
    'linear-gradient(135deg, #fbbf24 0%, #f97316 100%)',
    'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
  ];

  // Selected gradient cycles through
  const selectedIndex = Math.floor(interpolate(frame, [60, 150], [0, 5.99], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }));

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
      }}
    >
      {/* Gradient grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 8,
          height: '100%',
        }}
      >
        {gradients.map((gradient, i) => {
          const delay = 10 + i * 8;
          const scale = spring({ frame: frame - delay, fps, config: { damping: 15, stiffness: 120 } });
          const isSelected = i === selectedIndex;

          return (
            <div
              key={i}
              style={{
                background: gradient,
                borderRadius: 10,
                transform: `scale(${Math.min(scale, 1)})`,
                border: isSelected ? '2px solid #c9ff2e' : '2px solid transparent',
                boxShadow: isSelected ? '0 0 0 3px rgba(201,255,46,0.25)' : 'none',
                transition: 'border 0.15s ease, box-shadow 0.15s ease',
              }}
            />
          );
        })}
      </div>

      {/* Badge */}
      <div
        style={{
          position: 'absolute',
          bottom: 8,
          right: 8,
          padding: '4px 10px',
          borderRadius: 20,
          backgroundColor: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.15)',
          fontSize: 10,
          color: 'rgba(255,255,255,0.8)',
          transform: `scale(${Math.min(spring({ frame: frame - 50, fps, config: { damping: 12, stiffness: 100 } }), 1)})`,
        }}
      >
        50+ presets
      </div>
    </div>
  );
};
