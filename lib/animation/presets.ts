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
// 3D PERSPECTIVE ANIMATION PRESETS
// ============================================

export const ANIMATION_PRESETS: AnimationPreset[] = [
  // ============ REVEAL — 3D Entrance Animations ============
  {
    id: 'hero-landing',
    name: 'Hero Landing',
    description: 'Starts tilted back, lands flat with a dramatic entrance',
    category: 'reveal',
    duration: 2500,
    tracks: [
      createTrack('Hero Landing', 'transform', [
        createKeyframe(0, { rotateX: 30, scale: 0.8, perspective: 2400 }, 'linear'),
        createKeyframe(2500, { rotateX: 0, scale: 1, perspective: 2400 }, 'ease-out'),
      ]),
    ],
  },
  {
    id: 'slide-in-3d',
    name: 'Slide In 3D',
    description: 'Enters from the right with a 3D rotation',
    category: 'reveal',
    duration: 2000,
    tracks: [
      createTrack('Slide In 3D', 'transform', [
        createKeyframe(0, { rotateY: 35, translateX: 40, perspective: 2400 }, 'linear'),
        createKeyframe(2000, { rotateY: 0, translateX: 0, perspective: 2400 }, 'ease-out'),
      ]),
    ],
  },
  {
    id: 'rise-and-settle',
    name: 'Rise & Settle',
    description: 'Rises from below and settles into place',
    category: 'reveal',
    duration: 2500,
    tracks: [
      createTrack('Rise & Settle', 'transform', [
        createKeyframe(0, { translateY: 30, rotateX: -20, perspective: 2400 }, 'linear'),
        createKeyframe(2500, { translateY: 0, rotateX: 0, perspective: 2400 }, 'ease-out'),
      ]),
    ],
  },
  {
    id: 'drop-in',
    name: 'Drop In',
    description: 'Falls from above with a tilt and fades in',
    category: 'reveal',
    duration: 2000,
    tracks: [
      createTrack('Drop In', 'transform', [
        createKeyframe(0, { translateY: -25, rotateX: 15, perspective: 2400 }, 'linear'),
        createKeyframe(2000, { translateY: 0, rotateX: 0, perspective: 2400 }, 'ease-out'),
      ]),
      createTrack('Drop In Fade', 'opacity', [
        createKeyframe(0, { imageOpacity: 0 }, 'linear'),
        createKeyframe(800, { imageOpacity: 1 }, 'ease-out'),
      ]),
    ],
  },

  // ============ FLIP — Card-Flip Rotations ============
  {
    id: 'flip-x',
    name: 'Flip X',
    description: 'Full 180° flip on the X axis with scale dip',
    category: 'flip',
    duration: 2000,
    tracks: [
      createTrack('Flip X', 'transform', [
        createKeyframe(0, { rotateX: 0, scale: 1, perspective: 2400 }, 'linear'),
        createKeyframe(1000, { rotateX: 90, scale: 0.85, perspective: 2400 }, 'ease-in'),
        createKeyframe(2000, { rotateX: 180, scale: 1, perspective: 2400 }, 'ease-out'),
      ]),
    ],
  },
  {
    id: 'flip-y',
    name: 'Flip Y',
    description: 'Full 180° flip on the Y axis with scale dip',
    category: 'flip',
    duration: 2000,
    tracks: [
      createTrack('Flip Y', 'transform', [
        createKeyframe(0, { rotateY: 0, scale: 1, perspective: 2400 }, 'linear'),
        createKeyframe(1000, { rotateY: 90, scale: 0.85, perspective: 2400 }, 'ease-in'),
        createKeyframe(2000, { rotateY: 180, scale: 1, perspective: 2400 }, 'ease-out'),
      ]),
    ],
  },
  {
    id: 'peek',
    name: 'Peek',
    description: 'Rotates to peek behind the card and returns',
    category: 'flip',
    duration: 2500,
    tracks: [
      createTrack('Peek', 'transform', [
        createKeyframe(0, { rotateY: 0, perspective: 2400 }, 'linear'),
        createKeyframe(800, { rotateY: 45, perspective: 2400 }, 'ease-out'),
        createKeyframe(1700, { rotateY: 45, perspective: 2400 }, 'linear'),
        createKeyframe(2500, { rotateY: 0, perspective: 2400 }, 'ease-in-out'),
      ]),
    ],
  },

  // ============ PERSPECTIVE — Perspective Shifts & Tilts ============
  {
    id: 'showcase-tilt',
    name: 'Showcase Tilt',
    description: 'Slow pan to a product-showcase angle',
    category: 'perspective',
    duration: 3000,
    tracks: [
      createTrack('Showcase Tilt', 'transform', [
        createKeyframe(0, { rotateY: 0, rotateX: 0, perspective: 2400 }, 'linear'),
        createKeyframe(3000, { rotateY: 20, rotateX: 8, perspective: 2400 }, 'ease-in-out'),
      ]),
    ],
  },
  {
    id: 'isometric',
    name: 'Isometric',
    description: 'Shifts to an isometric viewing angle',
    category: 'perspective',
    duration: 2500,
    tracks: [
      createTrack('Isometric', 'transform', [
        createKeyframe(0, { rotateX: 0, rotateY: 0, scale: 1, perspective: 2400 }, 'linear'),
        createKeyframe(2500, { rotateX: 25, rotateY: -25, scale: 0.9, perspective: 2400 }, 'ease-in-out'),
      ]),
    ],
  },
  {
    id: 'hover-float',
    name: 'Hover Float',
    description: 'Subtle floating motion with gentle oscillation',
    category: 'perspective',
    duration: 3000,
    tracks: [
      createTrack('Hover Float', 'transform', [
        createKeyframe(0, { rotateX: 0, translateY: 0, scale: 1, perspective: 2400 }, 'linear'),
        createKeyframe(750, { rotateX: 5, translateY: -4, scale: 1.02, perspective: 2400 }, 'ease-in-out'),
        createKeyframe(1500, { rotateX: 0, translateY: 0, scale: 1, perspective: 2400 }, 'ease-in-out'),
        createKeyframe(2250, { rotateX: -5, translateY: 4, scale: 1.02, perspective: 2400 }, 'ease-in-out'),
        createKeyframe(3000, { rotateX: 0, translateY: 0, scale: 1, perspective: 2400 }, 'ease-in-out'),
      ]),
    ],
  },
  {
    id: 'parallax-drift',
    name: 'Parallax Drift',
    description: 'Slow drift with perspective tightening for depth',
    category: 'perspective',
    duration: 3500,
    tracks: [
      createTrack('Parallax Drift', 'transform', [
        createKeyframe(0, { translateX: -8, perspective: 2400, rotateY: -5 }, 'linear'),
        createKeyframe(3500, { translateX: 8, perspective: 1200, rotateY: 5 }, 'ease-in-out'),
      ]),
    ],
  },

  // ============ ORBIT — 3D Rotational Movements ============
  {
    id: 'orbit-left',
    name: 'Orbit Left',
    description: 'Smooth orbital arc to the left and back',
    category: 'orbit',
    duration: 3000,
    tracks: [
      createTrack('Orbit Left', 'transform', [
        createKeyframe(0, { rotateY: 0, scale: 1, perspective: 2400 }, 'linear'),
        createKeyframe(1500, { rotateY: -30, scale: 0.95, perspective: 2400 }, 'ease-in-out'),
        createKeyframe(3000, { rotateY: 0, scale: 1, perspective: 2400 }, 'ease-in-out'),
      ]),
    ],
  },
  {
    id: 'orbit-right',
    name: 'Orbit Right',
    description: 'Smooth orbital arc to the right and back',
    category: 'orbit',
    duration: 3000,
    tracks: [
      createTrack('Orbit Right', 'transform', [
        createKeyframe(0, { rotateY: 0, scale: 1, perspective: 2400 }, 'linear'),
        createKeyframe(1500, { rotateY: 30, scale: 0.95, perspective: 2400 }, 'ease-in-out'),
        createKeyframe(3000, { rotateY: 0, scale: 1, perspective: 2400 }, 'ease-in-out'),
      ]),
    ],
  },
  {
    id: 'turntable',
    name: 'Turntable',
    description: 'Full 360° rotation like a turntable display',
    category: 'orbit',
    duration: 3000,
    tracks: [
      createTrack('Turntable', 'transform', [
        createKeyframe(0, { rotateY: 0, scale: 0.9, perspective: 2400 }, 'linear'),
        createKeyframe(3000, { rotateY: 360, scale: 0.9, perspective: 2400 }, 'linear'),
      ]),
    ],
  },

  // ============ DEPTH — Z-Depth & Scale Effects ============
  {
    id: 'push-away',
    name: 'Push Away',
    description: 'Pushes the image away with tightening perspective',
    category: 'depth',
    duration: 2500,
    tracks: [
      createTrack('Push Away', 'transform', [
        createKeyframe(0, { scale: 1, perspective: 2400, rotateX: 0 }, 'linear'),
        createKeyframe(2500, { scale: 0.7, perspective: 1400, rotateX: 10 }, 'ease-in-out'),
      ]),
    ],
  },
  {
    id: 'pull-close',
    name: 'Pull Close',
    description: 'Pulls the image closer with loosening perspective',
    category: 'depth',
    duration: 2500,
    tracks: [
      createTrack('Pull Close', 'transform', [
        createKeyframe(0, { scale: 0.7, perspective: 1400, rotateX: -5 }, 'linear'),
        createKeyframe(2500, { scale: 1.05, perspective: 2400, rotateX: 0 }, 'ease-out'),
      ]),
    ],
  },
  {
    id: 'dramatic-zoom',
    name: 'Dramatic Zoom',
    description: 'Dramatic zoom with deep perspective shift',
    category: 'depth',
    duration: 2000,
    tracks: [
      createTrack('Dramatic Zoom', 'transform', [
        createKeyframe(0, { scale: 0.6, perspective: 1000 }, 'linear'),
        createKeyframe(2000, { scale: 1.1, perspective: 2400 }, 'ease-out-cubic'),
      ]),
    ],
  },
  {
    id: 'breathe-3d',
    name: 'Breathe 3D',
    description: 'Gentle breathing motion with 3D rotation',
    category: 'depth',
    duration: 3000,
    tracks: [
      createTrack('Breathe 3D', 'transform', [
        createKeyframe(0, { scale: 1, rotateX: 0, rotateY: 0, perspective: 2400 }, 'linear'),
        createKeyframe(1500, { scale: 1.05, rotateX: 3, rotateY: -3, perspective: 2400 }, 'ease-in-out'),
        createKeyframe(3000, { scale: 1, rotateX: 0, rotateY: 0, perspective: 2400 }, 'ease-in-out'),
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
  reveal: 'Reveal',
  flip: 'Flip',
  perspective: 'Perspective',
  orbit: 'Orbit',
  depth: 'Depth',
};
