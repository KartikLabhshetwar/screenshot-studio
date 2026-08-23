import { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight01Icon,
  ColorsIcon,
  Download04Icon,
  Layers01Icon,
  MagicWand01Icon,
} from "hugeicons-react";
import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Free Screenshot Beautifier - Make Screenshots Look Professional",
  description:
    "Transform plain screenshots into stunning mockups with our free screenshot beautifier. Add gradient backgrounds, browser frames, shadows, rounded corners, and padding. Better than Pika Style. Export in high resolution. No signup required.",
  keywords: [
    "screenshot beautifier",
    "screenshot editor online free",
    "screenshot editor",
    "beautify screenshots",
    "free screenshot editor",
    "screenshot mockup",
    "screenshot background",
    "screenshot shadows",
    "free screenshot tool",
    "online screenshot beautifier",
    "pika style alternative",
    "shots.so alternative",
    "screenshot wrapper tool",
    "mac window mockup screenshot",
    "browser frame screenshot tool",
    "screenshot border radius shadow",
    "gradient background screenshot maker",
    "screenshot padding tool",
  ],
  openGraph: {
    title: "Free Screenshot Beautifier - Make Screenshots Look Professional",
    description:
      "Transform plain screenshots into stunning visuals. Add backgrounds, shadows, and export in high resolution.",
    url: "/features/screenshot-beautifier",
  },
  alternates: {
    canonical: "/features/screenshot-beautifier",
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

const features = [
  {
    icon: ColorsIcon,
    title: "100+ Gradient Backgrounds",
    description:
      "Choose from stunning gradients, solid colors, or upload your own custom backgrounds.",
  },
  {
    icon: MagicWand01Icon,
    title: "Professional Shadows",
    description:
      "Add realistic shadows with customizable blur, spread, and opacity for depth.",
  },
  {
    icon: Layers01Icon,
    title: "Rounded Corners & Padding",
    description:
      "Adjust corner radius and padding to match any style or platform requirements.",
  },
  {
    icon: Download04Icon,
    title: "High-Res Export",
    description:
      "Export at up to 5x resolution. Perfect for retina displays and print.",
  },
] as const;

const useCases = [
  {
    title: "Product Screenshots",
    description:
      "Make your SaaS product screenshots stand out on landing pages and marketing materials.",
  },
  {
    title: "Social Media Posts",
    description:
      "Create eye-catching Twitter, LinkedIn, and Instagram posts from your screenshots.",
  },
  {
    title: "Documentation",
    description:
      "Professional screenshots for tutorials, guides, and help documentation.",
  },
  {
    title: "App Store Assets",
    description:
      "Beautiful app preview images that increase downloads and conversions.",
  },
];

const howToSteps = [
  {
    step: "1",
    title: "Upload Your Screenshot",
    description:
      "Drag and drop any image or paste from clipboard. Supports PNG, JPG, and WebP.",
  },
  {
    step: "2",
    title: "Choose Your Style",
    description:
      "Pick from 100+ backgrounds, adjust shadows, corners, and padding to match your brand.",
  },
  {
    step: "3",
    title: "Export & Share",
    description:
      "Download in PNG or JPG. Scale up to 5x for crisp, high-res output.",
  },
];

const relatedLinks = [
  { href: "/features/browser-mockups", label: "Browser Mockups" },
  { href: "/features/social-media-graphics", label: "Social Media Graphics" },
  { href: "/features/animation-maker", label: "Animation Maker" },
  { href: "/features/3d-effects", label: "3D Effects" },
] as const;

export default function ScreenshotBeautifierPage() {
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
        name: "Screenshot Beautifier",
        item: "https://www.screenshot-studio.com/features/screenshot-beautifier",
      },
    ],
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: "Screenshot Studio - Screenshot Beautifier",
        applicationCategory: "DesignApplication",
        operatingSystem: "Web Browser",
        description:
          "Free online tool to beautify screenshots with backgrounds, shadows, and professional styling.",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        featureList: [
          "Gradient backgrounds",
          "Custom shadows",
          "Rounded corners",
          "High-resolution export",
          "No signup required",
        ],
      },
      {
        "@type": "HowTo",
        name: "How to Beautify Screenshots",
        description:
          "Transform plain screenshots into professional visuals in 3 easy steps using Screenshot Studio.",
        totalTime: "PT1M",
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <Navigation brandName="Screenshot Studio" />

      <main className="flex-1">
        <section className="px-6 pb-20 pt-32">
          <div className="mx-auto max-w-4xl text-center">
            <h1
              className="mb-6 text-4xl font-semibold tracking-[-0.03em] text-foreground md:text-6xl"
              style={{ fontFamily: INTER }}
            >
              Free Screenshot Beautifier
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground md:text-xl">
              Transform plain screenshots into professional-looking visuals in
              seconds. Add stunning backgrounds, shadows, and export in high
              resolution.
            </p>
            <div className="flex flex-col items-center">
              <Link href="/" className={ctaClassName}>
                Beautify Your Screenshot
              </Link>
              <p className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground/70">
                <span>100% Free</span>
                <span className="h-3 w-px bg-border" aria-hidden />
                <span>No Signup Required</span>
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
              Everything You Need to Beautify Screenshots
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
              Perfect For Every Use Case
            </h2>
            <p className="mx-auto mb-12 max-w-2xl text-center text-muted-foreground">
              Whether you&apos;re a developer, marketer, or content creator, our
              screenshot beautifier helps you create stunning visuals.
            </p>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {useCases.map((useCase) => (
                <div key={useCase.title} className={`p-6 ${cardSurface}`}>
                  <h3 className="mb-2 font-semibold text-foreground">
                    {useCase.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {useCase.description}
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
              How to Beautify Screenshots
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

        <section className="px-6 py-16">
          <div className="mx-auto max-w-4xl">
            <h2
              className="mb-8 text-center text-2xl font-semibold tracking-[-0.03em] text-foreground"
              style={{ fontFamily: INTER }}
            >
              Explore More Features
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
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

        <section className="border-t border-border px-6 py-20">
          <div className="mx-auto max-w-4xl text-center">
            <h2
              className="mb-4 text-3xl font-semibold tracking-[-0.03em] text-foreground"
              style={{ fontFamily: INTER }}
            >
              Ready to Beautify Your Screenshots?
            </h2>
            <p className="mb-8 text-muted-foreground">
              Join thousands of creators making professional graphics.
            </p>
            <Link href="/" className={ctaClassName}>
              Start Free
            </Link>
          </div>
        </section>
      </main>

      <Footer brandName="Screenshot Studio" />
    </div>
  );
}
