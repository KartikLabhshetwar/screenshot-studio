import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring, Img, staticFile } from 'remotion';

// Exact replica of the Stage editor - matches actual UI
export const EditorDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animation phases (300 frames = 5 seconds at 60fps)
  const editorOpacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' });

  // Modal animation
  const modalScale = spring({ frame: frame - 25, fps, config: { damping: 20, stiffness: 100 } });
  const showImage = frame >= 100;
  const modalFadeOut = interpolate(frame, [90, 110], [1, 0], { extrapolateRight: 'clamp' });

  // Image animation
  const imageScale = spring({ frame: frame - 100, fps, config: { damping: 15, stiffness: 80 } });
  const imageOpacity = interpolate(frame, [100, 120], [0, 1], { extrapolateRight: 'clamp' });

  // Background change - orange/yellow gradient
  const bgPhase = Math.floor(interpolate(frame, [130, 220], [0, 2.99], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }));
  const backgrounds = [
    'linear-gradient(135deg, #3b82f6 0%, #06b6d4 40%, #22c55e 70%, #c9ff2e 100%)',
    'linear-gradient(135deg, #f97316 0%, #fbbf24 100%)',
    'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
  ];

  // Styling animations
  const cornerRadius = interpolate(frame, [160, 200], [8, 24], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const shadowSize = interpolate(frame, [180, 220], [20, 50], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const displayScale = interpolate(frame, [200, 240], [1, 0.89], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const showFrame = frame >= 150;

  // Slider values
  const roundSlider = interpolate(frame, [160, 200], [10, 70], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const scaleSlider = interpolate(frame, [200, 240], [100, 89], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const shadowSlider = interpolate(frame, [180, 220], [30, 75], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

  // Loop fade
  const fadeOut = interpolate(frame, [280, 300], [1, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

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
      <div
        style={{
          height: 56,
          backgroundColor: '#1e1e1e',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          flexShrink: 0,
        }}
      >
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
              background: backgrounds[bgPhase],
              position: 'relative',
              overflow: 'hidden',
              transition: 'background 0.5s ease',
            }}
          >
            {/* Upload Modal */}
            {!showImage && (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: modalFadeOut }}>
                <div
                  style={{
                    minWidth: 200,
                    backgroundColor: 'rgba(38, 38, 38, 0.95)',
                    backdropFilter: 'blur(12px)',
                    borderRadius: 12,
                    padding: '24px 32px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    border: '1px solid rgba(255,255,255,0.12)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.6), 0 16px 64px rgba(0,0,0,0.5)',
                    transform: `scale(${Math.min(modalScale, 1)})`,
                  }}
                >
                  <div style={{ marginBottom: 16, padding: 16, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="3" width="18" height="18" rx="2" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
                      <circle cx="8.5" cy="8.5" r="1.5" fill="rgba(255,255,255,0.35)" />
                      <path d="M21 15l-5-5L5 21" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 4 }}>Add Your Image</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 16 }}>Drag & drop, click to browse, or paste</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ padding: '4px 8px', backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 6, fontSize: 10, color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: 3 }}>
                      <span style={{ fontSize: 11 }}>⌘</span><span>V</span>
                    </div>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>to Paste</span>
                  </div>
                </div>
              </div>
            )}

            {/* Screenshot */}
            {showImage && (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: imageOpacity }}>
                <div
                  style={{
                    width: '55%',
                    aspectRatio: '16/10',
                    backgroundColor: '#1a1a1a',
                    borderRadius: cornerRadius,
                    boxShadow: `0 ${shadowSize}px ${shadowSize * 1.5}px rgba(0,0,0,0.5)`,
                    transform: `scale(${Math.min(imageScale, 1) * displayScale})`,
                    overflow: 'hidden',
                    transition: 'border-radius 0.2s ease',
                  }}
                >
                  {showFrame && (
                    <div style={{ height: 32, backgroundColor: '#2a2a2a', display: 'flex', alignItems: 'center', paddingLeft: 14, gap: 8, opacity: interpolate(frame, [150, 165], [0, 1], { extrapolateRight: 'clamp' }) }}>
                      <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#ff5f57' }} />
                      <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#febc2e' }} />
                      <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#28c840' }} />
                    </div>
                  )}
                  <div style={{ flex: 1, backgroundColor: '#1a1a1a' }} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel */}
        <div style={{ width: 280, backgroundColor: '#1e1e1e', borderLeft: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
          {/* Tabs */}
          <div style={{ padding: 12, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: 4, position: 'relative' }}>
              <div style={{ position: 'absolute', top: 4, bottom: 4, left: 'calc(16.67% + 4px)', width: 'calc(16.67% - 8px)', backgroundColor: '#2a2a2a', borderRadius: 8, transition: 'left 0.25s ease' }} />
              {['Settings', 'Edit', 'BG', '3D', 'Animate', 'Presets'].map((tab, i) => (
                <div key={tab} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '10px 4px', position: 'relative', zIndex: 1 }}>
                  <div style={{ width: 18, height: 18, borderRadius: 4, backgroundColor: i === 1 ? 'rgba(201,255,46,0.2)' : 'transparent', border: i === 1 ? '1px solid rgba(201,255,46,0.3)' : 'none' }} />
                  <span style={{ fontSize: 9, fontWeight: 500, color: i === 1 ? '#c9ff2e' : 'rgba(255,255,255,0.4)' }}>{tab}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Edit Panel */}
          <div style={{ flex: 1, padding: 20, overflowY: 'auto' }}>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 16, letterSpacing: 1.5, fontWeight: 600 }}>STYLING</div>
              <SliderControl label="Round" value={roundSlider} />
              <SliderControl label="Scale" value={scaleSlider} />
              <SliderControl label="Shadow" value={shadowSlider} />
            </div>

            <div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 16, letterSpacing: 1.5, fontWeight: 600 }}>FRAMES</div>
              <div style={{ display: 'flex', gap: 8 }}>
                {['None', 'macOS', 'Window'].map((f, i) => (
                  <div
                    key={f}
                    style={{
                      flex: 1,
                      padding: '14px 12px',
                      backgroundColor: showFrame && i === 1 ? 'rgba(201,255,46,0.1)' : 'rgba(255,255,255,0.03)',
                      border: showFrame && i === 1 ? '1px solid rgba(201,255,46,0.4)' : '1px solid rgba(255,255,255,0.08)',
                      borderRadius: 10,
                      textAlign: 'center',
                      fontSize: 13,
                      fontWeight: 500,
                      color: showFrame && i === 1 ? '#fff' : 'rgba(255,255,255,0.5)',
                    }}
                  >
                    {f}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const HeaderButton: React.FC<{ label: string; active?: boolean }> = ({ label, active }) => (
  <div
    style={{
      height: 40,
      padding: '0 20px',
      display: 'flex',
      alignItems: 'center',
      fontSize: 14,
      fontWeight: 500,
      backgroundColor: active ? 'rgba(201,255,46,0.15)' : 'transparent',
      border: active ? '1px solid rgba(201,255,46,0.3)' : '1px solid rgba(255,255,255,0.15)',
      borderRadius: 10,
      color: active ? '#c9ff2e' : 'rgba(255,255,255,0.85)',
    }}
  >
    {label}
  </div>
);

const SliderControl: React.FC<{ label: string; value: number }> = ({ label, value }) => (
  <div style={{ marginBottom: 20 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
      <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>{label}</span>
      <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>{Math.round(value)}%</span>
    </div>
    <div style={{ height: 8, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden' }}>
      <div style={{ width: `${value}%`, height: '100%', backgroundColor: '#c9ff2e', borderRadius: 4 }} />
    </div>
  </div>
);
