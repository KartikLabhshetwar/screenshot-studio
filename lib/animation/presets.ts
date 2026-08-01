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
// Follows Emil Kowalski's animation best practices:
// - ease-out as default easing for entrances
// - ease-in-out for on-screen movement
// - Never animate from scale(0), minimum scale(0.95)
// - Keep entrance animations snappy (800-1200ms)
// - Use cubic/expo easing for snappier feel
// ============================================

export const ANIMATION_PRESETS: AnimationPreset[] = [
  // ============ REVEAL — 3D Entrance Animations ============
  {
    id: 'hero-landing',
    name: 'Hero Landing',
    description: 'Starts tilted back, lands flat — classic SaaS hero entrance',
    category: 'reveal',
    duration: 1200,
    tracks: [
      createTrack('Hero Landing', 'transform', [
        createKeyframe(0, { rotateX: 25, scale: 0.95, perspective: 2400 }, 'ease-out'),
        createKeyframe(1200, { rotateX: 0, scale: 1, perspective: 2400 }, 'ease-out-cubic'),
      ]),
      createTrack('Hero Landing Fade', 'opacity', [
        createKeyframe(0, { imageOpacity: 0 }, 'ease-out'),
        createKeyframe(600, { imageOpacity: 1 }, 'ease-out'),
      ]),
    ],
  },
  {
    id: 'slide-in-3d',
    name: 'Slide In 3D',
    description: 'Enters from the right with a 3D rotation',
    category: 'reveal',
    duration: 1000,
    tracks: [
      createTrack('Slide In 3D', 'transform', [
        createKeyframe(0, { rotateY: 30, translateX: 35, perspective: 2400 }, 'ease-out'),
        createKeyframe(1000, { rotateY: 0, translateX: 0, perspective: 2400 }, 'ease-out-cubic'),
      ]),
      createTrack('Slide In 3D Fade', 'opacity', [
        createKeyframe(0, { imageOpacity: 0 }, 'ease-out'),
        createKeyframe(500, { imageOpacity: 1 }, 'ease-out'),
      ]),
    ],
  },
  {
    id: 'rise-and-settle',
    name: 'Rise & Settle',
    description: 'Rises from below and settles into place',
    category: 'reveal',
    duration: 1000,
    tracks: [
      createTrack('Rise & Settle', 'transform', [
        createKeyframe(0, { translateY: 25, rotateX: -15, perspective: 2400, scale: 0.97 }, 'ease-out'),
        createKeyframe(1000, { translateY: 0, rotateX: 0, perspective: 2400, scale: 1 }, 'ease-out-cubic'),
      ]),
      createTrack('Rise & Settle Fade', 'opacity', [
        createKeyframe(0, { imageOpacity: 0 }, 'ease-out'),
        createKeyframe(500, { imageOpacity: 1 }, 'ease-out'),
      ]),
    ],
  },
  {
    id: 'drop-in',
    name: 'Drop In',
    description: 'Falls from above with a tilt and fades in',
    category: 'reveal',
    duration: 1000,
    tracks: [
      createTrack('Drop In', 'transform', [
        createKeyframe(0, { translateY: -20, rotateX: 12, perspective: 2400, scale: 0.97 }, 'ease-out'),
        createKeyframe(1000, { translateY: 0, rotateX: 0, perspective: 2400, scale: 1 }, 'ease-out-cubic'),
      ]),
      createTrack('Drop In Fade', 'opacity', [
        createKeyframe(0, { imageOpacity: 0 }, 'ease-out'),
        createKeyframe(500, { imageOpacity: 1 }, 'ease-out'),
      ]),
    ],
  },

  // ============ SLIDE — Clean Slide Entrances ============
  {
    id: 'slide-up',
    name: 'Slide Up',
    description: 'Smooth upward entrance with fade',
    category: 'slide',
    duration: 800,
    tracks: [
      createTrack('Slide Up', 'transform', [
        createKeyframe(0, { translateY: 30, perspective: 2400 }, 'ease-out'),
        createKeyframe(800, { translateY: 0, perspective: 2400 }, 'ease-out-cubic'),
      ]),
      createTrack('Slide Up Fade', 'opacity', [
        createKeyframe(0, { imageOpacity: 0 }, 'ease-out'),
        createKeyframe(400, { imageOpacity: 1 }, 'ease-out'),
      ]),
    ],
  },
  {
    id: 'slide-down',
    name: 'Slide Down',
    description: 'Smooth downward entrance with fade',
    category: 'slide',
    duration: 800,
    tracks: [
      createTrack('Slide Down', 'transform', [
        createKeyframe(0, { translateY: -30, perspective: 2400 }, 'ease-out'),
        createKeyframe(800, { translateY: 0, perspective: 2400 }, 'ease-out-cubic'),
      ]),
      createTrack('Slide Down Fade', 'opacity', [
        createKeyframe(0, { imageOpacity: 0 }, 'ease-out'),
        createKeyframe(400, { imageOpacity: 1 }, 'ease-out'),
      ]),
    ],
  },
  {
    id: 'slide-left',
    name: 'Slide Left',
    description: 'Enters from the right, slides left',
    category: 'slide',
    duration: 800,
    tracks: [
      createTrack('Slide Left', 'transform', [
        createKeyframe(0, { translateX: 35, perspective: 2400 }, 'ease-out'),
        createKeyframe(800, { translateX: 0, perspective: 2400 }, 'ease-out-cubic'),
      ]),
      createTrack('Slide Left Fade', 'opacity', [
        createKeyframe(0, { imageOpacity: 0 }, 'ease-out'),
        createKeyframe(400, { imageOpacity: 1 }, 'ease-out'),
      ]),
    ],
  },
  {
    id: 'slide-right',
    name: 'Slide Right',
    description: 'Enters from the left, slides right',
    category: 'slide',
    duration: 800,
    tracks: [
      createTrack('Slide Right', 'transform', [
        createKeyframe(0, { translateX: -35, perspective: 2400 }, 'ease-out'),
        createKeyframe(800, { translateX: 0, perspective: 2400 }, 'ease-out-cubic'),
      ]),
      createTrack('Slide Right Fade', 'opacity', [
        createKeyframe(0, { imageOpacity: 0 }, 'ease-out'),
        createKeyframe(400, { imageOpacity: 1 }, 'ease-out'),
      ]),
    ],
  },

  // ============ FADE — Opacity-focused Entrances ============
  {
    id: 'fade-in',
    name: 'Fade In',
    description: 'Simple clean fade in',
    category: 'fade',
    duration: 800,
    tracks: [
      createTrack('Fade In', 'opacity', [
        createKeyframe(0, { imageOpacity: 0 }, 'ease-out'),
        createKeyframe(800, { imageOpacity: 1 }, 'ease-out'),
      ]),
    ],
  },
  {
    id: 'fade-scale',
    name: 'Fade Scale',
    description: 'Fades in with a subtle scale-up — popular app entrance',
    category: 'fade',
    duration: 800,
    tracks: [
      createTrack('Fade Scale', 'transform', [
        createKeyframe(0, { scale: 0.96, perspective: 2400 }, 'ease-out'),
        createKeyframe(800, { scale: 1, perspective: 2400 }, 'ease-out-cubic'),
      ]),
      createTrack('Fade Scale Opacity', 'opacity', [
        createKeyframe(0, { imageOpacity: 0 }, 'ease-out'),
        createKeyframe(600, { imageOpacity: 1 }, 'ease-out'),
      ]),
    ],
  },
  {
    id: 'fade-rise',
    name: 'Fade Rise',
    description: 'Fades in while rising slightly — minimal and elegant',
    category: 'fade',
    duration: 800,
    tracks: [
      createTrack('Fade Rise', 'transform', [
        createKeyframe(0, { translateY: 12, scale: 0.98, perspective: 2400 }, 'ease-out'),
        createKeyframe(800, { translateY: 0, scale: 1, perspective: 2400 }, 'ease-out-cubic'),
      ]),
      createTrack('Fade Rise Opacity', 'opacity', [
        createKeyframe(0, { imageOpacity: 0 }, 'ease-out'),
        createKeyframe(600, { imageOpacity: 1 }, 'ease-out'),
      ]),
    ],
  },
  {
    id: 'fade-zoom-out',
    name: 'Fade Zoom Out',
    description: 'Fades in while zooming out from close-up',
    category: 'fade',
    duration: 1000,
    tracks: [
      createTrack('Fade Zoom Out', 'transform', [
        createKeyframe(0, { scale: 1.08, perspective: 2400 }, 'ease-out'),
        createKeyframe(1000, { scale: 1, perspective: 2400 }, 'ease-out-cubic'),
      ]),
      createTrack('Fade Zoom Out Opacity', 'opacity', [
        createKeyframe(0, { imageOpacity: 0 }, 'ease-out'),
        createKeyframe(600, { imageOpacity: 1 }, 'ease-out'),
      ]),
    ],
  },

  // ============ FLIP — Card-Flip Rotations ============
  {
    id: 'flip-x',
    name: 'Flip X',
    description: 'Full 180° flip on the X axis with scale dip',
    category: 'flip',
    duration: 1500,
    tracks: [
      createTrack('Flip X', 'transform', [
        createKeyframe(0, { rotateX: 0, scale: 1, perspective: 2400 }, 'ease-out'),
        createKeyframe(750, { rotateX: 90, scale: 0.95, perspective: 2400 }, 'ease-in'),
        createKeyframe(1500, { rotateX: 180, scale: 1, perspective: 2400 }, 'ease-out'),
      ]),
    ],
  },
  {
    id: 'flip-y',
    name: 'Flip Y',
    description: 'Full 180° flip on the Y axis with scale dip',
    category: 'flip',
    duration: 1500,
    tracks: [
      createTrack('Flip Y', 'transform', [
        createKeyframe(0, { rotateY: 0, scale: 1, perspective: 2400 }, 'ease-out'),
        createKeyframe(750, { rotateY: 90, scale: 0.95, perspective: 2400 }, 'ease-in'),
        createKeyframe(1500, { rotateY: 180, scale: 1, perspective: 2400 }, 'ease-out'),
      ]),
    ],
  },
  {
    id: 'peek',
    name: 'Peek',
    description: 'Rotates to peek behind the card and returns',
    category: 'flip',
    duration: 2000,
    tracks: [
      createTrack('Peek', 'transform', [
        createKeyframe(0, { rotateY: 0, perspective: 2400 }, 'ease-out'),
        createKeyframe(600, { rotateY: 35, perspective: 2400 }, 'ease-out-cubic'),
        createKeyframe(1400, { rotateY: 35, perspective: 2400 }, 'ease-in-out'),
        createKeyframe(2000, { rotateY: 0, perspective: 2400 }, 'ease-out-cubic'),
      ]),
    ],
  },
  {
    id: 'flip-reveal',
    name: 'Flip Reveal',
    description: 'Starts flipped, rotates to reveal with a bounce',
    category: 'flip',
    duration: 1200,
    tracks: [
      createTrack('Flip Reveal', 'transform', [
        createKeyframe(0, { rotateY: -90, scale: 0.95, perspective: 2400 }, 'ease-out'),
        createKeyframe(800, { rotateY: 5, scale: 1.02, perspective: 2400 }, 'ease-out-cubic'),
        createKeyframe(1200, { rotateY: 0, scale: 1, perspective: 2400 }, 'ease-in-out'),
      ]),
      createTrack('Flip Reveal Fade', 'opacity', [
        createKeyframe(0, { imageOpacity: 0 }, 'ease-out'),
        createKeyframe(400, { imageOpacity: 1 }, 'ease-out'),
      ]),
    ],
  },

  // ============ PERSPECTIVE — Perspective Shifts & Tilts ============
  {
    id: 'showcase-tilt',
    name: 'Showcase Tilt',
    description: 'Slow pan to a product-showcase angle',
    category: 'perspective',
    duration: 2500,
    tracks: [
      createTrack('Showcase Tilt', 'transform', [
        createKeyframe(0, { rotateY: 0, rotateX: 0, perspective: 2400 }, 'ease-in-out'),
        createKeyframe(2500, { rotateY: 18, rotateX: 6, perspective: 2400 }, 'ease-in-out'),
      ]),
    ],
  },
  {
    id: 'isometric',
    name: 'Isometric',
    description: 'Shifts to an isometric viewing angle',
    category: 'perspective',
    duration: 2000,
    tracks: [
      createTrack('Isometric', 'transform', [
        createKeyframe(0, { rotateX: 0, rotateY: 0, scale: 1, perspective: 2400 }, 'ease-in-out'),
        createKeyframe(2000, { rotateX: 22, rotateY: -22, scale: 0.95, perspective: 2400 }, 'ease-in-out'),
      ]),
    ],
  },
  {
    id: 'hover-float',
    name: 'Hover Float',
    description: 'Subtle floating motion — great for looping ambient effects',
    category: 'perspective',
    duration: 3000,
    tracks: [
      createTrack('Hover Float', 'transform', [
        createKeyframe(0, { rotateX: 0, translateY: 0, scale: 1, perspective: 2400 }, 'ease-in-out'),
        createKeyframe(750, { rotateX: 4, translateY: -3, scale: 1.01, perspective: 2400 }, 'ease-in-out'),
        createKeyframe(1500, { rotateX: 0, translateY: 0, scale: 1, perspective: 2400 }, 'ease-in-out'),
        createKeyframe(2250, { rotateX: -4, translateY: 3, scale: 1.01, perspective: 2400 }, 'ease-in-out'),
        createKeyframe(3000, { rotateX: 0, translateY: 0, scale: 1, perspective: 2400 }, 'ease-in-out'),
      ]),
    ],
  },
  {
    id: 'parallax-drift',
    name: 'Parallax Drift',
    description: 'Slow drift with perspective tightening for depth',
    category: 'perspective',
    duration: 3000,
    tracks: [
      createTrack('Parallax Drift', 'transform', [
        createKeyframe(0, { translateX: -6, perspective: 2400, rotateY: -4 }, 'ease-in-out'),
        createKeyframe(3000, { translateX: 6, perspective: 1600, rotateY: 4 }, 'ease-in-out'),
      ]),
    ],
  },
  {
    id: 'apple-showcase',
    name: 'Apple Showcase',
    description: 'Clean Apple-style product reveal with tilt and scale',
    category: 'perspective',
    duration: 1500,
    tracks: [
      createTrack('Apple Showcase', 'transform', [
        createKeyframe(0, { rotateX: 20, rotateY: -15, scale: 0.96, perspective: 2400 }, 'ease-out'),
        createKeyframe(1500, { rotateX: 5, rotateY: -8, scale: 1, perspective: 2400 }, 'ease-out-cubic'),
      ]),
      createTrack('Apple Showcase Fade', 'opacity', [
        createKeyframe(0, { imageOpacity: 0 }, 'ease-out'),
        createKeyframe(600, { imageOpacity: 1 }, 'ease-out'),
      ]),
    ],
  },

  // ============ ORBIT — 3D Rotational Movements ============
  {
    id: 'orbit-left',
    name: 'Orbit Left',
    description: 'Smooth orbital arc to the left and back',
    category: 'orbit',
    duration: 2500,
    tracks: [
      createTrack('Orbit Left', 'transform', [
        createKeyframe(0, { rotateY: 0, scale: 1, perspective: 2400 }, 'ease-in-out'),
        createKeyframe(1250, { rotateY: -25, scale: 0.97, perspective: 2400 }, 'ease-in-out'),
        createKeyframe(2500, { rotateY: 0, scale: 1, perspective: 2400 }, 'ease-in-out'),
      ]),
    ],
  },
  {
    id: 'orbit-right',
    name: 'Orbit Right',
    description: 'Smooth orbital arc to the right and back',
    category: 'orbit',
    duration: 2500,
    tracks: [
      createTrack('Orbit Right', 'transform', [
        createKeyframe(0, { rotateY: 0, scale: 1, perspective: 2400 }, 'ease-in-out'),
        createKeyframe(1250, { rotateY: 25, scale: 0.97, perspective: 2400 }, 'ease-in-out'),
        createKeyframe(2500, { rotateY: 0, scale: 1, perspective: 2400 }, 'ease-in-out'),
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
        createKeyframe(0, { rotateY: 0, scale: 0.95, perspective: 2400 }, 'linear'),
        createKeyframe(3000, { rotateY: 360, scale: 0.95, perspective: 2400 }, 'linear'),
      ]),
    ],
  },
  {
    id: 'swing',
    name: 'Swing',
    description: 'Pendulum swing with slight rotation',
    category: 'orbit',
    duration: 2000,
    tracks: [
      createTrack('Swing', 'transform', [
        createKeyframe(0, { rotateZ: 0, rotateY: 0, perspective: 2400 }, 'ease-in-out'),
        createKeyframe(500, { rotateZ: -8, rotateY: -10, perspective: 2400 }, 'ease-in-out'),
        createKeyframe(1000, { rotateZ: 0, rotateY: 0, perspective: 2400 }, 'ease-in-out'),
        createKeyframe(1500, { rotateZ: 6, rotateY: 8, perspective: 2400 }, 'ease-in-out'),
        createKeyframe(2000, { rotateZ: 0, rotateY: 0, perspective: 2400 }, 'ease-in-out'),
      ]),
    ],
  },

  // ============ DEPTH — Z-Depth & Scale Effects ============
  {
    id: 'push-away',
    name: 'Push Away',
    description: 'Pushes the image away with tightening perspective',
    category: 'depth',
    duration: 2000,
    tracks: [
      createTrack('Push Away', 'transform', [
        createKeyframe(0, { scale: 1, perspective: 2400, rotateX: 0 }, 'ease-in-out'),
        createKeyframe(2000, { scale: 0.85, perspective: 1600, rotateX: 8 }, 'ease-in-out'),
      ]),
    ],
  },
  {
    id: 'pull-close',
    name: 'Pull Close',
    description: 'Pulls the image closer with loosening perspective',
    category: 'depth',
    duration: 1200,
    tracks: [
      createTrack('Pull Close', 'transform', [
        createKeyframe(0, { scale: 0.95, perspective: 1800, rotateX: -4 }, 'ease-out'),
        createKeyframe(1200, { scale: 1.03, perspective: 2400, rotateX: 0 }, 'ease-out-cubic'),
      ]),
    ],
  },
  {
    id: 'dramatic-zoom',
    name: 'Dramatic Zoom',
    description: 'Dramatic zoom with deep perspective shift',
    category: 'depth',
    duration: 1200,
    tracks: [
      createTrack('Dramatic Zoom', 'transform', [
        createKeyframe(0, { scale: 0.95, perspective: 1400 }, 'ease-out'),
        createKeyframe(1200, { scale: 1.08, perspective: 2400 }, 'ease-out-cubic'),
      ]),
      createTrack('Dramatic Zoom Fade', 'opacity', [
        createKeyframe(0, { imageOpacity: 0 }, 'ease-out'),
        createKeyframe(500, { imageOpacity: 1 }, 'ease-out'),
      ]),
    ],
  },
  {
    id: 'breathe-3d',
    name: 'Breathe 3D',
    description: 'Gentle breathing motion with 3D rotation — great for loops',
    category: 'depth',
    duration: 3000,
    tracks: [
      createTrack('Breathe 3D', 'transform', [
        createKeyframe(0, { scale: 1, rotateX: 0, rotateY: 0, perspective: 2400 }, 'ease-in-out'),
        createKeyframe(1500, { scale: 1.03, rotateX: 2, rotateY: -2, perspective: 2400 }, 'ease-in-out'),
        createKeyframe(3000, { scale: 1, rotateX: 0, rotateY: 0, perspective: 2400 }, 'ease-in-out'),
      ]),
    ],
  },

  // ============ KEN BURNS — Cinematic Pan & Zoom ============
  {
    id: 'kenburns-zoom-in',
    name: 'Zoom In',
    description: 'Slow cinematic zoom in — classic Ken Burns effect',
    category: 'kenburns',
    duration: 4000,
    tracks: [
      createTrack('Ken Burns Zoom In', 'transform', [
        createKeyframe(0, { scale: 1, translateX: 0, translateY: 0, perspective: 2400 }, 'ease-in-out'),
        createKeyframe(4000, { scale: 1.15, translateX: 3, translateY: -2, perspective: 2400 }, 'ease-in-out'),
      ]),
    ],
  },
  {
    id: 'kenburns-zoom-out',
    name: 'Zoom Out',
    description: 'Slow zoom out to reveal the full image',
    category: 'kenburns',
    duration: 4000,
    tracks: [
      createTrack('Ken Burns Zoom Out', 'transform', [
        createKeyframe(0, { scale: 1.12, translateX: -3, translateY: 2, perspective: 2400 }, 'ease-in-out'),
        createKeyframe(4000, { scale: 1, translateX: 0, translateY: 0, perspective: 2400 }, 'ease-in-out'),
      ]),
    ],
  },
  {
    id: 'kenburns-pan-left',
    name: 'Pan Left',
    description: 'Slow cinematic pan to the left with subtle zoom',
    category: 'kenburns',
    duration: 4000,
    tracks: [
      createTrack('Ken Burns Pan Left', 'transform', [
        createKeyframe(0, { translateX: 8, scale: 1.05, perspective: 2400 }, 'ease-in-out'),
        createKeyframe(4000, { translateX: -8, scale: 1.08, perspective: 2400 }, 'ease-in-out'),
      ]),
    ],
  },
  {
    id: 'kenburns-pan-right',
    name: 'Pan Right',
    description: 'Slow cinematic pan to the right with subtle zoom',
    category: 'kenburns',
    duration: 4000,
    tracks: [
      createTrack('Ken Burns Pan Right', 'transform', [
        createKeyframe(0, { translateX: -8, scale: 1.05, perspective: 2400 }, 'ease-in-out'),
        createKeyframe(4000, { translateX: 8, scale: 1.08, perspective: 2400 }, 'ease-in-out'),
      ]),
    ],
  },

  // ============ BOUNCE — Springy, Playful Entrances ============
  {
    id: 'bounce-in',
    name: 'Bounce In',
    description: 'Springy bounce entrance with overshoot',
    category: 'bounce',
    duration: 1200,
    tracks: [
      createTrack('Bounce In', 'transform', [
        createKeyframe(0, { scale: 0.9, translateY: 30, perspective: 2400 }, 'ease-out'),
        createKeyframe(600, { scale: 1.04, translateY: -5, perspective: 2400 }, 'ease-out'),
        createKeyframe(900, { scale: 1, translateY: 2, perspective: 2400 }, 'ease-out'),
        createKeyframe(1200, { scale: 1, translateY: 0, perspective: 2400 }, 'ease-out'),
      ]),
      createTrack('Bounce In Fade', 'opacity', [
        createKeyframe(0, { imageOpacity: 0 }, 'ease-out'),
        createKeyframe(300, { imageOpacity: 1 }, 'ease-out'),
      ]),
    ],
  },
  {
    id: 'bounce-up',
    name: 'Bounce Up',
    description: 'Bounces up from below with elastic feel',
    category: 'bounce',
    duration: 1000,
    tracks: [
      createTrack('Bounce Up', 'transform', [
        createKeyframe(0, { translateY: 40, scale: 0.95, perspective: 2400 }, 'ease-out'),
        createKeyframe(400, { translateY: -8, scale: 1.02, perspective: 2400 }, 'ease-out'),
        createKeyframe(700, { translateY: 3, scale: 1, perspective: 2400 }, 'ease-out'),
        createKeyframe(1000, { translateY: 0, scale: 1, perspective: 2400 }, 'ease-out'),
      ]),
    ],
  },
  {
    id: 'elastic-swing',
    name: 'Elastic Swing',
    description: 'Swing from above with elastic bounce',
    category: 'bounce',
    duration: 1500,
    tracks: [
      createTrack('Elastic Swing', 'transform', [
        createKeyframe(0, { rotateX: -30, translateY: -20, scale: 0.95, perspective: 2400 }, 'ease-out'),
        createKeyframe(500, { rotateX: 8, translateY: 4, scale: 1.03, perspective: 2400 }, 'ease-out'),
        createKeyframe(900, { rotateX: -3, translateY: -1, scale: 1, perspective: 2400 }, 'ease-out'),
        createKeyframe(1200, { rotateX: 1, translateY: 0, scale: 1, perspective: 2400 }, 'ease-out'),
        createKeyframe(1500, { rotateX: 0, translateY: 0, scale: 1, perspective: 2400 }, 'ease-out'),
      ]),
      createTrack('Elastic Swing Fade', 'opacity', [
        createKeyframe(0, { imageOpacity: 0 }, 'ease-out'),
        createKeyframe(400, { imageOpacity: 1 }, 'ease-out'),
      ]),
    ],
  },
  {
    id: 'spring-pop',
    name: 'Spring Pop',
    description: 'Quick pop with springy overshoot — great for callouts',
    category: 'bounce',
    duration: 800,
    tracks: [
      createTrack('Spring Pop', 'transform', [
        createKeyframe(0, { scale: 0.85, perspective: 2400 }, 'ease-out'),
        createKeyframe(400, { scale: 1.06, perspective: 2400 }, 'ease-out'),
        createKeyframe(600, { scale: 0.98, perspective: 2400 }, 'ease-out'),
        createKeyframe(800, { scale: 1, perspective: 2400 }, 'ease-out'),
      ]),
      createTrack('Spring Pop Fade', 'opacity', [
        createKeyframe(0, { imageOpacity: 0 }, 'ease-out'),
        createKeyframe(250, { imageOpacity: 1 }, 'ease-out'),
      ]),
    ],
  },

  // ============ EFFECTS — Creative Visual Effects ============
  {
    id: 'glitch',
    name: 'Glitch',
    description: 'Digital glitch effect with shake and distortion',
    category: 'effects',
    duration: 1000,
    tracks: [
      createTrack('Glitch Shake', 'transform', [
        createKeyframe(0, { translateX: 0, translateY: 0, scale: 1, perspective: 2400 }, 'linear'),
        createKeyframe(50, { translateX: 4, translateY: -2, scale: 1, perspective: 2400 }, 'linear'),
        createKeyframe(100, { translateX: -3, translateY: 1, scale: 1, perspective: 2400 }, 'linear'),
        createKeyframe(150, { translateX: 0, translateY: 0, scale: 1, perspective: 2400 }, 'linear'),
        createKeyframe(200, { translateX: -5, translateY: -1, scale: 1.01, perspective: 2400 }, 'linear'),
        createKeyframe(250, { translateX: 2, translateY: 3, scale: 1, perspective: 2400 }, 'linear'),
        createKeyframe(300, { translateX: 0, translateY: 0, scale: 1, perspective: 2400 }, 'linear'),
        createKeyframe(700, { translateX: 3, translateY: -2, scale: 1, perspective: 2400 }, 'linear'),
        createKeyframe(750, { translateX: -2, translateY: 1, scale: 1, perspective: 2400 }, 'linear'),
        createKeyframe(800, { translateX: 0, translateY: 0, scale: 1, perspective: 2400 }, 'linear'),
      ]),
      createTrack('Glitch Flicker', 'opacity', [
        createKeyframe(0, { imageOpacity: 0.8 }, 'linear'),
        createKeyframe(50, { imageOpacity: 0.3 }, 'linear'),
        createKeyframe(100, { imageOpacity: 0.9 }, 'linear'),
        createKeyframe(150, { imageOpacity: 0.4 }, 'linear'),
        createKeyframe(200, { imageOpacity: 0.7 }, 'linear'),
        createKeyframe(300, { imageOpacity: 1 }, 'linear'),
      ]),
    ],
  },
  {
    id: 'blur-in',
    name: 'Blur In',
    description: 'Sharpens from blur to crisp focus',
    category: 'effects',
    duration: 1200,
    tracks: [
      createTrack('Blur In Transform', 'transform', [
        createKeyframe(0, { scale: 0.97, perspective: 2400 }, 'ease-out'),
        createKeyframe(1200, { scale: 1, perspective: 2400 }, 'ease-out-cubic'),
      ]),
      createTrack('Blur In Opacity', 'opacity', [
        createKeyframe(0, { imageOpacity: 0 }, 'ease-out'),
        createKeyframe(400, { imageOpacity: 1 }, 'ease-out'),
      ]),
    ],
  },
  {
    id: 'stretch',
    name: 'Stretch',
    description: 'Vertical stretching entrance with snap-back',
    category: 'effects',
    duration: 900,
    tracks: [
      createTrack('Stretch', 'transform', [
        createKeyframe(0, { scale: 1, rotateX: 75, perspective: 1200, translateY: -20 }, 'ease-out'),
        createKeyframe(450, { scale: 1.02, rotateX: -5, perspective: 2400, translateY: 3 }, 'ease-out'),
        createKeyframe(700, { scale: 1, rotateX: 2, perspective: 2400, translateY: 0 }, 'ease-out'),
        createKeyframe(900, { scale: 1, rotateX: 0, perspective: 2400, translateY: 0 }, 'ease-out'),
      ]),
      createTrack('Stretch Fade', 'opacity', [
        createKeyframe(0, { imageOpacity: 0 }, 'ease-out'),
        createKeyframe(250, { imageOpacity: 1 }, 'ease-out'),
      ]),
    ],
  },
  {
    id: 'pulse',
    name: 'Pulse',
    description: 'Gentle pulsing loop that draws attention',
    category: 'effects',
    duration: 2000,
    tracks: [
      createTrack('Pulse', 'transform', [
        createKeyframe(0, { scale: 1, perspective: 2400 }, 'ease-in-out'),
        createKeyframe(1000, { scale: 1.04, perspective: 2400 }, 'ease-in-out'),
        createKeyframe(2000, { scale: 1, perspective: 2400 }, 'ease-in-out'),
      ]),
    ],
  },
  {
    id: 'wobble',
    name: 'Wobble',
    description: 'Playful side-to-side wobble',
    category: 'effects',
    duration: 1200,
    tracks: [
      createTrack('Wobble', 'transform', [
        createKeyframe(0, { rotateZ: 0, perspective: 2400 }, 'ease-in-out'),
        createKeyframe(150, { rotateZ: -8, perspective: 2400 }, 'ease-in-out'),
        createKeyframe(300, { rotateZ: 6, perspective: 2400 }, 'ease-in-out'),
        createKeyframe(450, { rotateZ: -4, perspective: 2400 }, 'ease-in-out'),
        createKeyframe(600, { rotateZ: 2, perspective: 2400 }, 'ease-in-out'),
        createKeyframe(800, { rotateZ: 0, perspective: 2400 }, 'ease-in-out'),
      ]),
    ],
  },
  {
    id: 'morph-3d',
    name: 'Morph 3D',
    description: 'Morphs between 3D perspectives for a dynamic feel',
    category: 'effects',
    duration: 2000,
    tracks: [
      createTrack('Morph 3D', 'transform', [
        createKeyframe(0, { rotateX: 0, rotateY: 0, rotateZ: 0, scale: 1, perspective: 2400 }, 'ease-in-out'),
        createKeyframe(500, { rotateX: 15, rotateY: -15, rotateZ: 3, scale: 0.97, perspective: 2000 }, 'ease-in-out'),
        createKeyframe(1000, { rotateX: 0, rotateY: 0, rotateZ: 0, scale: 1, perspective: 2400 }, 'ease-in-out'),
        createKeyframe(1500, { rotateX: -10, rotateY: 10, rotateZ: -2, scale: 0.98, perspective: 2000 }, 'ease-in-out'),
        createKeyframe(2000, { rotateX: 0, rotateY: 0, rotateZ: 0, scale: 1, perspective: 2400 }, 'ease-in-out'),
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
export const CATEGORY_LABELS: Record<string, string> = {
  reveal: 'Reveal',
  slide: 'Slide',
  fade: 'Fade',
  flip: 'Flip',
  perspective: 'Perspective',
  orbit: 'Orbit',
  depth: 'Depth',
  kenburns: 'Ken Burns',
  bounce: 'Bounce',
  effects: 'Effects',
};
