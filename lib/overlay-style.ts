import type { ImageOverlayTilt, ImageShadow } from "@/lib/store";

export const DEFAULT_OVERLAY_TILT: ImageOverlayTilt = {
  perspective: 600,
  rotateX: 0,
  rotateY: 0,
  rotateZ: 0,
};

export const DEFAULT_OVERLAY_SHADOW: ImageShadow = {
  enabled: true,
  blur: 15,
  offsetX: 5,
  offsetY: 8,
  spread: 3,
  color: "rgba(0, 0, 0, 0.6)",
  opacity: 0.5,
};

export function hasOverlayTilt(tilt: ImageOverlayTilt | undefined): tilt is ImageOverlayTilt {
  return Boolean(tilt && (tilt.rotateX !== 0 || tilt.rotateY !== 0 || tilt.rotateZ !== 0));
}

export function buildOverlayTiltTransform(tilt: ImageOverlayTilt | undefined): string | undefined {
  if (!hasOverlayTilt(tilt)) return undefined;
  return `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) rotateZ(${tilt.rotateZ}deg)`;
}

function parseShadowRgb(color: string): [number, number, number] {
  const rgbMatch = color.match(/rgba?\(([^)]+)\)/);
  if (rgbMatch) {
    const [r, g, b] = rgbMatch[1].split(",").map((part) => parseInt(part.trim(), 10) || 0);
    return [r, g, b];
  }
  if (color.startsWith("#")) {
    const hex = color.slice(1);
    return [
      parseInt(hex.slice(0, 2), 16) || 0,
      parseInt(hex.slice(2, 4), 16) || 0,
      parseInt(hex.slice(4, 6), 16) || 0,
    ];
  }
  return [0, 0, 0];
}

export function buildOverlayShadowFilter(shadow: ImageShadow | undefined): string | undefined {
  if (!shadow?.enabled) return undefined;
  const [r, g, b] = parseShadowRgb(shadow.color);
  const blur = shadow.blur + shadow.spread;
  const opacity = Math.min(1, Math.max(0, shadow.opacity));
  return `drop-shadow(${shadow.offsetX}px ${shadow.offsetY}px ${blur}px rgba(${r}, ${g}, ${b}, ${opacity}))`;
}

export function fitOverlayImage(
  size: number,
  naturalWidth: number,
  naturalHeight: number
): { width: number; height: number } {
  if (naturalWidth <= 0 || naturalHeight <= 0) return { width: size, height: size };
  const aspect = naturalWidth / naturalHeight;
  if (aspect >= 1) return { width: size, height: size / aspect };
  return { width: size * aspect, height: size };
}
