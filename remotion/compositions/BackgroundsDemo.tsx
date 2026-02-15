import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring, Img, staticFile } from 'remotion';

// Backgrounds Demo - Shows BG panel with gradient selection
export const BackgroundsDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const editorOpacity = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: 'clamp' });

  // Background selection cycles
  const selectedBG = Math.floor(interpolate(frame, [60, 200], [0, 8.99], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }));

  const backgrounds = [
    'linear-gradient(135deg, #3b82f6 0%, #06b6d4 50%, #c9ff2e 100%)',
    'linear-gradient(135deg, #f97316 0%, #fbbf24 100%)',
    'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
    'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
    'linear-gradient(135deg, #ef4444 0%, #f97316 100%)',
    'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
    'linear-gradient(135deg, #14b8a6 0%, #22c55e 100%)',
    'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)',
    'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
  ];

  const fadeOut = interpolate(frame, [220, 240], [1, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#141414',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        opacity: editorOpacity * fadeOut,
      }}
    >
      {/* Header */}
      <div style={{ height: 56, backgroundColor: '#1e1e1e', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', flexShrink: 0 }}>
        <Img src={staticFile('logo.png')} style={{ width: 48, height: 48, objectFit: 'contain' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <HeaderButton label="Save" />
          <HeaderButton label="Copy" />
          <HeaderButton label="16:9" active />
          <HeaderButton label="Animate" />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.05)' }} />
          <div style={{ width: 28, height: 28, borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.05)' }} />
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Canvas */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32, backgroundColor: '#0f0f0f' }}>
          <div
            style={{
              width: '100%',
              maxWidth: 520,
              aspectRatio: '16/9',
              borderRadius: 12,
              background: backgrounds[selectedBG],
              position: 'relative',
              overflow: 'hidden',
              transition: 'background 0.4s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: '55%',
                aspectRatio: '16/10',
                backgroundColor: '#1a1a1a',
                borderRadius: 16,
                boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
                overflow: 'hidden',
              }}
            >
              <div style={{ height: 28, backgroundColor: '#2a2a2a', display: 'flex', alignItems: 'center', paddingLeft: 12, gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#ff5f57' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#febc2e' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#28c840' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div style={{ width: 280, backgroundColor: '#1e1e1e', borderLeft: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
          {/* Tabs - BG active */}
          <div style={{ padding: 12, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: 4, position: 'relative' }}>
              <div style={{ position: 'absolute', top: 4, bottom: 4, left: 'calc(33.33% + 4px)', width: 'calc(16.67% - 8px)', backgroundColor: '#2a2a2a', borderRadius: 8 }} />
              {['Settings', 'Edit', 'BG', '3D', 'Animate', 'Presets'].map((tab, i) => (
                <div key={tab} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '10px 4px', position: 'relative', zIndex: 1 }}>
                  <div style={{ width: 18, height: 18, borderRadius: 4, backgroundColor: i === 2 ? 'rgba(201,255,46,0.2)' : 'transparent', border: i === 2 ? '1px solid rgba(201,255,46,0.3)' : 'none' }} />
                  <span style={{ fontSize: 9, fontWeight: 500, color: i === 2 ? '#c9ff2e' : 'rgba(255,255,255,0.4)' }}>{tab}</span>
                </div>
              ))}
            </div>
          </div>

          {/* BG Panel */}
          <div style={{ flex: 1, padding: 20, overflowY: 'auto' }}>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 16, letterSpacing: 1.5, fontWeight: 600 }}>GRADIENTS</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                {backgrounds.map((bg, i) => {
                  const delay = 30 + i * 5;
                  const scale = spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 150 } });
                  return (
                    <div
                      key={i}
                      style={{
                        aspectRatio: '1',
                        background: bg,
                        borderRadius: 10,
                        transform: `scale(${Math.min(scale, 1)})`,
                        border: i === selectedBG ? '2px solid #c9ff2e' : '2px solid transparent',
                        boxShadow: i === selectedBG ? '0 0 0 3px rgba(201,255,46,0.2)' : 'none',
                        transition: 'border 0.15s ease, box-shadow 0.15s ease',
                      }}
                    />
                  );
                })}
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 16, letterSpacing: 1.5, fontWeight: 600 }}>CUSTOM BG</div>
              <div style={{ display: 'flex', gap: 10 }}>
                {['Image', '#7dd4ad', 'Transparent'].map((label, i) => (
                  <div key={label} style={{ flex: 1, padding: '14px 8px', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                    {i === 1 ? (
                      <div style={{ width: 20, height: 20, borderRadius: '50%', backgroundColor: '#7dd4ad' }} />
                    ) : (
                      <div style={{ width: 20, height: 20, borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.1)' }} />
                    )}
                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ padding: '10px 14px', backgroundColor: 'rgba(201,255,46,0.1)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 12, color: '#c9ff2e', fontWeight: 600 }}>50+ backgrounds available</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const HeaderButton: React.FC<{ label: string; active?: boolean }> = ({ label, active }) => (
  <div style={{ height: 40, padding: '0 20px', display: 'flex', alignItems: 'center', fontSize: 14, fontWeight: 500, backgroundColor: active ? 'rgba(201,255,46,0.15)' : 'transparent', border: active ? '1px solid rgba(201,255,46,0.3)' : '1px solid rgba(255,255,255,0.15)', borderRadius: 10, color: active ? '#c9ff2e' : 'rgba(255,255,255,0.85)' }}>
    {label}
  </div>
);
