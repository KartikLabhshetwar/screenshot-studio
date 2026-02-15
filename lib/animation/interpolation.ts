import type {
  EasingFunction,
  AnimatableProperties,
  AnimationTrack,
  AnimationClip,
  Keyframe,
} from '@/types/animation';
import { DEFAULT_ANIMATABLE_PROPERTIES } from '@/types/animation';

// Easing functions - take progress (0-1) and return eased progress (0-1)
export const easingFunctions: Record<EasingFunction, (t: number) => number> = {
  linear: (t) => t,

  'ease-in': (t) => t * t,

  'ease-out': (t) => 1 - (1 - t) * (1 - t),

  'ease-in-out': (t) => {
    return t < 0.5
      ? 2 * t * t
      : 1 - Math.pow(-2 * t + 2, 2) / 2;
  },

  'ease-in-cubic': (t) => t * t * t,

  'ease-out-cubic': (t) => 1 - Math.pow(1 - t, 3),

  'ease-in-expo': (t) => {
    return t === 0 ? 0 : Math.pow(2, 10 * t - 10);
  },

  'ease-out-expo': (t) => {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  },
};

/**
 * Apply easing function to get interpolated value
 */
export function applyEasing(
  progress: number,
  easing: EasingFunction
): number {
  const easingFn = easingFunctions[easing] || easingFunctions.linear;
  return easingFn(Math.max(0, Math.min(1, progress)));
}

/**
 * Linearly interpolate between two values
 */
export function lerp(start: number, end: number, progress: number): number {
  return start + (end - start) * progress;
}

/**
 * Find the two keyframes that surround the given time
 */
export function findSurroundingKeyframes(
  keyframes: Keyframe[],
  time: number
): { prev: Keyframe | null; next: Keyframe | null } {
  if (keyframes.length === 0) {
    return { prev: null, next: null };
  }

  // Sort keyframes by time
  const sorted = [...keyframes].sort((a, b) => a.time - b.time);

  // Find surrounding keyframes
  let prev: Keyframe | null = null;
  let next: Keyframe | null = null;

  for (let i = 0; i < sorted.length; i++) {
    const kf = sorted[i];
    if (kf.time <= time) {
      prev = kf;
    }
    if (kf.time >= time && next === null) {
      next = kf;
    }
  }

  return { prev, next };
}

/**
 * Get interpolated value for a single property from a track at a given time
 */
export function getInterpolatedProperty<K extends keyof AnimatableProperties>(
  track: AnimationTrack,
  time: number,
  propertyKey: K,
  defaultValue: AnimatableProperties[K]
): AnimatableProperties[K] {
  const { prev, next } = findSurroundingKeyframes(track.keyframes, time);

  // No keyframes
  if (!prev && !next) {
    return defaultValue;
  }

  // Before first keyframe
  if (!prev && next) {
    return next.properties[propertyKey] ?? defaultValue;
  }

  // After last keyframe or at/past last keyframe
  if (prev && !next) {
    return prev.properties[propertyKey] ?? defaultValue;
  }

  // Between two keyframes
  if (prev && next) {
    // Same keyframe (at exact time)
    if (prev.id === next.id) {
      return prev.properties[propertyKey] ?? defaultValue;
    }

    const prevValue = prev.properties[propertyKey] ?? defaultValue;
    const nextValue = next.properties[propertyKey] ?? defaultValue;

    // Calculate progress between keyframes
    const duration = next.time - prev.time;
    const elapsed = time - prev.time;
    const rawProgress = duration > 0 ? elapsed / duration : 1;

    // Apply easing (use next keyframe's easing)
    const easedProgress = applyEasing(rawProgress, next.easing);

    // Interpolate
    return lerp(prevValue as number, nextValue as number, easedProgress) as AnimatableProperties[K];
  }

  return defaultValue;
}

/**
 * Get all interpolated properties from all tracks at a given time
 * @deprecated Use getClipInterpolatedProperties for clip-aware animation
 */
export function getInterpolatedProperties(
  tracks: AnimationTrack[],
  time: number,
  defaults: AnimatableProperties = DEFAULT_ANIMATABLE_PROPERTIES
): AnimatableProperties {
  const result: AnimatableProperties = { ...defaults };

  for (const track of tracks) {
    if (!track.isVisible) continue;

    // Get all properties from this track's keyframes
    const propertyKeys = new Set<keyof AnimatableProperties>();
    for (const kf of track.keyframes) {
      for (const key of Object.keys(kf.properties) as Array<keyof AnimatableProperties>) {
        propertyKeys.add(key);
      }
    }

    // Interpolate each property
    for (const key of propertyKeys) {
      result[key] = getInterpolatedProperty(track, time, key, defaults[key]);
    }
  }

  return result;
}

/**
 * Get interpolated properties for a single clip's tracks at a given local time
 * This handles time relative to the clip's start
 */
export function getClipLocalInterpolatedProperties(
  clipTracks: AnimationTrack[],
  localTime: number,
  originalDuration: number,
  clipDuration: number,
  defaults: AnimatableProperties
): AnimatableProperties {
  const result: AnimatableProperties = { ...defaults };

  // Calculate time scale factor for stretched/compressed clips
  const timeScale = originalDuration > 0 ? originalDuration / clipDuration : 1;
  const scaledTime = localTime * timeScale;

  for (const track of clipTracks) {
    if (!track.isVisible) continue;

    // Get all properties from this track's keyframes
    const propertyKeys = new Set<keyof AnimatableProperties>();
    for (const kf of track.keyframes) {
      for (const key of Object.keys(kf.properties) as Array<keyof AnimatableProperties>) {
        propertyKeys.add(key);
      }
    }

    // Interpolate each property using scaled time
    for (const key of propertyKeys) {
      result[key] = getInterpolatedProperty(track, scaledTime, key, defaults[key]);
    }
  }

  return result;
}

