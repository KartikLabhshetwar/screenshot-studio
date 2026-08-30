import { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight01Icon,
  MagicWand01Icon,
  PlayIcon,
  SparklesIcon,
  Video01Icon,
} from "hugeicons-react";
import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { OG_DEFAULTS } from "@/lib/seo/metadata";

export const metadata: Metadata = {
  title: "Free Screenshot Animation Maker",
  description:
    "Create stunning animations from screenshots. Build slideshows with zoom, pan, and fade effects. Export to video or GIF. Free browser-based animation tool.",
  keywords: [
    "animation maker",
    "screenshot animation",
    "slideshow maker",
    "animated slideshow",
    "screenshot to video",
    "zoom animation",
    "pan animation",
    "ken burns effect",
    "free animation tool",
    "animated screenshot maker",
    "product demo animation",
    "screenshot gif maker",
    "app preview video maker",
    "animated mockup generator",
    "screenshot video export free",
  ],
  openGraph: {
    ...OG_DEFAULTS,
    title: "Free Animation Maker - Create Animated Screenshots & Slideshows",
    description:
      "Create stunning animations from screenshots. Zoom, pan, and fade effects with video export.",
    url: "/features/animation-maker",
  },
  alternates: {
    canonical: "/features/animation-maker",
  },
};

const INTER =
  'Inter, "Inter Fallback", Arial, Helvetica, sans-serif';

const ctaClassName =
  "relative inline-flex items-center justify-center rounded-md border-0 bg-[var(--nav-cta-bg)] px-6 py-2.5 text-base font-medium text-[var(--nav-cta-fg)] shadow-none transition-[transform,box-shadow] duration-150 ease-out [text-shadow:var(--nav-cta-text-shadow)] hover:shadow-[var(--nav-cta-hover-shadow)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 active:scale-[0.97]";

const cardSurface =
  "rounded-2xl bg-card ring-1 ring-border shadow-[var(--card-edge-shadow)]";

const chipLinkClassName =
  "group flex items-center justify-between rounded-md bg-foreground/[0.04] px-4 py-3 text-sm font-medium text-foreground/90 ring-1 ring-border transition-colors hover:bg-foreground/[0.08] hover:text-foreground";

const animations = [
  {
    name: "Zoom In",
    description: "Dramatic zoom effect that draws attention to key details",
  },
  {
    name: "Zoom Out",
    description: "Reveal the full picture from a focused starting point",
  },
  {
    name: "Pan Left/Right",
    description: "Smooth horizontal movement across wide screenshots",
  },
  {
    name: "Ken Burns",
    description: "Classic documentary-style slow zoom and pan combo",
  },
  {
    name: "Tilt Up/Down",
    description: "Vertical panning for long screenshots and pages",
  },
  {
    name: "Fade Transitions",
    description: "Elegant crossfade between multiple slides",
  },
];

const features = [
  {
    icon: MagicWand01Icon,
    title: "20+ Animation Presets",
    description:
      "One-click animations including zoom, pan, tilt, rotate, and Ken Burns effects.",
  },
  {
    icon: PlayIcon,
    title: "Timeline Editor",
    description:
      "Fine-tune timing with our visual timeline. Adjust duration, easing, and keyframes.",
  },
  {
    icon: Video01Icon,
    title: "Video Export",
    description:
      "Export as MP4 video or animated GIF. Perfect for social media and presentations.",
  },
  {
    icon: SparklesIcon,
    title: "Slideshow Builder",
    description:
      "Combine multiple screenshots into animated slideshows with transitions.",
  },
] as const;

const useCases = [
  {
    title: "Product Demos",
    description:
      "Create engaging product walkthroughs that highlight key features with smooth zoom and pan animations.",
  },
  {
    title: "Social Media Content",
    description:
      "Stand out with animated posts that capture attention in crowded feeds on Twitter, LinkedIn, and more.",
  },
  {
    title: "Tutorial Videos",
    description:
      "Build step-by-step tutorials by combining screenshots into animated slideshows with clear transitions.",
  },
  {
    title: "Portfolio Showcases",
    description:
      "Present your work with cinematic Ken Burns effects that add polish and professionalism.",
  },
];

const howToSteps = [
  {
    step: "1",
    title: "Upload Your Screenshots",
    description:
      "Add one or more screenshots to create a slideshow or animate a single image.",
  },
  {
    step: "2",
    title: "Choose Animation Preset",
    description:
      "Select from 20+ presets like zoom, pan, Ken Burns, or create custom animations with the timeline.",
  },
  {
    step: "3",
    title: "Export as Video",
    description:
      "Download as MP4 video or GIF. Share directly to social media or embed anywhere.",
  },
];

const relatedLinks = [
  { href: "/features/screenshot-beautifier", label: "Screenshot Beautifier" },
  { href: "/features/social-media-graphics", label: "Social Media Graphics" },
  { href: "/features/3d-effects", label: "3D Effects" },
] as const;

