import type {
  AnimationPreset,
  AnimationTrack,
  Keyframe,
  EasingFunction,
  AnimatableProperties,
} from '@/types/animation';

// Helper to generate unique IDs
let idCounter = 0;
function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${++idCounter}`;
}

// Helper to create a keyframe
function createKeyframe(
  time: number,
  properties: Partial<AnimatableProperties>,
  easing: EasingFunction = 'ease-out'
): Keyframe {
  return {
    id: generateId('kf'),
    time,
    properties,
    easing,
  };
}

// Helper to create a track
function createTrack(
  name: string,
  type: 'transform' | 'opacity',
  keyframes: Keyframe[]
): AnimationTrack {
  return {
    id: generateId('track'),
    name,
    type,
    keyframes,
    isLocked: false,
    isVisible: true,
  };
}

// ============================================
// ANIMATION PRESETS
// ============================================

export const ANIMATION_PRESETS: AnimationPreset[] = [
  // ============ ZOOM PRESETS ============
  {
    id: 'zoom-in',
    name: 'Zoom In',
    description: 'Smooth zoom from far to close',
    category: 'zoom',
    duration: 2000,
    tracks: [
      createTrack('Zoom', 'transform', [
        createKeyframe(0, { scale: 0.7, perspective: 2400 }, 'linear'),
        createKeyframe(2000, { scale: 1.1, perspective: 2400 }, 'ease-out'),
      ]),
    ],
  },
  {
    id: 'zoom-out',
    name: 'Zoom Out',
    description: 'Smooth zoom from close to far',
    category: 'zoom',
    duration: 2000,
    tracks: [
      createTrack('Zoom', 'transform', [
        createKeyframe(0, { scale: 1.2, perspective: 2400 }, 'linear'),
        createKeyframe(2000, { scale: 0.85, perspective: 2400 }, 'ease-out'),
      ]),
    ],
  },
  {
    id: 'zoom-pulse',
    name: 'Zoom Pulse',
    description: 'Subtle zoom in and out',
    category: 'zoom',
    duration: 3000,
    tracks: [
      createTrack('Zoom', 'transform', [
        createKeyframe(0, { scale: 1 }, 'linear'),
        createKeyframe(1500, { scale: 1.08 }, 'ease-in-out'),
        createKeyframe(3000, { scale: 1 }, 'ease-in-out'),
      ]),
    ],
  },

  // ============ PAN PRESETS ============
  {
    id: 'pan-left',
    name: 'Pan Left',
    description: 'Smooth horizontal pan to the left',
    category: 'pan',
    duration: 2500,
    tracks: [
      createTrack('Pan', 'transform', [
        createKeyframe(0, { translateX: 8, scale: 1.1 }, 'linear'),
        createKeyframe(2500, { translateX: -8, scale: 1.1 }, 'ease-out'),
      ]),
    ],
  },
  {
    id: 'pan-right',
    name: 'Pan Right',
    description: 'Smooth horizontal pan to the right',
    category: 'pan',
    duration: 2500,
    tracks: [
      createTrack('Pan', 'transform', [
        createKeyframe(0, { translateX: -8, scale: 1.1 }, 'linear'),
        createKeyframe(2500, { translateX: 8, scale: 1.1 }, 'ease-out'),
      ]),
    ],
  },
  {
    id: 'pan-up',
    name: 'Pan Up',
    description: 'Smooth vertical pan upward',
    category: 'pan',
    duration: 2500,
    tracks: [
      createTrack('Pan', 'transform', [
        createKeyframe(0, { translateY: 10, scale: 1.15 }, 'linear'),
        createKeyframe(2500, { translateY: -10, scale: 1.15 }, 'ease-out'),
      ]),
    ],
  },
  {
    id: 'pan-down',
    name: 'Pan Down',
    description: 'Smooth vertical pan downward',
    category: 'pan',
    duration: 2500,
    tracks: [
      createTrack('Pan', 'transform', [
        createKeyframe(0, { translateY: -10, scale: 1.15 }, 'linear'),
        createKeyframe(2500, { translateY: 10, scale: 1.15 }, 'ease-out'),
      ]),
    ],
  },

  // ============ KEN BURNS PRESETS ============
  {
    id: 'ken-burns-1',
    name: 'Ken Burns Classic',
    description: 'Slow zoom with gentle pan (documentary style)',
    category: 'ken-burns',
    duration: 4000,
    tracks: [
      createTrack('Ken Burns', 'transform', [
        createKeyframe(0, { scale: 1, translateX: -5, translateY: -3 }, 'linear'),
        createKeyframe(4000, { scale: 1.15, translateX: 5, translateY: 3 }, 'ease-out'),
      ]),
    ],
  },
  {
    id: 'ken-burns-2',
    name: 'Ken Burns Reverse',
    description: 'Slow zoom out with gentle pan',
    category: 'ken-burns',
    duration: 4000,
    tracks: [
      createTrack('Ken Burns', 'transform', [
        createKeyframe(0, { scale: 1.2, translateX: 6, translateY: 4 }, 'linear'),
        createKeyframe(4000, { scale: 1, translateX: -4, translateY: -2 }, 'ease-out'),
      ]),
    ],
  },

  // ============ 3D TILT PRESETS ============
  {
    id: 'tilt-left',
    name: '3D Tilt Left',
    description: 'Rotate to show left side',
    category: 'tilt',
    duration: 2000,
    tracks: [
      createTrack('Tilt', 'transform', [
        createKeyframe(0, { rotateY: 0, rotateX: 0, perspective: 2400 }, 'linear'),
        createKeyframe(2000, { rotateY: -25, rotateX: 5, perspective: 2400 }, 'ease-out'),
      ]),
    ],
  },
  {
    id: 'tilt-right',
    name: '3D Tilt Right',
    description: 'Rotate to show right side',
    category: 'tilt',
    duration: 2000,
    tracks: [
      createTrack('Tilt', 'transform', [
        createKeyframe(0, { rotateY: 0, rotateX: 0, perspective: 2400 }, 'linear'),
        createKeyframe(2000, { rotateY: 25, rotateX: 5, perspective: 2400 }, 'ease-out'),
      ]),
    ],
  },
  {
    id: 'tilt-forward',
    name: '3D Tilt Forward',
    description: 'Tilt image forward',
    category: 'tilt',
    duration: 2000,
    tracks: [
      createTrack('Tilt', 'transform', [
        createKeyframe(0, { rotateX: 0, perspective: 2400 }, 'linear'),
        createKeyframe(2000, { rotateX: -20, perspective: 2400 }, 'ease-out'),
      ]),
    ],
  },
  {
    id: 'tilt-back',
    name: '3D Tilt Back',
    description: 'Tilt image backward',
    category: 'tilt',
    duration: 2000,
    tracks: [
      createTrack('Tilt', 'transform', [
        createKeyframe(0, { rotateX: 0, perspective: 2400 }, 'linear'),
        createKeyframe(2000, { rotateX: 20, perspective: 2400 }, 'ease-out'),
      ]),
    ],
  },

  // ============ ROTATE PRESETS ============
  {
    id: 'rotate-cw',
    name: 'Rotate Clockwise',
    description: 'Gentle clockwise rotation',
    category: 'rotate',
    duration: 3000,
    tracks: [
      createTrack('Rotate', 'transform', [
        createKeyframe(0, { rotateZ: -5 }, 'linear'),
        createKeyframe(3000, { rotateZ: 5 }, 'ease-in-out'),
      ]),
    ],
  },
  {
    id: 'rotate-ccw',
    name: 'Rotate Counter-CW',
    description: 'Gentle counter-clockwise rotation',
    category: 'rotate',
    duration: 3000,
    tracks: [
      createTrack('Rotate', 'transform', [
        createKeyframe(0, { rotateZ: 5 }, 'linear'),
        createKeyframe(3000, { rotateZ: -5 }, 'ease-in-out'),
      ]),
    ],
  },
  {
    id: 'spin-360',
    name: 'Full Spin',
    description: 'Complete 360 degree rotation',
    category: 'rotate',
    duration: 2000,
    tracks: [
      createTrack('Spin', 'transform', [
        createKeyframe(0, { rotateZ: 0, scale: 0.9 }, 'linear'),
        createKeyframe(2000, { rotateZ: 360, scale: 0.9 }, 'ease-in-out'),
      ]),
    ],
  },

  // ============ FADE PRESETS ============
  {
    id: 'fade-in',
    name: 'Fade In',
    description: 'Fade from transparent to opaque',
    category: 'fade',
    duration: 1500,
    tracks: [
      createTrack('Fade', 'opacity', [
        createKeyframe(0, { imageOpacity: 0 }, 'linear'),
        createKeyframe(1500, { imageOpacity: 1 }, 'ease-out'),
      ]),
    ],
  },
  {
    id: 'fade-out',
    name: 'Fade Out',
    description: 'Fade from opaque to transparent',
    category: 'fade',
    duration: 1500,
    tracks: [
      createTrack('Fade', 'opacity', [
        createKeyframe(0, { imageOpacity: 1 }, 'linear'),
        createKeyframe(1500, { imageOpacity: 0 }, 'ease-out'),
      ]),
    ],
  },
  {
    id: 'fade-pulse',
    name: 'Fade Pulse',
    description: 'Subtle opacity pulse effect',
    category: 'fade',
    duration: 2000,
    tracks: [
      createTrack('Fade', 'opacity', [
        createKeyframe(0, { imageOpacity: 1 }, 'linear'),
        createKeyframe(1000, { imageOpacity: 0.7 }, 'ease-in-out'),
        createKeyframe(2000, { imageOpacity: 1 }, 'ease-in-out'),
      ]),
    ],
  },
];

// Get presets by category
export function getPresetsByCategory(category: AnimationPreset['category']): AnimationPreset[] {
  return ANIMATION_PRESETS.filter((preset) => preset.category === category);
}

// Get all preset categories
export function getPresetCategories(): AnimationPreset['category'][] {
  const categories = new Set(ANIMATION_PRESETS.map((p) => p.category));
  return Array.from(categories);
}

// Clone a preset's tracks with new IDs (for applying to timeline)
// Optionally offset keyframe times by startTime and link to a clipId
export function clonePresetTracks(
  preset: AnimationPreset,
  options?: { startTime?: number; clipId?: string }
): AnimationTrack[] {
  const { startTime = 0, clipId } = options || {};

  return preset.tracks.map((track) => ({
    ...track,
    id: generateId('track'),
    clipId,
    originalDuration: preset.duration,
    keyframes: track.keyframes.map((kf) => ({
      ...kf,
      id: generateId('kf'),
      // Offset keyframe time by the clip's start time
      time: kf.time + startTime,
    })),
  }));
}

// Get preset by ID
export function getPresetById(id: string): AnimationPreset | undefined {
  return ANIMATION_PRESETS.find((p) => p.id === id);
}

// Category display names
export const CATEGORY_LABELS: Record<AnimationPreset['category'], string> = {
  zoom: 'Zoom',
  pan: 'Pan',
  tilt: '3D Tilt',
  rotate: 'Rotate',
  'ken-burns': 'Ken Burns',
  fade: 'Fade',
  custom: 'Custom',
};
