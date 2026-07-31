'use client';

interface ToolbarProps {
  windowHeader: number;
  isDark: boolean;
  title?: string;
  /** Top border-radius — used in 3D overlay where the toolbar is the topmost element */
  screenshotRadius?: number;
}

/**
 * Safari toolbar — single unified bar matching macOS Sonoma/Sequoia.
 * Layout: traffic lights | sidebar | ← → | [spacer] | reader | [lock url refresh] | [spacer] | globe share + tabs
 */
export function SafariToolbar({ windowHeader, isDark, title, screenshotRadius }: ToolbarProps) {
  const bgColor = isDark ? '#3A3A3C' : '#F6F6F6';
  const iconColor = isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.5)';
  const pillBg = isDark ? 'rgba(0,0,0,0.15)' : 'rgba(0,0,0,0.04)';
  const urlColor = isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.55)';
  const borderColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.12)';
  const sf = '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif';
  const dot = Math.max(5, Math.round(windowHeader * 0.27));
  const ico = Math.max(7, Math.round(windowHeader * 0.36));
  const pillH = Math.max(12, Math.round(windowHeader * 0.55));
  const fs = Math.max(9, Math.round(windowHeader * 0.38));
  const pad = Math.max(6, Math.round(windowHeader * 0.32));
  const gap = Math.max(4, Math.round(windowHeader * 0.2));
  const smIco = Math.max(6, Math.round(ico * 0.85));

  return (
    <div
      style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: `${windowHeader}px`,
        background: bgColor,
        display: 'flex', alignItems: 'center',
        padding: `0 ${pad}px`,
        zIndex: 2, gap: `${gap}px`,
        fontFamily: sf,
        borderBottom: `1px solid ${borderColor}`,
        boxSizing: 'border-box',
        overflow: 'hidden',
        borderRadius: screenshotRadius ? `${screenshotRadius}px ${screenshotRadius}px 0 0` : undefined,
      }}
    >
      {/* Left group */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: `${gap}px`, minWidth: 0 }}>
        <div style={{ display: 'flex', gap: `${Math.max(3, Math.round(dot * 0.5))}px`, flexShrink: 0 }}>
          <span style={{ height: `${dot}px`, width: `${dot}px`, borderRadius: '50%', backgroundColor: '#ff5f57' }} />
          <span style={{ height: `${dot}px`, width: `${dot}px`, borderRadius: '50%', backgroundColor: '#febc2e' }} />
          <span style={{ height: `${dot}px`, width: `${dot}px`, borderRadius: '50%', backgroundColor: '#28c840' }} />
        </div>
        <svg width={ico} height={ico} viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, opacity: 0.45 }}>
          <rect x="1" y="2" width="14" height="12" rx="2" stroke={iconColor} strokeWidth="1.4" />
          <line x1="5.5" y1="2" x2="5.5" y2="14" stroke={iconColor} strokeWidth="1.4" />
        </svg>
        <svg width={ico} height={ico} viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, opacity: 0.5 }}>
          <path d="M10 3L5 8l5 5" stroke={iconColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <svg width={ico} height={ico} viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, opacity: 0.5 }}>
          <path d="M6 3l5 5-5 5" stroke={iconColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      {/* Center group — reader + address bar pill */}
      <div style={{ flex: 1.5, display: 'flex', alignItems: 'center', gap: `${gap}px`, justifyContent: 'center', minWidth: 0 }}>
        <svg width={ico} height={ico} viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, opacity: 0.45 }}>
          <circle cx="8" cy="8" r="5.5" stroke={iconColor} strokeWidth="1.4" />
          <path d="M8 2.5V13.5" stroke={iconColor} strokeWidth="1.4" />
          <path d="M8 2.5A5.5 5.5 0 008 13.5" fill={iconColor} />
        </svg>
        <div
          style={{
            flex: 1, height: `${pillH}px`,
            background: pillBg, borderRadius: '5px',
            display: 'flex', alignItems: 'center',
            padding: `0 ${Math.max(5, Math.round(pad * 0.7))}px`,
            minWidth: 0, position: 'relative',
          }}
        >
          <svg width={smIco} height={smIco} viewBox="0 0 16 16" style={{ flexShrink: 0, opacity: 0.5 }}>
            <rect x="4" y="7.5" width="8" height="6" rx="1.2" fill={iconColor} />
            <path d="M6 7.5V5.5a2 2 0 014 0v2" stroke={iconColor} strokeWidth="1.3" fill="none" strokeLinecap="round" />
          </svg>
          <span style={{
            position: 'absolute', left: `${smIco + 4}px`, right: `${smIco + 4}px`,
            fontSize: `${fs}px`, color: urlColor,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            fontWeight: 400, textAlign: 'center',
            pointerEvents: 'none', zIndex: 1,
          }}>
            {title || ''}
          </span>
          <div style={{ flex: 1 }} />
          <svg width={smIco} height={smIco} viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, opacity: 0.45 }}>
            <path d="M12 7a5 5 0 11-1.5-3.5M12 2v2.5H9.5" stroke={iconColor} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      {/* Right group */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: `${gap}px`, justifyContent: 'flex-end', minWidth: 0 }}>
        <svg width={ico} height={ico} viewBox="0 0 16 16" fill="none" style={{ opacity: 0.45 }}>
          <circle cx="8" cy="8" r="5.5" stroke={iconColor} strokeWidth="1.3" />
          <path d="M8 2.5v11M2.5 8h11" stroke={iconColor} strokeWidth="1.2" />
          <path d="M8 2.5c-2 2-2 9 0 11M8 2.5c2 2 2 9 0 11" stroke={iconColor} strokeWidth="1.2" />
        </svg>
        <svg width={ico} height={ico} viewBox="0 0 16 16" fill="none" style={{ opacity: 0.45 }}>
          <path d="M4.5 9.5v3.5a1 1 0 001 1h5a1 1 0 001-1v-3.5" stroke={iconColor} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8 2v7.5M8 2L5.5 4.5M8 2l2.5 2.5" stroke={iconColor} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <svg width={ico} height={ico} viewBox="0 0 16 16" fill="none" style={{ opacity: 0.45 }}>
          <path d="M8 3v10M3 8h10" stroke={iconColor} strokeWidth="1.4" strokeLinecap="round" />
        </svg>
        <svg width={ico} height={ico} viewBox="0 0 16 16" fill="none" style={{ opacity: 0.45 }}>
          <rect x="1.5" y="4" width="9" height="9" rx="1.8" stroke={iconColor} strokeWidth="1.4" />
          <path d="M5.5 4V3a1.5 1.5 0 011.5-1.5h6A1.5 1.5 0 0114.5 3v6a1.5 1.5 0 01-1.5 1.5h-1" stroke={iconColor} strokeWidth="1.4" />
        </svg>
      </div>
    </div>
  );
}

