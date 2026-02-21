"use client";

import { useState, lazy, Suspense, Component, type ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HeroVideoDialog } from "@/components/ui/hero-video-dialog";
import { Instrument_Serif } from "next/font/google";
import { trackCTAClick } from "@/lib/analytics";

// Lazy-load ShaderGradient to prevent client-side crashes from killing the whole page
const ShaderGradientCanvas = lazy(() =>
  import("@shadergradient/react").then((m) => ({ default: m.ShaderGradientCanvas }))
);
const ShaderGradient = lazy(() =>
  import("@shadergradient/react").then((m) => ({ default: m.ShaderGradient }))
);

// Silent error boundary for the gradient background - falls back to CSS gradient
class GradientErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

const instrumentSerif = Instrument_Serif({
  weight: ["400"],
  subsets: ["latin"],
});

interface HeroProps {
  title: string;
  subtitle?: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export function Hero({
  title,
  subtitle,
  description,
  ctaLabel = "Start Creating",
  ctaHref = "/home",
}: HeroProps) {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const videoEmbedUrl = "https://www.youtube.com/embed/SKvVPLj5ZFo";
  const videoThumbnailUrl =
    "https://img.youtube.com/vi/SKvVPLj5ZFo/maxresdefault.jpg";

  return (
    <main
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      role="banner"
    >
      {/* Shader Gradient Background */}
      <div className="absolute inset-0 z-0">
        <GradientErrorBoundary>
          <Suspense fallback={<div className="w-full h-full bg-gradient-to-br from-[#73bfc4]/30 via-[#ff810a]/20 to-[#8da0ce]/30" />}>
            <ShaderGradientCanvas
              style={{
                width: "100%",
                height: "100%",
              }}
              pixelDensity={1}
              pointerEvents="none"
            >
              <ShaderGradient
                animate="on"
                type="sphere"
                wireframe={false}
                shader="defaults"
                uTime={0}
                uSpeed={0.3}
                uStrength={0.3}
                uDensity={0.8}
                uFrequency={5.5}
                uAmplitude={3.2}
                positionX={-0.1}
                positionY={0}
                positionZ={0}
                rotationX={0}
                rotationY={130}
                rotationZ={70}
                color1="#73bfc4"
                color2="#ff810a"
                color3="#8da0ce"
                reflection={0.4}
                cAzimuthAngle={270}
                cPolarAngle={180}
                cDistance={0.5}
                cameraZoom={15.1}
                lightType="env"
                brightness={0.8}
                envPreset="city"
                grain="on"
                toggleAxis={false}
                zoomOut={false}
                hoverState=""
                enableTransition={false}
              />
            </ShaderGradientCanvas>
          </Suspense>
        </GradientErrorBoundary>
      </div>

      {/* Dark overlay for better text readability */}
      <div
        className="absolute inset-0 z-[1] bg-gradient-to-b from-background/60 via-background/40 to-background"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto text-center px-6 py-24 sm:py-32">
        {/* Badge/Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8">
          <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
          <span className="text-sm text-foreground/90">
            Create stunning visuals in seconds
          </span>
        </div>

        {/* Headline - Large and impactful */}
        <h1
          className={`text-[44px] sm:text-[60px] md:text-[80px] lg:text-[96px] font-normal tracking-tight leading-[1.05] ${instrumentSerif.className}`}
        >
          {title}
          {subtitle && (
            <>
              <br />
              <span className="bg-gradient-to-r from-brand via-[#ff810a] to-[#73bfc4] bg-clip-text text-transparent">
                {subtitle}
              </span>
            </>
          )}
        </h1>

        {/* Description */}
        <p className="mt-6 sm:mt-8 text-lg sm:text-xl md:text-2xl text-foreground/70 max-w-2xl mx-auto leading-relaxed">
          {description}
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href={ctaHref} onClick={() => trackCTAClick('hero', ctaLabel)}>
            <Button
              size="lg"
              className="cursor-pointer text-base sm:text-lg px-10 py-6 min-h-[56px] font-medium bg-brand text-brand-foreground hover:bg-brand-hover rounded-full shadow-lg shadow-brand/25 hover:shadow-brand/40 transition-all duration-300"
            >
              {ctaLabel}
            </Button>
          </Link>
          <button
            onClick={() => {
              trackCTAClick('hero', 'Watch demo');
              setIsVideoOpen(true);
            }}
            className="cursor-pointer text-foreground/70 hover:text-foreground transition-colors text-sm flex items-center gap-3 group px-6 py-3 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10"
            aria-label="Watch demo video"
          >
            <span className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-brand/20 group-hover:text-brand transition-all duration-300">
              <svg
                className="w-4 h-4 ml-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M6.5 5.5v9l7-4.5-7-4.5z" />
              </svg>
            </span>
            <span className="group-hover:text-brand transition-colors">
              Watch demo
            </span>
          </button>
        </div>

        {/* Trust indicators */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-foreground/50">
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-brand"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span>Free forever</span>
          </div>
          <div className="hidden sm:block w-1 h-1 rounded-full bg-foreground/30" />
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-brand"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span>No signup required</span>
          </div>
          <div className="hidden sm:block w-1 h-1 rounded-full bg-foreground/30" />
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-brand"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span>Export in HD</span>
          </div>
        </div>
      </div>

      {/* Bottom fade to next section */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-[2]"
        aria-hidden="true"
      />

      {/* Video Dialog */}
      <HeroVideoDialog
        videoSrc={videoEmbedUrl}
        thumbnailSrc={videoThumbnailUrl}
        thumbnailAlt="Screenshot Studio editor demo"
        open={isVideoOpen}
        onOpenChange={setIsVideoOpen}
        showThumbnail={false}
        animationStyle="from-center"
      />
    </main>
  );
}
