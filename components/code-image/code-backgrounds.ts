import { gradientColors } from '@/lib/constants/gradient-colors';
import { meshGradients } from '@/lib/constants/mesh-gradients';
import { backgroundCategories } from '@/lib/r2-backgrounds';
import { getR2PublicUrl } from '@/lib/r2';
import type { CodeTheme } from './code-themes';

export type BackgroundKind = 'theme' | 'gradient' | 'image' | 'pattern';

export interface BackgroundSelection {
  kind: BackgroundKind;
  id: string;
}

export const GRADIENT_PRESETS: Record<string, string> = {
  ...gradientColors,
  ...meshGradients,
};

export const IMAGE_CATEGORIES = [
  { id: 'assets', label: 'Abstract' },
  { id: 'mac', label: 'macOS' },
  { id: 'radiant', label: 'Radiant' },
  { id: 'mesh', label: 'Mesh' },
] as const;

export const PATTERN_PRESETS = [
  { id: 'grid', label: 'Grid' },
  { id: 'dots', label: 'Dots' },
  { id: 'lines', label: 'Lines' },
] as const;

export function getImageBackgroundUrl(path: string): string {
  return getR2PublicUrl(path);
}

export function patternCss(id: string, color: string): { backgroundImage: string; backgroundSize: string } {
  switch (id) {
    case 'dots':
      return {
        backgroundImage: `radial-gradient(${color} 1.5px, transparent 1.5px)`,
        backgroundSize: '18px 18px',
      };
    case 'lines':
      return {
        backgroundImage: `repeating-linear-gradient(0deg, ${color} 0 1px, transparent 1px 18px)`,
        backgroundSize: '18px 18px',
      };
    case 'grid':
    default:
      return {
        backgroundImage: `linear-gradient(${color} 1px, transparent 1px), linear-gradient(90deg, ${color} 1px, transparent 1px)`,
        backgroundSize: '18px 18px',
      };
  }
}

export interface ResolvedBackground {
  backgroundImage: string;
  backgroundColor: string;
  backgroundSize: string;
  backgroundPosition: string;
  backgroundRepeat: string;
}

export function resolveCodeBackground(
  background: BackgroundSelection,
  theme: CodeTheme,
  dark: boolean,
): ResolvedBackground {
  const themeGradient: ResolvedBackground = {
    backgroundImage: `linear-gradient(135deg, ${theme.from} 0%, ${theme.to} 100%)`,
    backgroundColor: theme.to,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };

  if (background.kind === 'gradient') {
    const css = GRADIENT_PRESETS[background.id];
    if (css) {
      return {
        backgroundImage: css,
        backgroundColor: theme.to,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      };
    }
  }

  if (background.kind === 'image') {
    return {
      backgroundImage: `url(${getImageBackgroundUrl(background.id)})`,
      backgroundColor: theme.to,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    };
  }

  if (background.kind === 'pattern') {
    const color = dark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.25)';
    const pattern = patternCss(background.id, color);
    return {
      backgroundImage: pattern.backgroundImage,
      backgroundColor: dark ? '#111111' : '#f4f4f4',
      backgroundSize: pattern.backgroundSize,
      backgroundPosition: '0 0',
      backgroundRepeat: 'repeat',
    };
  }

  return themeGradient;
}

export { backgroundCategories };
