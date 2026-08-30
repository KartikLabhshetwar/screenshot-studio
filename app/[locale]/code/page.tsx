import { Metadata } from 'next';
import { CodeImageEditor } from '@/components/code-image/CodeImageEditor';
import { OG_DEFAULTS } from '@/lib/seo/metadata';

export const metadata: Metadata = {
  title: 'Code to Image: Create Beautiful Code Screenshots',
  description:
    'Turn code into beautiful, shareable images. Pick a theme, gradient background, and window style, then export a crisp PNG. Free, no signup, no watermark.',
  keywords: [
    'code to image',
    'code snippet screenshot',
    'code screenshot generator',
    'ray.so alternative',
    'carbon alternative',
    'carbon.now.sh alternative',
    'code to png',
    'syntax highlighting screenshot',
    'beautiful code screenshots',
    'code image generator free',
    'share code as image',
  ],
  openGraph: {
    ...OG_DEFAULTS,
    title: 'Code to Image: Create Beautiful Code Screenshots',
    description:
      'Turn code into beautiful, shareable images. Themes, gradients, line numbers, and window frames. Free, no signup.',
    url: '/code',
  },
  alternates: {
    canonical: '/code',
  },
};

export default function CodeImagePage() {
  return <CodeImageEditor />;
}
