/**
 * Remotion Export Service
 *
 * Serializes editor state to props for Remotion rendering.
 * Can be used with:
 * 1. Local Remotion CLI rendering
 * 2. Remotion Lambda (cloud rendering)
 * 3. Self-hosted rendering server
 */

import { useImageStore } from '@/lib/store';
import type { AnimationExportProps } from '@/remotion/compositions/AnimationExport';

export interface RemotionRenderConfig {
  compositionId: string;
  fps: number;
  width: number;
  height: number;
  durationInFrames: number;
  props: AnimationExportProps;
}

/**
 * Serialize current editor state to Remotion props
 */
export function serializeEditorToRemotionProps(): AnimationExportProps | null {
  const state = useImageStore.getState();

  const {
    uploadedImageUrl,
    timeline,
    animationClips,
    backgroundConfig,
    borderRadius,
    imageScale,
    imageShadow,
  } = state;

  if (!uploadedImageUrl) {
    console.warn('No image to export');
    return null;
  }

  // Build background config
  let backgroundColor = '#1a1a1a';
  let backgroundGradient: AnimationExportProps['backgroundGradient'] | undefined;

  if (backgroundConfig.type === 'gradient') {
    // Extract gradient colors (simplified - you may need to import your gradient parsing logic)
    backgroundGradient = {
      colorA: '#4168d0',
      colorB: '#c850c0',
      direction: 135,
    };
  } else if (backgroundConfig.type === 'solid') {
    backgroundColor = typeof backgroundConfig.value === 'string'
      ? backgroundConfig.value
      : '#1a1a1a';
  }

  const props: AnimationExportProps = {
    imageUrl: uploadedImageUrl,
    clips: animationClips,
    tracks: timeline.tracks,
    backgroundColor,
    backgroundGradient,
    borderRadius,
    imageScale,
    shadowEnabled: imageShadow.enabled,
    shadowBlur: imageShadow.blur,
    shadowColor: imageShadow.color,
    shadowOffsetX: imageShadow.offsetX,
    shadowOffsetY: imageShadow.offsetY,
  };

  return props;
}

/**
 * Generate full Remotion render configuration
 */
export function generateRemotionConfig(
  width: number = 1920,
  height: number = 1080,
  fps: number = 60
): RemotionRenderConfig | null {
  const state = useImageStore.getState();
  const props = serializeEditorToRemotionProps();

  if (!props) {
    return null;
  }

  const durationMs = state.timeline.duration;
  const durationInFrames = Math.ceil((durationMs / 1000) * fps);

  return {
    compositionId: 'AnimationExport',
    fps,
    width,
    height,
    durationInFrames,
    props,
  };
}

/**
 * Download Remotion config as JSON for external rendering
 */
export function downloadRemotionConfig(): void {
  const config = generateRemotionConfig();

  if (!config) {
    throw new Error('Could not generate Remotion config');
  }

  const blob = new Blob([JSON.stringify(config, null, 2)], {
    type: 'application/json',
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `screenshotstudio-animation-config-${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Instructions for rendering with Remotion CLI
 *
 * 1. Install Remotion CLI: npm install -g @remotion/cli
 *
 * 2. Create a Root.tsx file that registers the composition:
 *    ```tsx
 *    import { Composition } from 'remotion';
 *    import { AnimationExport } from './compositions/AnimationExport';
 *
 *    export const RemotionRoot: React.FC = () => {
 *      return (
 *        <Composition
 *          id="AnimationExport"
 *          component={AnimationExport}
 *          durationInFrames={180}
 *          fps={60}
 *          width={1920}
 *          height={1080}
 *        />
 *      );
 *    };
 *    ```
 *
 * 3. Render with:
 *    npx remotion render AnimationExport out.mp4 --props="$(cat config.json | jq .props)"
 *
 * For cloud rendering, use Remotion Lambda:
 * https://www.remotion.dev/docs/lambda
 */
