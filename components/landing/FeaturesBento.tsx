import { MagicBento, type MagicBentoCard } from "./MagicBento";
import {
  BackgroundsVisual,
  CaptureVisual,
  ExportVisual,
  FramesVisual,
  MotionVisual,
  TransformsVisual,
} from "./BentoCardVisuals";

const FEATURE_CARDS: MagicBentoCard[] = [
  {
    title: "Device Frames",
    description: "macOS, Windows, Arc, etc.",
    label: "Frames",
    visual: <FramesVisual />,
  },
  {
    title: "3D Transforms",
    description: "30+ perspective presets with realistic tilt.",
    label: "Depth",
    visual: <TransformsVisual />,
  },
  {
    title: "Beautiful Backgrounds",
    description:
      "100+ gradients, solids, images, blur, and noise. One click polish.",
    label: "Style",
    visual: <BackgroundsVisual />,
    large: true,
  },
  {
    title: "Animations & Video",
    description:
      "20+ presets plus a timeline editor. Export MP4, WebM, or GIF.",
    label: "Motion",
    visual: <MotionVisual />,
    large: true,
  },
  {
    title: "Tweet & Code Snippets",
    description: "Paste a tweet URL or drop code.",
    label: "Capture",
    visual: <CaptureVisual />,
  },
  {
    title: "High-Res Export",
    description: "PNG or JPG up to 5×.",
    label: "Export",
    visual: <ExportVisual />,
  },
];

export function FeaturesBento(): React.JSX.Element {
  return (
    <section className="bg-background px-6 pt-20 pb-4 sm:pt-28 sm:pb-4">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-12 text-center md:mb-14">
          <h2
            className="landing-heading text-[28px] leading-[34px] font-semibold tracking-[-0.03em] sm:text-[36px] sm:leading-[42px] md:text-[44px] md:leading-[50px]"
            style={{
              fontFamily:
                'Inter, "Inter Fallback", Arial, Helvetica, sans-serif',
            }}
          >
            Everything you need.
            <br />
            Nothing you don&apos;t.
          </h2>
        </div>

        <MagicBento
          cards={FEATURE_CARDS}
          textAutoHide
          enableSpotlight
          enableBorderGlow
          clickEffect
          spotlightRadius={400}
          glowColor="var(--bento-glow-rgb)"
        />
      </div>
    </section>
  );
}