/**
 * Get interpolated properties considering clips and their time ranges
 * This is the main function for animation playback with multiple clips
 *
 * When clips overlap, properties are determined by the clip that started most recently
 * (last-in takes precedence). This allows for smooth transitions between animations.
 */
export function getClipInterpolatedProperties(
  clips: AnimationClip[],
  tracks: AnimationTrack[],
  time: number,
  defaults: AnimatableProperties = DEFAULT_ANIMATABLE_PROPERTIES
): AnimatableProperties {
  const result: AnimatableProperties = { ...defaults };

  // Find all clips that are active at the current time
  const activeClips = clips.filter(clip =>
    time >= clip.startTime && time < clip.startTime + clip.duration
  );

  // If no active clips, return defaults
  if (activeClips.length === 0) {
    // Check if we're past all clips - hold the last value
    const sortedClips = [...clips].sort((a, b) =>
      (b.startTime + b.duration) - (a.startTime + a.duration)
    );

    if (sortedClips.length > 0) {
      const lastClip = sortedClips[0];
      const clipEndTime = lastClip.startTime + lastClip.duration;

      if (time >= clipEndTime) {
        // We're past all clips, hold the final state of the last clip
        const clipTracks = tracks.filter(t => t.clipId === lastClip.id && t.isVisible);
        if (clipTracks.length > 0) {
          const originalDuration = clipTracks[0].originalDuration || lastClip.duration;
          // Get properties at the end of the clip
          return getClipLocalInterpolatedProperties(
            clipTracks,
            lastClip.duration,
            originalDuration,
            lastClip.duration,
            defaults
          );
        }
      }
    }

    return result;
  }

  // Sort active clips by start time (earlier clips first)
  // Later clips (higher start time) will override properties
  const sortedActiveClips = [...activeClips].sort((a, b) => a.startTime - b.startTime);

  // Track which properties are animated by which clips
  // Later clips override earlier ones for the same property
  const propertyToClip = new Map<keyof AnimatableProperties, AnimationClip>();

  for (const clip of sortedActiveClips) {
    const clipTracks = tracks.filter(t => t.clipId === clip.id);

    // Find all properties this clip animates
    for (const track of clipTracks) {
      if (!track.isVisible) continue;

      for (const kf of track.keyframes) {
        for (const key of Object.keys(kf.properties) as Array<keyof AnimatableProperties>) {
          propertyToClip.set(key, clip);
        }
      }
    }
  }

  // Now interpolate each property from its owning clip
  for (const [property, clip] of propertyToClip) {
    const clipTracks = tracks.filter(t => t.clipId === clip.id && t.isVisible);
    const localTime = time - clip.startTime;
    const originalDuration = clipTracks[0]?.originalDuration || clip.duration;

    // Calculate time scale for stretched/compressed clips
    const timeScale = originalDuration > 0 ? originalDuration / clip.duration : 1;
    const scaledTime = localTime * timeScale;

    // Find the track that animates this property and interpolate
    for (const track of clipTracks) {
      const hasProperty = track.keyframes.some(kf =>
        property in kf.properties
      );

      if (hasProperty) {
        result[property] = getInterpolatedProperty(
          track,
          scaledTime,
          property,
          defaults[property]
        );
        break;
      }
    }
  }

  return result;
}

/**
 * Get the property value at the nearest keyframe to a given time
 */
export function getKeyframeValueAtTime<K extends keyof AnimatableProperties>(
  track: AnimationTrack,
  time: number,
  propertyKey: K,
  defaultValue: AnimatableProperties[K]
): AnimatableProperties[K] {
  const { prev, next } = findSurroundingKeyframes(track.keyframes, time);

  if (!prev && !next) return defaultValue;
  if (!prev) return next!.properties[propertyKey] ?? defaultValue;
  if (!next) return prev.properties[propertyKey] ?? defaultValue;

  // Return the closest one
  const prevDist = Math.abs(time - prev.time);
  const nextDist = Math.abs(time - next.time);

  const closest = prevDist <= nextDist ? prev : next;
  return closest.properties[propertyKey] ?? defaultValue;
}

/**
 * Check if a time position is at or very close to a keyframe
 */
export function isAtKeyframe(
  keyframes: Keyframe[],
  time: number,
  threshold: number = 50 // 50ms threshold
): Keyframe | null {
  for (const kf of keyframes) {
    if (Math.abs(kf.time - time) <= threshold) {
      return kf;
    }
  }
  return null;
}

/**
 * Snap time to nearest keyframe if within threshold
 */
export function snapToKeyframe(
  keyframes: Keyframe[],
  time: number,
  threshold: number = 50
): number {
  const nearestKf = isAtKeyframe(keyframes, time, threshold);
  return nearestKf ? nearestKf.time : time;
}

/**
 * Get all keyframe times from all tracks (for snapping)
 */
export function getAllKeyframeTimes(tracks: AnimationTrack[]): number[] {
  const times = new Set<number>();
  for (const track of tracks) {
    for (const kf of track.keyframes) {
      times.add(kf.time);
    }
  }
  return Array.from(times).sort((a, b) => a - b);
}
