import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring, Img, staticFile } from 'remotion';

// Export Demo - Shows export modal with format options
export const ExportDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const editorOpacity = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: 'clamp' });

  // Export button glow
  const buttonGlow = interpolate(frame, [0, 20, 40], [0, 1, 0.3], { extrapolateRight: 'clamp' });

  // Modal animation
  const showModal = frame >= 30;
  const modalScale = spring({ frame: frame - 30, fps, config: { damping: 18, stiffness: 100 } });
  const modalOpacity = interpolate(frame, [30, 50], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

  // Format selection
  const selectedFormat = Math.floor(interpolate(frame, [80, 150], [0, 2.99], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }));

  // Progress
  const progressValue = interpolate(frame, [160, 210], [0, 100], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const showSuccess = frame >= 210;

  const fadeOut = interpolate(frame, [230, 240], [1, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

  const formats = [
    { name: 'PNG', scale: '5x', size: '4000×3000' },
    { name: 'JPG', scale: '4x', size: '3200×2400' },
    { name: 'WebP', scale: '3x', size: '2400×1800' },
  ];

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
        position: 'relative',
      }}
    >
      {/* Header */}
      <div style={{ height: 56, backgroundColor: '#1e1e1e', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', flexShrink: 0 }}>
        <Img src={staticFile('logo.png')} style={{ width: 48, height: 48, objectFit: 'contain' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <HeaderButton label="Save" />
          <HeaderButton label="Copy" />
          <HeaderButton label="16:9" active />
          <div
            style={{
              height: 40,
              padding: '0 20px',
              display: 'flex',
              alignItems: 'center',
              fontSize: 14,
              fontWeight: 600,
              backgroundColor: '#c9ff2e',
              borderRadius: 10,
              color: '#000',
              boxShadow: `0 0 ${20 * buttonGlow}px rgba(201,255,46,${0.5 * buttonGlow})`,
            }}
          >
            Export
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.05)' }} />
          <div style={{ width: 28, height: 28, borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.05)' }} />
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', position: 'relative' }}>
        {/* Canvas (dimmed) */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32, backgroundColor: '#0f0f0f', opacity: showModal ? 0.4 : 1, transition: 'opacity 0.3s ease' }}>
          <div style={{ width: '100%', maxWidth: 520, aspectRatio: '16/9', borderRadius: 12, background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '55%', aspectRatio: '16/10', backgroundColor: '#1a1a1a', borderRadius: 16, boxShadow: '0 30px 60px rgba(0,0,0,0.5)', overflow: 'hidden' }}>
              <div style={{ height: 28, backgroundColor: '#2a2a2a', display: 'flex', alignItems: 'center', paddingLeft: 12, gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#ff5f57' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#febc2e' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#28c840' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel (dimmed) */}
        <div style={{ width: 280, backgroundColor: '#1e1e1e', borderLeft: '1px solid rgba(255,255,255,0.1)', opacity: showModal ? 0.4 : 1, transition: 'opacity 0.3s ease' }} />

        {/* Export Modal */}
        {showModal && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)', opacity: modalOpacity }}>
            <div style={{ width: 340, backgroundColor: '#1e1e1e', borderRadius: 20, border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', transform: `scale(${Math.min(modalScale, 1)})` }}>
              {/* Modal Header */}
              <div style={{ padding: '18px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 16, fontWeight: 600, color: '#fff' }}>Export Image</span>
                <div style={{ display: 'flex', gap: 6 }}>
                  {formats.map((f, i) => (
                    <span key={f.name} style={{ padding: '4px 10px', fontSize: 11, backgroundColor: i === selectedFormat ? 'rgba(201,255,46,0.15)' : 'rgba(255,255,255,0.05)', color: i === selectedFormat ? '#c9ff2e' : 'rgba(255,255,255,0.5)', borderRadius: 6, fontWeight: 500, transition: 'all 0.15s ease' }}>
                      {f.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Modal Content */}
              <div style={{ padding: 20 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                  {formats.map((format, i) => {
                    const isSelected = i === selectedFormat;
                    return (
                      <div key={format.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', backgroundColor: isSelected ? 'rgba(201,255,46,0.08)' : 'rgba(255,255,255,0.02)', border: isSelected ? '1px solid rgba(201,255,46,0.3)' : '1px solid rgba(255,255,255,0.06)', borderRadius: 12, transition: 'all 0.15s ease' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: isSelected ? '#c9ff2e' : 'rgba(255,255,255,0.1)', color: isSelected ? '#000' : 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>
                            {format.scale}
                          </div>
                          <div>
                            <div style={{ fontSize: 14, color: isSelected ? '#fff' : 'rgba(255,255,255,0.6)', fontWeight: 500 }}>{format.name} {format.scale}</div>
                            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{format.size}</div>
                          </div>
                        </div>
                        {isSelected && (
                          <div style={{ width: 20, height: 20, borderRadius: '50%', backgroundColor: '#c9ff2e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3"><path d="M5 13l4 4L19 7" /></svg>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Progress or Success */}
                {progressValue > 0 && !showSuccess ? (
                  <div>
                    <div style={{ height: 6, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden', marginBottom: 8 }}>
                      <div style={{ width: `${progressValue}%`, height: '100%', backgroundColor: '#c9ff2e', borderRadius: 3 }} />
                    </div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>Exporting... {Math.round(progressValue)}%</div>
                  </div>
                ) : showSuccess ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, transform: `scale(${Math.min(spring({ frame: frame - 210, fps, config: { damping: 12, stiffness: 120 } }), 1)})` }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#c9ff2e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3"><path d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <span style={{ fontSize: 14, color: '#c9ff2e', fontWeight: 600 }}>Exported!</span>
                  </div>
                ) : (
                  <button style={{ width: '100%', padding: '14px', fontSize: 14, fontWeight: 600, backgroundColor: '#c9ff2e', border: 'none', borderRadius: 12, color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
                    Export {formats[selectedFormat]?.name} {formats[selectedFormat]?.scale}
                  </button>
                )}

                {/* Share Row */}
                <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>Share:</span>
                  {['X', 'in', '💬', '▶'].map((icon, i) => (
                    <div key={i} style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{icon}</div>
                  ))}
                  <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#c9ff2e' }} />
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>Up to 5x HD</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const HeaderButton: React.FC<{ label: string; active?: boolean }> = ({ label, active }) => (
  <div style={{ height: 40, padding: '0 20px', display: 'flex', alignItems: 'center', fontSize: 14, fontWeight: 500, backgroundColor: active ? 'rgba(201,255,46,0.15)' : 'transparent', border: active ? '1px solid rgba(201,255,46,0.3)' : '1px solid rgba(255,255,255,0.15)', borderRadius: 10, color: active ? '#c9ff2e' : 'rgba(255,255,255,0.85)' }}>
    {label}
  </div>
);