/**
 * Chrome toolbar on macOS — two rows: tab bar + address bar.
 * Tab bar: traffic lights | [tab title ×] | +
 * Address bar: ← → ↻ | [lock url] | ⋮
 */
export function ChromeToolbar({ windowHeader, isDark, title, screenshotRadius }: ToolbarProps) {
  const tabBg = isDark ? '#202124' : '#DEE1E6';
  const activeBg = isDark ? '#292A2D' : '#FFFFFF';
  const iconColor = isDark ? '#9AA0A6' : '#5F6368';
  const urlColor = isDark ? '#E8EAED' : '#202124';
  const barInputBg = isDark ? '#35363A' : '#F1F3F4';
  const sf = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, system-ui, sans-serif';
  const tabH = Math.round(windowHeader * 0.47);
  const addrH = windowHeader - tabH;
  const tabRiseH = Math.round(tabH * 0.72);
  const dot = Math.max(5, Math.round(windowHeader * 0.17));
  const ico = Math.max(7, Math.round(windowHeader * 0.25));
  const omniH = Math.max(12, Math.round(addrH * 0.75));
  const fs = Math.max(9, Math.round(windowHeader * 0.2));
  const pad = Math.max(6, Math.round(windowHeader * 0.2));
  const gap = Math.max(3, Math.round(windowHeader * 0.12));
  const dotGap = Math.max(2, Math.round(dot * 0.5));
  const dotsWidth = 3 * dot + 2 * dotGap;

  return (
    <div
      style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: `${windowHeader}px`,
        overflow: 'hidden', zIndex: 2, fontFamily: sf,
      }}
    >
      {/* Tab bar row */}
      <div
        style={{
          position: 'relative',
          height: `${tabH}px`, background: tabBg,
          display: 'flex', alignItems: 'flex-end',
          padding: `0 ${pad}px`,
          borderRadius: screenshotRadius ? `${screenshotRadius}px ${screenshotRadius}px 0 0` : undefined,
        }}
      >
        {/* Traffic lights */}
        <div style={{ display: 'flex', gap: `${dotGap}px`, flexShrink: 0, position: 'absolute', top: '50%', left: `${pad}px`, transform: 'translateY(-50%)', zIndex: 1 }}>
          <span style={{ height: `${dot}px`, width: `${dot}px`, borderRadius: '50%', backgroundColor: '#ff5f57' }} />
          <span style={{ height: `${dot}px`, width: `${dot}px`, borderRadius: '50%', backgroundColor: '#febc2e' }} />
          <span style={{ height: `${dot}px`, width: `${dot}px`, borderRadius: '50%', backgroundColor: '#28c840' }} />
        </div>
        {/* Active tab — squircle top corners */}
        <div
          style={{
            marginLeft: `${dotsWidth + gap}px`,
            height: `${tabRiseH}px`,
            background: activeBg, borderRadius: '4px 4px 0 0',
            display: 'flex', alignItems: 'center', padding: `0 ${Math.max(5, pad - 1)}px`,
            gap: `${gap}px`, minWidth: `${Math.round(windowHeader * 2)}px`, maxWidth: `${Math.round(windowHeader * 4.5)}px`,
          }}
        >
          <span style={{ fontSize: `${fs}px`, color: urlColor, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1, fontWeight: 400 }}>
            {title || 'New Tab'}
          </span>
          <svg width={Math.max(6, Math.round(ico * 0.85))} height={Math.max(6, Math.round(ico * 0.85))} viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, opacity: 0.5 }}>
            <path d="M4 4l6 6M10 4l-6 6" stroke={iconColor} strokeWidth="1.3" strokeLinecap="round" />
          </svg>
        </div>
        {/* New tab + aligned with × in the tab */}
        <svg width={ico} height={ico} viewBox="0 0 18 18" fill="none" style={{ marginLeft: `${gap}px`, alignSelf: 'flex-end', marginBottom: `${Math.max(1, Math.round((tabRiseH - ico) / 2))}px`, opacity: 0.5, flexShrink: 0 }}>
          <path d="M9 5v8M5 9h8" stroke={iconColor} strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      </div>
      {/* Address bar row */}
      <div
        style={{
          height: `${addrH}px`, background: activeBg,
          display: 'flex', alignItems: 'center',
          padding: `0 ${pad}px`, gap: `${gap + 2}px`,
        }}
      >
        <svg width={ico} height={ico} viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0, opacity: 0.6 }}>
          <path d="M11 4L6 9l5 5" stroke={iconColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <svg width={ico} height={ico} viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0, opacity: 0.35 }}>
          <path d="M7 4l5 5-5 5" stroke={iconColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <svg width={ico} height={ico} viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0, opacity: 0.6 }}>
          <path d="M14.5 9a5.5 5.5 0 11-1.7-4M14.5 3.5V6.5H11.5" stroke={iconColor} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {/* Omnibox */}
        <div
          style={{
            flex: 1, height: `${omniH}px`,
            background: barInputBg, borderRadius: '100px',
            display: 'flex', alignItems: 'center',
            padding: `0 ${Math.max(5, pad - 1)}px`, gap: `${gap}px`, minWidth: 0,
          }}
        >
          <svg width={Math.max(6, Math.round(ico * 0.85))} height={Math.max(6, Math.round(ico * 0.85))} viewBox="0 0 16 16" style={{ flexShrink: 0, opacity: 0.55 }}>
            <rect x="3" y="7" width="10" height="7" rx="1.5" fill={iconColor} />
            <path d="M5.5 7V5.5a2.5 2.5 0 015 0V7" stroke={iconColor} strokeWidth="1.5" fill="none" strokeLinecap="round" />
          </svg>
          <span style={{ fontSize: `${fs}px`, color: urlColor, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 400 }}>
            {title || ''}
          </span>
        </div>
        <svg width={ico} height={ico} viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0, opacity: 0.6 }}>
          <circle cx="9" cy="4" r="1.2" fill={iconColor} />
          <circle cx="9" cy="9" r="1.2" fill={iconColor} />
          <circle cx="9" cy="14" r="1.2" fill={iconColor} />
        </svg>
      </div>
    </div>
  );
}
