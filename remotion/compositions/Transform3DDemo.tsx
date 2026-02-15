import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';

// Compact animation for "3D Transforms" value prop
export const Transform3DDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 3D transform cycle through different perspectives
  const phase = Math.floor(interpolate(frame, [0, 180], [0, 4.99], { extrapolateRight: 'clamp' }));

  const transforms = [
    { rotateX: 0, rotateY: 0, perspective: 1000, label: 'Default' },
    { rotateX: 15, rotateY: -25, perspective: 800, label: 'Tilt Left' },
    { rotateX: 10, rotateY: 20, perspective: 900, label: 'Tilt Right' },
    { rotateX: 25, rotateY: 0, perspective: 700, label: 'Top Down' },
    { rotateX: -15, rotateY: -10, perspective: 1000, label: 'Hero' },
  ];

  const currentTransform = transforms[phase];

  // Smooth transitions
  const rotateX = interpolate(
    frame % 36,
    [0, 15, 36],
    [transforms[phase]?.rotateX || 0, transforms[phase]?.rotateX || 0, transforms[(phase + 1) % 5]?.rotateX || 0],
    { extrapolateRight: 'clamp' }
  );

  const rotateY = interpolate(
    frame % 36,
    [0, 15, 36],
    [transforms[phase]?.rotateY || 0, transforms[phase]?.rotateY || 0, transforms[(phase + 1) % 5]?.rotateY || 0],
    { extrapolateRight: 'clamp' }
  );

  // Entrance animation
  const cardScale = spring({ frame, fps, config: { damping: 15, stiffness: 100 } });

  // Loop fade
  const fadeOut = interpolate(frame, [170, 180], [1, 0], { extrapolateRight: 'clamp' });

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
        perspective: 800,
      }}
    >
      {/* 3D Card */}
      <div
        style={{
          width: '65%',
          aspectRatio: '16/10',
          background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
          borderRadius: 12,
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${Math.min(cardScale, 1)})`,
          transformStyle: 'preserve-3d',
          boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {/* Inner screenshot */}
        <div
          style={{
            width: '75%',
            aspectRatio: '16/10',
            backgroundColor: '#1a1a1a',
            borderRadius: 8,
            overflow: 'hidden',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          }}
        >
          {/* macOS bar */}
          <div style={{ height: 16, backgroundColor: '#2a2a2a', display: 'flex', alignItems: 'center', paddingLeft: 8, gap: 4 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#ff5f57' }} />
            <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#febc2e' }} />
            <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#28c840' }} />
          </div>
          <div style={{ height: 'calc(100% - 16px)', backgroundColor: '#252525' }} />
        </div>
      </div>

      {/* Transform label */}
      <div
        style={{
          position: 'absolute',
          bottom: 8,
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '4px 12px',
          borderRadius: 20,
          backgroundColor: 'rgba(201,255,46,0.15)',
          border: '1px solid rgba(201,255,46,0.3)',
          fontSize: 10,
          color: '#c9ff2e',
          fontWeight: 600,
        }}
      >
        {currentTransform?.label}
      </div>

      {/* Preset count badge */}
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
        30+ presets
      </div>
    </div>
  );
};
