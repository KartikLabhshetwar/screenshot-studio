import { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight01Icon,
  BrowserIcon,
  ComputerIcon,
  Settings01Icon,
  Sun01Icon,
} from "hugeicons-react";
import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { OG_DEFAULTS } from "@/lib/seo/metadata";

export const metadata: Metadata = {
  title: "Free Browser Mockup Generator - Safari & Chrome Frames",
  description:
    "Add realistic Safari and Chrome browser frames to your screenshots for free. Light and dark modes, adjustable header size, custom URL bar. Works in 2D and 3D perspective. No signup required.",
  keywords: [
    "browser mockup generator",
    "safari browser mockup",
    "chrome browser mockup",
    "browser frame screenshot",
    "free browser mockup tool",
    "safari window mockup",
    "chrome window mockup",
    "browser mockup online free",
    "screenshot browser frame",
    "mac browser mockup",
    "website mockup generator",
    "browser screenshot tool",
    "add browser frame to screenshot",
    "safari dark mode mockup",
    "chrome dark mode mockup",
  ],
  openGraph: {
    ...OG_DEFAULTS,
    title: "Free Browser Mockup Generator - Safari & Chrome Frames",
    description:
      "Add realistic Safari and Chrome browser frames to screenshots. Light and dark modes, custom URL. Free, no signup.",
    url: "/features/browser-mockups",
  },
  alternates: {
    canonical: "/features/browser-mockups",
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
    icon: BrowserIcon,
    title: "Safari Browser Frame",
    description:
      "Realistic macOS Safari toolbar with traffic lights, sidebar, back/forward navigation, and centered address bar with lock icon.",
  },
  {
    icon: ComputerIcon,
    title: "Chrome Browser Frame",
    description:
      "Authentic Chrome toolbar with tab bar, active tab, colored traffic lights, and omnibox address bar.",
  },
  {
    icon: Sun01Icon,
    title: "Light & Dark Modes",
    description:
      "Every browser frame comes in both light and dark variants to match your screenshot content or brand style.",
  },
  {
    icon: Settings01Icon,
    title: "Custom URL & Header Size",
    description:
      "Set a custom URL displayed in the address bar and adjust the toolbar height from 50% to 200% of the default size.",
  },
] as const;

const useCases = [
  {
    title: "SaaS Landing Pages",
    description:
      "Show your product in a browser frame to give visitors a realistic preview of your web app.",
  },
  {
    title: "Portfolio & Case Studies",
    description:
      "Present website designs with professional browser chrome for client portfolios.",
  },
  {
    title: "Blog & Documentation",
    description:
      "Add browser context to screenshots in tutorials, guides, and technical articles.",
  },
  {
    title: "Social Media Posts",
    description:
      "Make your product screenshots stand out on Twitter, LinkedIn, and Product Hunt with polished browser frames.",
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
    title: "Choose a Browser Frame",
    description:
      "Select Safari or Chrome in light or dark mode. Set a custom URL and adjust the header size to your liking.",
  },
  {
    step: "3",
    title: "Export",
    description:
      "Download as PNG or JPG at up to 5x resolution. Add 3D perspective for even more depth.",
  },
];

const relatedLinks = [
  { href: "/features/screenshot-beautifier", label: "Screenshot Beautifier" },
  { href: "/features/3d-effects", label: "3D Effects" },
  { href: "/features/social-media-graphics", label: "Social Media Graphics" },
] as const;

export default function BrowserMockupsPage() {
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
        name: "Browser Mockups",
        item: "https://www.screenshot-studio.com/features/browser-mockups",
      },
    ],
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: "Screenshot Studio - Browser Mockup Generator",
        applicationCategory: "DesignApplication",
        operatingSystem: "Web Browser",
        description:
          "Free online tool to add Safari and Chrome browser frames to screenshots with light/dark modes and custom URL.",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        featureList: [
          "Safari browser frame (light & dark)",
          "Chrome browser frame (light & dark)",
          "Custom URL display",
          "Adjustable header size",
          "3D perspective support",
          "No signup required",
        ],
      },
      {
        "@type": "HowTo",
        name: "How to Add a Browser Frame to a Screenshot",
        description:
          "Add a realistic Safari or Chrome browser frame to any screenshot in 3 steps using Screenshot Studio.",
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
              Free Browser Mockup Generator
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground md:text-xl">
              Add realistic Safari and Chrome browser frames to your screenshots.
              Light and dark modes, custom URL, adjustable header size.
            </p>
            <div className="flex flex-col items-center">
              <Link href="/" className={ctaClassName}>
                Add Browser Frame
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
              Realistic Browser Frames for Any Screenshot
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
              Browser mockups add context and professionalism to any screenshot.
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
              How to Add a Browser Frame
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

        <section className="border-t border-border px-6 py-20">
          <div className="mx-auto max-w-4xl text-center">
            <h2
              className="mb-4 text-3xl font-semibold tracking-[-0.03em] text-foreground"
              style={{ fontFamily: INTER }}
            >
              Ready to Add Browser Frames?
            </h2>
            <p className="mb-8 text-muted-foreground">
              Make your screenshots look professional with realistic browser
              mockups.
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
