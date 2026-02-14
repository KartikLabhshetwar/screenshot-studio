import { AspectRatioKey } from './aspect-ratios';
import { BackgroundConfig } from './backgrounds';
import { ImageBorder, ImageShadow } from '@/lib/store';

export interface PresetConfig {
  id: string;
  name: string;
  description: string;
  aspectRatio: AspectRatioKey;
  backgroundConfig: BackgroundConfig;
  borderRadius: number;
  backgroundBorderRadius: number;
  imageOpacity: number;
  imageScale: number;
  imageBorder: ImageBorder;
  imageShadow: ImageShadow;
  backgroundBlur?: number;
  backgroundNoise?: number;
  perspective3D?: {
    perspective: number;
    rotateX: number;
    rotateY: number;
    rotateZ: number;
    translateX: number;
    translateY: number;
    scale: number;
  };
  shadowOverlay?: {
    src: string;
    opacity: number;
  };
}

export const presets: PresetConfig[] = [
  // 1. Spotlight - Dramatic dark with focused light
  {
    id: 'spotlight',
    name: 'Spotlight',
    description: 'Dramatic dark with focused attention',
    aspectRatio: '16_9',
    backgroundConfig: {
      type: 'image',
      value: 'backgrounds/raycast/mono_dark_distortion_2.webp',
      opacity: 1,
    },
    borderRadius: 8,
    backgroundBorderRadius: 0,
    imageOpacity: 1,
    imageScale: 100,
    imageBorder: {
      enabled: true,
      width: 2,
      color: '#1a1a1a',
      type: 'arc-dark',
    },
    imageShadow: {
      enabled: true,
      blur: 40,
      offsetX: 10,
      offsetY: 10,
      spread: 20,
      color: 'rgba(255, 255, 255, 0.08)',
    },
    backgroundBlur: 4,
    backgroundNoise: 0,
  },

  // 2. Lifted - Floating with hard shadow
  {
    id: 'lifted',
    name: 'Lifted',
    description: 'Bold floating effect with hard shadow',
    aspectRatio: '1_1',
    backgroundConfig: {
      type: 'image',
      value: 'backgrounds/raycast/loupe-mono-light.webp',
      opacity: 1,
    },
    borderRadius: 16,
    backgroundBorderRadius: 0,
    imageOpacity: 1,
    imageScale: 75,
    imageBorder: {
      enabled: false,
      width: 0,
      color: '#ffffff',
      type: 'none',
    },
    imageShadow: {
      enabled: true,
      blur: 2,
      offsetX: 20,
      offsetY: 20,
      spread: 0,
      color: 'rgba(0, 0, 0, 0)',
    },
    backgroundBlur: 0,
    backgroundNoise: 0,
    shadowOverlay: {
      src: '/overlay-shadow/017.webp',
      opacity: 0.5,
    },
  },

  // 3. Neon Dreams - Vibrant with colored glow
  {
    id: 'neon-dreams',
    name: 'Neon Dreams',
    description: 'Vibrant glow for creative content',
    aspectRatio: '16_9',
    backgroundConfig: {
      type: 'image',
      value: 'backgrounds/raycast/chromatic_dark_2.webp',
      opacity: 1,
    },
    borderRadius: 16,
    backgroundBorderRadius: 20,
    imageOpacity: 1,
    imageScale: 100,
    imageBorder: {
      enabled: true,
      width: 1,
      color: 'rgba(255,255,255,0.1)',
      type: 'arc-dark',
    },
    imageShadow: {
      enabled: true,
      blur: 40,
      offsetX: 0,
      offsetY: 20,
      spread: 0,
      color: '#401d90',
    },
    backgroundBlur: 0,
    backgroundNoise: 0,
  },

  // 4. Editorial - Clean magazine style
  {
    id: 'editorial',
    name: 'Editorial',
    description: 'Clean magazine-style presentation',
    aspectRatio: '4_5',
    backgroundConfig: {
      type: 'image',
      value: 'backgrounds/paper/27.webp',
      opacity: 1,
    },
    borderRadius: 0,
    backgroundBorderRadius: 0,
    imageOpacity: 1,
    imageScale: 100,
    imageBorder: {
      enabled: true,
      width: 8,
      color: '#ffffff',
      type: 'none',
    },
    imageShadow: {
      enabled: false,
      blur: 0,
      offsetX: 0,
      offsetY: 0,
      spread: 0,
      color: 'rgba(0, 0, 0, 0)',
    },
    backgroundBlur: 0,
    backgroundNoise: 25,
    shadowOverlay: {
      src: '/overlay-shadow/019.webp',
      opacity: 0.5,
    },
  },

  // 5. Glass Card - Modern glassmorphism
  {
    id: 'glass-card',
    name: 'Glass Card',
    description: 'Modern frosted glass effect',
    aspectRatio: '16_9',
    backgroundConfig: {
      type: 'image',
      value: 'backgrounds/mesh/Peak.webp',
      opacity: 1,
    },
    borderRadius: 24,
    backgroundBorderRadius: 32,
    imageOpacity: 1,
    imageScale: 100,
    imageBorder: {
      enabled: true,
      width: 1,
      color: 'rgba(255,255,255,0.2)',
      type: 'arc-dark',
    },
    imageShadow: {
      enabled: true,
      blur: 40,
      offsetX: 0,
      offsetY: 30,
      spread: -15,
      color: 'rgba(0, 0, 0, 0.3)',
    },
    backgroundBlur: 0,
    backgroundNoise: 30,
  },

  // 6. Terminal - Developer aesthetic
  {
    id: 'terminal',
    name: 'Terminal',
    description: 'Dark dev aesthetic with green accent',
    aspectRatio: '16_9',
    backgroundConfig: {
      type: 'solid',
      value: '#0a0a0a',
      opacity: 1,
    },
    borderRadius: 12,
    backgroundBorderRadius: 0,
    imageOpacity: 1,
    imageScale: 100,
    imageBorder: {
      enabled: true,
      width: 1,
      color: '#1a1a1a',
      type: 'macos-dark',
    },
    imageShadow: {
      enabled: true,
      blur: 40,
      offsetX: 0,
      offsetY: 25,
      spread: 0,
      color: 'rgba(34, 197, 94, 0.15)',
    },
    backgroundBlur: 0,
    backgroundNoise: 30,
    perspective3D: {
      perspective: 1200,
      rotateX: 8,
      rotateY: -4,
      rotateZ: 0,
      translateX: 0,
      translateY: 0,
      scale: 1,
    },
  },

  // 7. Sunset Fade - Warm gradient vibes
  {
    id: 'sunset-fade',
    name: 'Sunset Fade',
    description: 'Warm tones for lifestyle content',
    aspectRatio: 'og_image',
    backgroundConfig: {
      type: 'image',
      value: 'backgrounds/raycast/blushing-fire.webp',
      opacity: 1,
    },
    borderRadius: 20,
    backgroundBorderRadius: 24,
    imageOpacity: 1,
    imageScale: 100,
    imageBorder: {
      enabled: true,
      width: 3,
      color: '#ffffff',
      type: 'arc-light',
    },
    imageShadow: {
      enabled: true,
      blur: 50,
      offsetX: 0,
      offsetY: 25,
      spread: -10,
      color: 'rgba(0, 0, 0, 0.25)',
    },
    backgroundBlur: 0,
    backgroundNoise: 0,
  },
];

export const getPresetById = (id: string): PresetConfig | undefined => {
  return presets.find((preset) => preset.id === id);
};
