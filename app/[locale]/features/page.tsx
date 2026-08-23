import { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight01Icon,
  BrowserIcon,
  CubeIcon,
  MagicWand01Icon,
  Share08Icon,
  Video01Icon,
} from "hugeicons-react";
import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { OG_DEFAULTS } from "@/lib/seo/metadata";

export const metadata: Metadata = {
  title: "Features - Screenshot Studio | All Tools & Capabilities",
  description:
    "Explore all Screenshot Studio features: screenshot beautifier, browser mockups, social media graphics, animation creator, and 3D effects. Free browser-based tools.",
  keywords: [
    "screenshot editor features",
    "image editing tools",
    "free design tools",
    "screenshot beautifier",
    "social media graphics",
    "animation maker",
    "3d effects",
    "screenshot mockup features",
    "browser frame mockup",
    "image background remover alternative",
    "screenshot gradient background",
    "screenshot presentation tool",
  ],
  openGraph: {
    ...OG_DEFAULTS,
    title: "Features - Screenshot Studio",
    description:
      "All tools and capabilities in one free editor. Beautify, animate, and transform screenshots.",
    url: "/features",
  },
  alternates: {
    canonical: "/features",
  },
};

const INTER =
  'Inter, "Inter Fallback", Arial, Helvetica, sans-serif';

const ctaClassName =
  "relative inline-flex items-center justify-center rounded-md border-0 bg-[var(--nav-cta-bg)] px-6 py-2.5 text-base font-medium text-[var(--nav-cta-fg)] shadow-none transition-[transform,box-shadow] duration-150 ease-out [text-shadow:var(--nav-cta-text-shadow)] hover:shadow-[var(--nav-cta-hover-shadow)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 active:scale-[0.97]";

const cardSurface =
  "rounded-2xl bg-card ring-1 ring-border shadow-[var(--card-edge-shadow)]";

const features = [
  {
    icon: MagicWand01Icon,
    title: "Screenshot Beautifier",
    description:
      "Transform plain screenshots into professional visuals. Add backgrounds, shadows, and rounded corners.",
    href: "/features/screenshot-beautifier",
    keywords: ["backgrounds", "shadows", "corners", "padding"],
  },
  {
    icon: Share08Icon,
    title: "Social Media Graphics",
    description:
      "Create perfectly sized graphics for Twitter, LinkedIn, and Instagram. No design skills needed.",
    href: "/features/social-media-graphics",
    keywords: ["Twitter", "LinkedIn", "Instagram", "posts"],
  },
  {
    icon: Video01Icon,
    title: "Animation Maker",
    description:
      "Bring screenshots to life with zoom, pan, and fade animations. Export as video or GIF.",
    href: "/features/animation-maker",
    keywords: ["zoom", "pan", "slideshow", "video export"],
  },
  {
    icon: CubeIcon,
    title: "3D Effects",
    description:
      "Add stunning 3D perspective, rotation, and depth to flat screenshots. Real-time preview.",
    href: "/features/3d-effects",
    keywords: ["perspective", "rotation", "depth", "mockups"],
  },
  {
    icon: BrowserIcon,
    title: "Browser Mockups",
    description:
      "Add realistic Safari and Chrome browser frames to screenshots. Light and dark modes with custom URL.",
    href: "/features/browser-mockups",
    keywords: ["Safari", "Chrome", "browser frame", "URL bar"],
  },
] as const;

export default function FeaturesPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Screenshot Studio Features",
    description: "Complete list of Screenshot Studio features and tools",
    itemListElement: features.map((feature, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: feature.title,
      description: feature.description,
      url: `https://www.screenshot-studio.com${feature.href}`,
    })),
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <Navigation brandName="Screenshot Studio" />

      <main className="flex-1">
        <section className="px-6 pb-12 pt-32">
          <div className="mx-auto max-w-4xl text-center">
            <h1
              className="mb-6 text-4xl font-semibold tracking-[-0.03em] text-foreground md:text-6xl"
              style={{ fontFamily: INTER }}
            >
              All Features
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground md:text-xl">
              Everything you need to create stunning visuals from screenshots.
              100% free, no signup required.
            </p>
          </div>
        </section>

        <section className="px-6 pb-16">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-4 md:grid-cols-2">
              {features.map((feature, index) => (
                <Link
                  key={feature.title}
                  href={feature.href}
                  className={`group p-8 transition-[box-shadow,ring-color] duration-150 hover:ring-ring/40 ${cardSurface} ${
                    index === features.length - 1
                      ? "md:col-span-2 md:max-w-xl md:justify-self-center"
                      : ""
                  }`}
                >
                  <feature.icon
                    className="mb-6 size-8 text-foreground"
                    aria-hidden
                  />
                  <h2 className="mb-3 text-2xl font-semibold tracking-tight text-foreground">
                    {feature.title}
                  </h2>
                  <p className="mb-4 text-muted-foreground">{feature.description}</p>
                  <div className="mb-4 flex flex-wrap gap-2">
                    {feature.keywords.map((keyword) => (
                      <span
                        key={keyword}
                        className="rounded-md bg-foreground/[0.04] px-2 py-1 text-xs text-muted-foreground ring-1 ring-border"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-foreground/90 transition-colors group-hover:text-foreground">
                    Learn more
                    <ArrowRight01Icon
                      className="size-3.5 transition-transform group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-border px-6 py-20">
          <div className="mx-auto max-w-4xl text-center">
            <h2
              className="mb-4 text-3xl font-semibold tracking-[-0.03em] text-foreground"
              style={{ fontFamily: INTER }}
            >
              Ready to Create?
            </h2>
            <p className="mb-8 text-muted-foreground">
              All features, zero cost. Start creating in seconds.
            </p>
            <Link href="/" className={ctaClassName}>
              Open Editor
            </Link>
          </div>
        </section>
      </main>

      <Footer brandName="Screenshot Studio" />
    </div>
  );
}
