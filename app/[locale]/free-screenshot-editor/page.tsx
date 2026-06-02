import { Metadata } from "next";
import Link from "next/link";
import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import {
  ArrowRight,
  Sparkles,
  Palette,
  Download,
  Layers,
  Video,
  Box,
  Type,
} from "lucide-react";

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

const capabilities = [
  {
    icon: Palette,
    title: "100+ Backgrounds",
    description:
      "Gradients, solid colors, mesh backgrounds, and custom uploads. Make any screenshot pop with a professional backdrop.",
  },
  {
    icon: Sparkles,
    title: "Shadows & Effects",
    description:
      "Realistic drop shadows with customizable blur, spread, offset, and color. Add depth in one click.",
  },
  {
    icon: Layers,
    title: "Device Frames",
    description:
      "Wrap screenshots in macOS, Windows, Arc, or Polaroid frames. Perfect for product marketing.",
  },
  {
    icon: Box,
    title: "3D Perspective",
    description:
      "Tilt, rotate, and scale with real-time 3D transforms. Create eye-catching angles for presentations.",
  },
  {
    icon: Video,
    title: "Animation & Video Export",
    description:
      "Add keyframe animations with 20+ presets and export as MP4, WebM, or GIF. Bring static screenshots to life.",
  },
  {
    icon: Type,
    title: "Text & Overlays",
    description:
      "Add captions, labels, and annotations with 25+ fonts. Layer stickers and arrows for tutorials.",
  },
  {
    icon: Download,
    title: "High-Res Export",
    description:
      "Export PNG or JPG at up to 5x resolution. Retina-ready images for any platform.",
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
    a: "Yes, Screenshot Studio is 100% free with no hidden costs, premium tiers, or watermarks. Every feature is available to everyone — unlimited exports, full resolution, no restrictions.",
  },
  {
    q: "Do I need to install anything?",
    a: "No. Screenshot Studio runs entirely in your browser. There is nothing to download or install — just open the editor and start editing your screenshots immediately.",
  },
  {
    q: "Do I need to create an account?",
    a: "No signup required. Your privacy matters — we don't collect personal data or require registration. Just open the editor and start creating.",
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
    a: "Screenshot Studio is purpose-built for screenshot beautification. Unlike general-purpose editors, it offers one-click presets, 3D perspective transforms, animation timelines, and video export — all optimized for the screenshot-to-social-media workflow.",
  },
];

export default function FreeScreenshotEditorPage() {
  // Structured data for this page
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
            item: "https://screenshot-studio.com",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Free Screenshot Editor",
            item: "https://screenshot-studio.com/free-screenshot-editor",
          },
        ],
      },
      {
        "@type": "SoftwareApplication",
        name: "Screenshot Studio - Free Screenshot Editor Online",
        description:
          "Free screenshot editor online — beautify screenshots with backgrounds, shadows, 3D effects, animations, and video export. No signup required.",
        url: "https://screenshot-studio.com/free-screenshot-editor",
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
        step: [
          {
            "@type": "HowToStep",
            name: "Upload Your Screenshot",
            text: "Drag and drop any image or paste from clipboard. Supports PNG, JPG, WebP, and more.",
            position: 1,
          },
          {
            "@type": "HowToStep",
            name: "Style It",
            text: "Choose a background, add shadows, apply 3D transforms, or pick a one-click preset.",
            position: 2,
          },
          {
            "@type": "HowToStep",
            name: "Export & Share",
            text: "Download as high-res PNG/JPG or export animations as MP4, WebM, or GIF.",
            position: 3,
          },
        ],
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
      <Navigation ctaLabel="Open Editor" ctaHref="/" />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              100% Free &middot; No Signup &middot; No Watermarks
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
              Free Screenshot Editor Online
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Beautify any screenshot in seconds. Add backgrounds, shadows, 3D
              effects, and animations — then export as image or video. No
              signup, no downloads.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-8 py-4 rounded-full hover:opacity-90 transition-opacity"
              >
                Open Free Editor
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/features"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground font-medium px-6 py-4 transition-colors"
              >
                See All Features
              </Link>
            </div>
          </div>
        </section>

        {/* What You Can Do Section */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Everything You Need to Edit Screenshots
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                A complete screenshot editor that runs in your browser. No
                bloated software, no learning curve — just powerful tools that
                work.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {capabilities.map((cap) => (
                <div
                  key={cap.title}
                  className="flex gap-4 p-6 bg-background rounded-xl border"
                >
                  <div className="flex-shrink-0">
                    <cap.icon className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{cap.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {cap.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                3 Steps to Professional Screenshots
              </h2>
              <p className="text-muted-foreground">
                No learning curve. No tutorials needed.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
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
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Built for Every Use Case
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Whether you are a developer, marketer, designer, or content
                creator — Screenshot Studio has you covered.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {useCases.map((uc) => (
                <div
                  key={uc.title}
                  className="p-6 bg-background border rounded-xl hover:border-primary transition-colors"
                >
                  <h3 className="font-semibold mb-2">{uc.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {uc.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-muted-foreground">
                Everything you need to know about our free screenshot editor.
              </p>
            </div>

            <div className="space-y-6">
              {faqs.map((faq) => (
                <div key={faq.q} className="border-b border-border pb-6">
                  <h3 className="font-semibold text-lg mb-2">{faq.q}</h3>
                  <p className="text-muted-foreground">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Internal Links Section */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-center">
              Explore More Features
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
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
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center justify-between p-4 bg-background border rounded-xl hover:border-primary transition-colors group"
                >
                  <span className="font-medium text-sm">{link.label}</span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Start Editing Screenshots for Free
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              No signup. No downloads. No watermarks. Just open the editor and
              create.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-8 py-4 rounded-full hover:opacity-90 transition-opacity"
            >
              Open Free Screenshot Editor
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>

      <Footer brandName="Screenshot Studio" />
    </div>
  );
}
