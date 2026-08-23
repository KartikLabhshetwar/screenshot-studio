import { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight01Icon,
  ColorsIcon,
  CubeIcon,
  Download04Icon,
  Layers01Icon,
  MagicWand01Icon,
  TextFontIcon,
  Video01Icon,
} from "hugeicons-react";
import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Free Screenshot Editor Online - Beautify Screenshots",
  description:
    "Looking for a free screenshot editor online? Screenshot Studio is the best free alternative to Pika Style and Shots.so. Beautify screenshots with 100+ gradient backgrounds, browser mockups, shadows, 3D effects, animations, and video export. No signup, no watermarks.",
  keywords: [
    "screenshot editor online free",
    "free screenshot editor",
    "online screenshot editor",
    "screenshot beautifier free",
    "edit screenshots online",
    "free screenshot tool",
    "screenshot background editor",
    "beautify screenshots online free",
    "screenshot editor no signup",
    "free image editor for screenshots",
    "pika style alternative free",
    "shots.so alternative free",
    "screenshot mockup generator free",
    "browser mockup tool online",
    "screenshot wrapper no watermark",
    "add gradient background to screenshot",
    "screenshot shadow and border editor",
  ],
  openGraph: {
    title: "Free Screenshot Editor Online - Screenshot Studio",
    description:
      "Beautify screenshots instantly with 100+ backgrounds, 3D effects, and animations. Free, no signup required.",
    url: "/free-screenshot-editor",
  },
  alternates: {
    canonical: "/free-screenshot-editor",
  },
};

const INTER =
  'Inter, "Inter Fallback", Arial, Helvetica, sans-serif';

const ctaClassName =
  "relative inline-flex items-center justify-center rounded-md border-0 bg-[var(--nav-cta-bg)] px-6 py-2.5 text-base font-medium text-[var(--nav-cta-fg)] shadow-none transition-[transform,box-shadow] duration-150 ease-out [text-shadow:var(--nav-cta-text-shadow)] hover:shadow-[var(--nav-cta-hover-shadow)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 active:scale-[0.97]";

const secondaryCtaClassName =
  "inline-flex items-center justify-center rounded-md px-6 py-2.5 text-base font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground active:scale-[0.99]";

const cardSurface =
  "rounded-2xl bg-card ring-1 ring-border shadow-[var(--card-edge-shadow)]";

const capabilities = [
  {
    icon: ColorsIcon,
    title: "100+ Backgrounds",
    description:
      "Gradients, solid colors, mesh backgrounds, and custom uploads. Make any screenshot pop with a professional backdrop.",
  },
  {
    icon: MagicWand01Icon,
    title: "Shadows & Effects",
    description:
      "Realistic drop shadows with customizable blur, spread, offset, and color. Add depth in one click.",
  },
  {
    icon: Layers01Icon,
    title: "Device Frames",
    description:
      "Wrap screenshots in macOS, Windows, Arc, or Polaroid frames. Perfect for product marketing.",
  },
  {
    icon: CubeIcon,
    title: "3D Perspective",
    description:
      "Tilt, rotate, and scale with real-time 3D transforms. Create eye-catching angles for presentations.",
  },
  {
    icon: Video01Icon,
    title: "Animation & Video Export",
    description:
      "Add keyframe animations with 20+ presets and export as MP4, WebM, or GIF. Bring static screenshots to life.",
  },
  {
    icon: TextFontIcon,
    title: "Text & Overlays",
    description:
      "Add captions, labels, and annotations with 25+ fonts. Layer stickers and arrows for tutorials.",
  },
  {
    icon: Download04Icon,
    title: "High-Res Export",
    description:
      "Export PNG or JPG at up to 5x resolution. Retina-ready images for any platform.",
  },
] as const;

const howItWorks = [
  {
    step: "1",
    title: "Upload Your Screenshot",
    desc: "Drag and drop any image or paste from clipboard. Supports PNG, JPG, WebP, and more.",
  },
  {
    step: "2",
    title: "Style It",
    desc: "Choose a background, add shadows, apply 3D transforms, or pick a one-click preset.",
  },
  {
    step: "3",
    title: "Export & Share",
    desc: "Download as high-res PNG/JPG or export animations as MP4, WebM, or GIF.",
  },
];