export default function AnimationMakerPage() {
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.screenshot-studio.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Features",
        item: "https://www.screenshot-studio.com/features",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Animation Maker",
        item: "https://www.screenshot-studio.com/features/animation-maker",
      },
    ],
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: "Screenshot Studio - Animation Maker",
        applicationCategory: "MultimediaApplication",
        operatingSystem: "Web Browser",
        description:
          "Free online tool to create animated screenshots and slideshows with zoom, pan, and fade effects.",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        featureList: [
          "Zoom animations",
          "Pan effects",
          "Ken Burns effect",
          "Timeline editor",
          "Video export",
          "Slideshow builder",
        ],
      },
      {
        "@type": "HowTo",
        name: "How to Create Screenshot Animations",
        description:
          "Create stunning animations from screenshots in 3 steps using Screenshot Studio's free animation maker.",
        totalTime: "PT2M",
        tool: {
          "@type": "HowToTool",
          name: "Screenshot Studio",
        },
        step: howToSteps.map((item, index) => ({
          "@type": "HowToStep",
          name: item.title,
          text: item.description,
          position: index + 1,
        })),
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <Navigation brandName="Screenshot Studio" />

      <main className="flex-1">
        <section className="px-6 pb-20 pt-32">
          <div className="mx-auto max-w-4xl text-center">
            <h1
              className="mb-6 text-4xl font-semibold tracking-[-0.03em] text-foreground md:text-6xl"
              style={{ fontFamily: INTER }}
            >
              Free Screenshot Animation Maker
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground md:text-xl">
              Bring your screenshots to life with stunning animations. Create
              zoom effects, smooth pans, and animated slideshows. Export to
              video or GIF.
            </p>
            <div className="flex flex-col items-center">
              <Link href="/" className={ctaClassName}>
                Create Animation Free
              </Link>
              <p className="mt-4 inline-flex flex-wrap items-center justify-center gap-2 text-sm font-medium text-muted-foreground/70">
                <span>No Signup</span>
                <span className="h-3 w-px bg-border" aria-hidden />
                <span>No Watermarks</span>
                <span className="h-3 w-px bg-border" aria-hidden />
                <span>Unlimited Exports</span>
              </p>
            </div>
          </div>
        </section>

        <section className="border-y border-border px-6 py-16">
          <div className="mx-auto max-w-6xl">
            <h2
              className="mb-12 text-center text-3xl font-semibold tracking-[-0.03em] text-foreground"
              style={{ fontFamily: INTER }}
            >
              Powerful Animation Tools
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className={`flex gap-4 p-6 ${cardSurface}`}
                >
                  <feature.icon
                    className="size-6 shrink-0 text-foreground"
                    aria-hidden
                  />
                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-16">
          <div className="mx-auto max-w-6xl">
            <h2
              className="mb-4 text-center text-3xl font-semibold tracking-[-0.03em] text-foreground"
              style={{ fontFamily: INTER }}
            >
              Animation Effects
            </h2>
            <p className="mx-auto mb-12 max-w-2xl text-center text-muted-foreground">
              Choose from our library of professional animation presets or
              customize your own with the timeline editor.
            </p>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {animations.map((animation) => (
                <div key={animation.name} className={`p-6 ${cardSurface}`}>
                  <h3 className="mb-2 font-semibold text-foreground">
                    {animation.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {animation.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-border px-6 py-16">
          <div className="mx-auto max-w-4xl">
            <h2
              className="mb-12 text-center text-3xl font-semibold tracking-[-0.03em] text-foreground"
              style={{ fontFamily: INTER }}
            >
              Perfect For
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {useCases.map((useCase) => (
                <div key={useCase.title} className={`p-6 ${cardSurface}`}>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">
                    {useCase.title}
                  </h3>
                  <p className="text-muted-foreground">{useCase.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-16">
          <div className="mx-auto max-w-4xl">
            <h2
              className="mb-12 text-center text-3xl font-semibold tracking-[-0.03em] text-foreground"
              style={{ fontFamily: INTER }}
            >
              How to Create Animations
            </h2>
            <div className="space-y-8">
              {howToSteps.map((item) => (
                <div key={item.step} className="flex items-start gap-6">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary text-sm font-semibold text-primary-foreground">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="mb-1 text-lg font-semibold text-foreground">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-border px-6 py-16">
          <div className="mx-auto max-w-4xl">
            <h2
              className="mb-8 text-center text-2xl font-semibold tracking-[-0.03em] text-foreground"
              style={{ fontFamily: INTER }}
            >
              Explore More Features
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {relatedLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={chipLinkClassName}
                >
                  <span>{link.label}</span>
                  <ArrowRight01Icon
                    className="size-3.5 text-muted-foreground/70 transition-colors group-hover:text-foreground"
                    aria-hidden
                  />
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-20">
          <div className="mx-auto max-w-4xl text-center">
            <h2
              className="mb-4 text-3xl font-semibold tracking-[-0.03em] text-foreground"
              style={{ fontFamily: INTER }}
            >
              Start Creating Animations Today
            </h2>
            <p className="mb-8 text-muted-foreground">
              No video editing experience required. Create professional
              animations in minutes.
            </p>
            <Link href="/" className={ctaClassName}>
              Try Animation Maker Free
            </Link>
          </div>
        </section>
      </main>

      <Footer brandName="Screenshot Studio" />
    </div>
  );
}
