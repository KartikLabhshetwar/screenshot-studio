import { Metadata } from "next";
import Link from "next/link";
import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { ArrowRight, Globe, Monitor, Sun, Moon } from "lucide-react";

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
    title: "Free Browser Mockup Generator - Safari & Chrome Frames",
    description:
      "Add realistic Safari and Chrome browser frames to screenshots. Light and dark modes, custom URL. Free, no signup.",
    url: "/features/browser-mockups",
  },
  alternates: {
    canonical: "/features/browser-mockups",
  },
};

const features = [
  {
    icon: Globe,
    title: "Safari Browser Frame",
    description:
      "Realistic macOS Safari toolbar with traffic lights, sidebar, back/forward navigation, and centered address bar with lock icon.",
  },
  {
    icon: Monitor,
    title: "Chrome Browser Frame",
    description:
      "Authentic Chrome toolbar with tab bar, active tab, colored traffic lights, and omnibox address bar.",
  },
  {
    icon: Sun,
    title: "Light & Dark Modes",
    description:
      "Every browser frame comes in both light and dark variants to match your screenshot content or brand style.",
  },
  {
    icon: Moon,
    title: "Custom URL & Header Size",
    description:
      "Set a custom URL displayed in the address bar and adjust the toolbar height from 50% to 200% of the default size.",
  },
];

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

export default function BrowserMockupsPage() {
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://screenshot-studio.com" },
      { "@type": "ListItem", position: 2, name: "Features", item: "https://screenshot-studio.com/features" },
      { "@type": "ListItem", position: 3, name: "Browser Mockups", item: "https://screenshot-studio.com/features/browser-mockups" },
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
        step: [
          {
            "@type": "HowToStep",
            name: "Upload Your Screenshot",
            text: "Drag and drop any image or paste from clipboard. Supports PNG, JPG, and WebP.",
            position: 1,
          },
          {
            "@type": "HowToStep",
            name: "Choose a Browser Frame",
            text: "Select Safari or Chrome in light or dark mode. Set your custom URL and adjust the header size.",
            position: 2,
          },
          {
            "@type": "HowToStep",
            name: "Export",
            text: "Download as PNG or JPG at up to 5x resolution, or apply 3D perspective and export as video.",
            position: 3,
          },
        ],
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

      <Navigation ctaLabel="Try Free" ctaHref="/" />

      <main className="flex-1">
        {/* Hero */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Free Browser Mockup Generator
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Add realistic Safari and Chrome browser frames to your screenshots.
              Light and dark modes, custom URL, adjustable header size.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-8 py-4 rounded-full hover:opacity-90 transition-opacity"
            >
              Add Browser Frame
              <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="text-sm text-muted-foreground mt-4">
              100% free. No signup required.
            </p>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Realistic Browser Frames for Any Screenshot
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="flex gap-4 p-6 bg-background rounded-xl border"
                >
                  <div className="flex-shrink-0">
                    <feature.icon className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">
              Perfect For Every Use Case
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Browser mockups add context and professionalism to any screenshot.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {useCases.map((useCase) => (
                <div
                  key={useCase.title}
                  className="p-6 border rounded-xl hover:border-primary transition-colors"
                >
                  <h3 className="font-semibold mb-2">{useCase.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {useCase.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              How to Add a Browser Frame
            </h2>
            <div className="space-y-8">
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Upload Your Screenshot</h3>
                  <p className="text-muted-foreground">
                    Drag and drop any image or paste from clipboard. Supports PNG, JPG, and WebP.
                  </p>
                </div>
              </div>
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Choose a Browser Frame</h3>
                  <p className="text-muted-foreground">
                    Select Safari or Chrome in light or dark mode. Set a custom URL and adjust the header size to your liking.
                  </p>
                </div>
              </div>
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Export</h3>
                  <p className="text-muted-foreground">
                    Download as PNG or JPG at up to 5x resolution. Add 3D perspective for even more depth.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Features */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-center">
              Explore More Features
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link
                href="/features/screenshot-beautifier"
                className="flex items-center justify-between p-4 bg-background border rounded-xl hover:border-primary transition-colors group"
              >
                <span className="font-medium text-sm">Screenshot Beautifier</span>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
              <Link
                href="/features/3d-effects"
                className="flex items-center justify-between p-4 bg-background border rounded-xl hover:border-primary transition-colors group"
              >
                <span className="font-medium text-sm">3D Effects</span>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
              <Link
                href="/features/social-media-graphics"
                className="flex items-center justify-between p-4 bg-background border rounded-xl hover:border-primary transition-colors group"
              >
                <span className="font-medium text-sm">Social Media Graphics</span>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Add Browser Frames?
            </h2>
            <p className="text-muted-foreground mb-8">
              Make your screenshots look professional with realistic browser mockups.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-8 py-4 rounded-full hover:opacity-90 transition-opacity"
            >
              Start Free
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>

      <Footer brandName="Screenshot Studio" />
    </div>
  );
}