const useCases = [
  {
    title: "SaaS Product Marketing",
    description:
      "Turn raw product screenshots into polished hero images for landing pages, pitch decks, and ad creatives.",
  },
  {
    title: "Social Media Posts",
    description:
      "Create scroll-stopping Twitter, LinkedIn, and Instagram posts from app screenshots in seconds.",
  },
  {
    title: "Developer Portfolios",
    description:
      "Showcase your projects with professional screenshots that highlight your best work.",
  },
  {
    title: "Documentation & Tutorials",
    description:
      "Annotate and beautify screenshots for help docs, blog posts, and step-by-step guides.",
  },
  {
    title: "App Store Listings",
    description:
      "Generate beautiful preview images that increase downloads and conversion rates.",
  },
  {
    title: "Client Presentations",
    description:
      "Impress clients with polished mockups instead of raw screenshots in proposals and reports.",
  },
];

const faqs = [
  {
    q: "Is this screenshot editor really free?",
    a: "Yes, Screenshot Studio is 100% free with no hidden costs, premium tiers, or watermarks. Every feature is available to everyone. Unlimited exports, full resolution, no restrictions.",
  },
  {
    q: "Do I need to install anything?",
    a: "No. Screenshot Studio runs entirely in your browser. There is nothing to download or install. Just open the editor and start editing your screenshots immediately.",
  },
  {
    q: "Do I need to create an account?",
    a: "No signup required. Your privacy matters. We don't collect personal data or require registration. Just open the editor and start creating.",
  },
  {
    q: "What image formats are supported?",
    a: "You can upload PNG, JPG, WebP, and most common image formats. Export as high-resolution PNG (with transparency) or JPG. For animations, export as MP4, WebM, or GIF.",
  },
  {
    q: "Can I use this for commercial projects?",
    a: "Absolutely. There are no usage restrictions on images you create. Use them for SaaS marketing, social media, client work, app stores, or any other purpose.",
  },
  {
    q: "How does it compare to Canva or Figma?",
    a: "Screenshot Studio is purpose-built for screenshot beautification. Unlike general-purpose editors, it offers one-click presets, 3D perspective transforms, animation timelines, and video export, all optimized for the screenshot-to-social-media workflow.",
  },
];

const featureLinks = [
  {
    href: "/features/screenshot-beautifier",
    label: "Screenshot Beautifier",
  },
  {
    href: "/features/animation-maker",
    label: "Animation Maker",
  },
  {
    href: "/features/3d-effects",
    label: "3D Effects",
  },
  {
    href: "/features/social-media-graphics",
    label: "Social Media Graphics",
  },
] as const;

