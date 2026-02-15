/**
 * Analytics utility for tracking events with Umami
 *
 * Umami API Reference:
 * - umami.track(event_name) - Track simple event
 * - umami.track(event_name, data) - Track event with properties
 * - umami.identify(session_data) - Identify session
 *
 * Limits:
 * - Event names: max 50 characters
 * - Strings: max 500 characters
 * - Numbers: max 4 decimal precision
 * - Objects: max 50 properties
 */

declare global {
  interface Window {
    umami?: {
      track: ((eventName: string, eventData?: Record<string, string | number | boolean>) => void) &
             ((callback: (props: Record<string, unknown>) => Record<string, unknown>) => void);
      identify: (data: Record<string, string | number | boolean>) => void;
    };
  }
}

// =============================================================================
// Core Tracking Functions
// =============================================================================

/**
 * Check if analytics should be enabled
 */
function shouldTrack(): boolean {
  if (typeof window === 'undefined') return false;

  // Skip localhost
  const hostname = window.location.hostname;
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '0.0.0.0') {
    return false;
  }

  return true;
}

/**
 * Safely track an event with Umami
 */
export function trackEvent(
  eventName: string,
  eventData?: Record<string, string | number | boolean>
): void {
  if (!shouldTrack()) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics] Skipped:', eventName, eventData);
    }
    return;
  }

  if (typeof window !== 'undefined' && window.umami) {
    try {
      if (eventData) {
        window.umami.track(eventName, eventData);
      } else {
        window.umami.track(eventName, {});
      }
    } catch (error) {
      console.warn('[Analytics] Failed:', error);
    }
  }
}

// =============================================================================
// Image Upload Events
// =============================================================================

export function trackImageUpload(source: 'file' | 'paste' | 'drop' | 'url', fileSize?: number): void {
  trackEvent('image_upload', {
    source,
    file_size_kb: fileSize ? Math.round(fileSize / 1024) : 0,
  });
}

export function trackImageRemove(): void {
  trackEvent('image_remove', {});
}

// =============================================================================
// Export Events
// =============================================================================

export function trackExportStart(format: string, quality: string, scale: number): void {
  trackEvent('export_start', {
    format,
    quality,
    scale,
  });
}

export function trackExportComplete(
  format: string,
  quality: string,
  scale: number,
  fileSizeKb: number,
  durationMs: number
): void {
  trackEvent('export_complete', {
    format,
    quality,
    scale,
    file_size_kb: fileSizeKb,
    duration_ms: durationMs,
  });
}

export function trackExportError(format: string, error: string): void {
  trackEvent('export_error', {
    format,
    error: error.substring(0, 100), // Limit error message length
  });
}

export function trackCopyToClipboard(success: boolean): void {
  trackEvent('copy_to_clipboard', {
    success,
  });
}

// =============================================================================
// Background Events
// =============================================================================

export function trackBackgroundChange(
  type: 'gradient' | 'solid' | 'image' | 'transparent',
  value?: string
): void {
  trackEvent('background_change', {
    type,
    value: value?.substring(0, 50) || '',
  });
}

// =============================================================================
// Effect Events
// =============================================================================

export function trackEffectApply(
  effectType: 'shadow' | 'border' | 'radius' | 'blur' | 'noise' | 'filter' | '3d_transform',
  value?: string | number
): void {
  trackEvent('effect_apply', {
    effect_type: effectType,
    value: String(value || '').substring(0, 50),
  });
}

export function trackFrameApply(frameType: string): void {
  trackEvent('frame_apply', {
    frame_type: frameType,
  });
}

// =============================================================================
// Preset Events
// =============================================================================

export function trackPresetApply(presetId: string, presetName: string): void {
  trackEvent('preset_apply', {
    preset_id: presetId,
    preset_name: presetName.substring(0, 50),
  });
}

// =============================================================================
// Overlay Events
// =============================================================================

export function trackOverlayAdd(overlayType: 'text' | 'image' | 'sticker'): void {
  trackEvent('overlay_add', {
    overlay_type: overlayType,
  });
}

export function trackOverlayRemove(overlayType: 'text' | 'image' | 'sticker'): void {
  trackEvent('overlay_remove', {
    overlay_type: overlayType,
  });
}

// =============================================================================
// Aspect Ratio Events
// =============================================================================

export function trackAspectRatioChange(ratio: string): void {
  trackEvent('aspect_ratio_change', {
    ratio,
  });
}

// =============================================================================
// Feature Discovery Events
// =============================================================================

export function trackFeatureClick(feature: string): void {
  trackEvent('feature_click', {
    feature,
  });
}

export function trackTabChange(tab: string): void {
  trackEvent('tab_change', {
    tab,
  });
}

// =============================================================================
// Session Events
// =============================================================================

export function trackSessionStart(): void {
  trackEvent('session_start', {
    referrer: typeof document !== 'undefined' ? (document.referrer || 'direct').substring(0, 100) : 'unknown',
  });
}

// =============================================================================
// Error Events
// =============================================================================

export function trackError(errorType: string, message: string): void {
  trackEvent('error', {
    error_type: errorType,
    message: message.substring(0, 200),
  });
}