export default function FreeScreenshotEditorPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
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
            name: "Free Screenshot Editor",
            item: "https://www.screenshot-studio.com/free-screenshot-editor",
          },
        ],
      },
      {
        "@type": "SoftwareApplication",
        name: "Screenshot Studio - Free Screenshot Editor Online",
        description:
          "Free screenshot editor online. Beautify screenshots with backgrounds, shadows, 3D effects, animations, and video export. No signup required.",
        url: "https://www.screenshot-studio.com/free-screenshot-editor",
        applicationCategory: "DesignApplication",
        applicationSubCategory: "Screenshot Editor",
        operatingSystem: "Any (Web Browser)",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        featureList: [
          "100+ gradient backgrounds",
          "Custom shadow effects",
          "3D perspective transforms",
          "Device frames (macOS, Windows, Arc)",
          "Text and image overlays",
          "20+ animation presets",
          "Video export (MP4, WebM, GIF)",
          "High-res export up to 5x",
          "No signup required",
          "No watermarks",
        ],
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.8",
          ratingCount: "150",
          bestRating: "5",
        },
      },
      {
        "@type": "HowTo",
        name: "How to Edit Screenshots Online for Free",
        description:
          "Beautify any screenshot in 3 easy steps using Screenshot Studio's free online editor.",
        totalTime: "PT1M",
        tool: {
          "@type": "HowToTool",
          name: "Screenshot Studio",
        },
        step: howItWorks.map((item, index) => ({
          "@type": "HowToStep",
          name: item.title,
          text: item.desc,
          position: index + 1,
        })),
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.a,
          },
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
      <Navigation brandName="Screenshot Studio" />

      <main className="flex-1">
        <section className="px-6 pb-20 pt-32">
          <div className="mx-auto max-w-4xl text-center">
            <span className="mb-6 inline-flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <span>100% Free</span>
              <span className="h-3 w-px bg-border" aria-hidden />
              <span>No Signup</span>
              <span className="h-3 w-px bg-border" aria-hidden />
              <span>No Watermarks</span>
            </span>
            <h1
              className="mb-6 text-4xl font-semibold tracking-[-0.03em] text-foreground md:text-6xl"
              style={{ fontFamily: INTER }}
            >
              Free Screenshot Editor Online
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground md:text-xl">
              Beautify any screenshot in seconds. Add backgrounds, shadows, 3D
              effects, and animations, then export as image or video. No signup,
              no downloads.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/" className={ctaClassName}>
                Open Free Editor
              </Link>
              <Link href="/features" className={secondaryCtaClassName}>
                See All Features
              </Link>
            </div>
          </div>
        </section>

        <section className="border-y border-border px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 text-center">
              <h2
                className="mb-4 text-3xl font-semibold tracking-[-0.03em] text-foreground md:text-4xl"
                style={{ fontFamily: INTER }}
              >
                Everything You Need to Edit Screenshots
              </h2>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                A complete screenshot editor that runs in your browser. No
                bloated software, no learning curve. Just powerful tools that
                work.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {capabilities.map((cap, index) => (
                <div
                  key={cap.title}
                  className={`flex gap-4 p-6 ${cardSurface} ${
                    index === capabilities.length - 1
                      ? "md:col-span-2 md:max-w-md md:justify-self-center lg:col-span-1 lg:col-start-2 lg:max-w-none lg:justify-self-stretch"
                      : ""
                  }`}
                >
                  <cap.icon
                    className="size-6 shrink-0 text-foreground"
                    aria-hidden
                  />
                  <div>
                    <h3 className="mb-2 text-base font-semibold text-foreground">
                      {cap.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{cap.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-20">
          <div className="mx-auto max-w-4xl">
            <div className="mb-16 text-center">
              <h2
                className="mb-4 text-3xl font-semibold tracking-[-0.03em] text-foreground md:text-4xl"
                style={{ fontFamily: INTER }}
              >
                3 Steps to Professional Screenshots
              </h2>
              <p className="text-muted-foreground">
                No learning curve. No tutorials needed.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {howItWorks.map((item) => (
                <div key={item.step} className="text-center">
                  <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-md bg-primary text-base font-semibold text-primary-foreground">
                    {item.step}
                  </div>
                  <h3 className="mb-2 text-base font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-border px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 text-center">
              <h2
                className="mb-4 text-3xl font-semibold tracking-[-0.03em] text-foreground md:text-4xl"
                style={{ fontFamily: INTER }}
              >
                Built for Every Use Case
              </h2>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                Whether you are a developer, marketer, designer, or content
                creator, Screenshot Studio has you covered.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {useCases.map((uc) => (
                <div key={uc.title} className={`p-6 ${cardSurface}`}>
                  <h3 className="mb-2 font-semibold text-foreground">{uc.title}</h3>
                  <p className="text-sm text-muted-foreground">{uc.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-20">
          <div className="mx-auto max-w-3xl">
            <div className="mb-16 text-center">
              <h2
                className="mb-4 text-3xl font-semibold tracking-[-0.03em] text-foreground md:text-4xl"
                style={{ fontFamily: INTER }}
              >
                Frequently Asked Questions
              </h2>
              <p className="text-muted-foreground">
                Everything you need to know about our free screenshot editor.
              </p>
            </div>

            <div className="space-y-6">
              {faqs.map((faq) => (
                <div
                  key={faq.q}
                  className="border-b border-border pb-6 last:border-b-0"
                >
                  <h3 className="mb-2 text-lg font-semibold text-foreground">
                    {faq.q}
                  </h3>
                  <p className="text-muted-foreground">{faq.a}</p>
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
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {featureLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group flex items-center justify-between rounded-md bg-foreground/[0.04] px-4 py-3 text-sm font-medium text-foreground/90 ring-1 ring-border transition-colors hover:bg-foreground/[0.08] hover:text-foreground"
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
          <div className="mx-auto max-w-3xl text-center">
            <h2
              className="mb-4 text-3xl font-semibold tracking-[-0.03em] text-foreground md:text-4xl"
              style={{ fontFamily: INTER }}
            >
              Start Editing Screenshots for Free
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              No signup. No downloads. No watermarks. Just open the editor and
              create.
            </p>
            <Link href="/" className={ctaClassName}>
              Open Free Screenshot Editor
            </Link>
          </div>
        </section>
      </main>

      <Footer brandName="Screenshot Studio" />
    </div>
  );
}
