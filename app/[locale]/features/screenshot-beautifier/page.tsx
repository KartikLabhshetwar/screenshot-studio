import { Metadata } from "next";
import Link from "next/link";
import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { ArrowRight, Sparkles, Palette, Download, Layers } from "lucide-react";

export const metadata: Metadata = {
  title: "Free Screenshot Beautifier - Make Screenshots Look Professional",
  description:
    "Transform plain screenshots into stunning mockups with our free screenshot beautifier. Add gradient backgrounds, browser frames, shadows, rounded corners, and padding. Better than Pika Style — export in high resolution. No signup required.",
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

const features = [
  {
    icon: Palette,
    title: "100+ Gradient Backgrounds",
    description:
      "Choose from stunning gradients, solid colors, or upload your own custom backgrounds.",
  },
  {
    icon: Sparkles,
    title: "Professional Shadows",
    description:
      "Add realistic shadows with customizable blur, spread, and opacity for depth.",
  },
  {
    icon: Layers,
    title: "Rounded Corners & Padding",
    description:
      "Adjust corner radius and padding to match any style or platform requirements.",
  },
  {
    icon: Download,
    title: "High-Res Export",
    description:
      "Export at up to 5x resolution. Perfect for retina displays and print.",
  },
];

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

export default function ScreenshotBeautifierPage() {
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://screenshot-studio.com" },
      { "@type": "ListItem", position: 2, name: "Features", item: "https://screenshot-studio.com/features" },
      { "@type": "ListItem", position: 3, name: "Screenshot Beautifier", item: "https://screenshot-studio.com/features/screenshot-beautifier" },
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
        step: [
          {
            "@type": "HowToStep",
            name: "Upload Your Screenshot",
            text: "Drag and drop any image or paste from clipboard. Supports PNG, JPG, and WebP.",
            position: 1,
          },
          {
            "@type": "HowToStep",
            name: "Choose Your Style",
            text: "Pick from 100+ backgrounds, adjust shadows, corners, and padding to match your brand.",
            position: 2,
          },
          {
            "@type": "HowToStep",
            name: "Export & Share",
            text: "Download in PNG or JPG. Scale up to 5x for crisp, high-res output.",
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
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Free Screenshot Beautifier
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Transform plain screenshots into professional-looking visuals in
              seconds. Add stunning backgrounds, shadows, and export in high
              resolution.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-8 py-4 rounded-full hover:opacity-90 transition-opacity"
            >
              Beautify Your Screenshot
              <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="text-sm text-muted-foreground mt-4">
              100% free. No signup required.
            </p>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Everything You Need to Beautify Screenshots
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
              Whether you&apos;re a developer, marketer, or content creator, our
              screenshot beautifier helps you create stunning visuals.
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
              How to Beautify Screenshots
            </h2>
            <div className="space-y-8">
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    Upload Your Screenshot
                  </h3>
                  <p className="text-muted-foreground">
                    Drag and drop any image or paste from clipboard. Supports
                    PNG, JPG, and WebP.
                  </p>
                </div>
              </div>
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    Choose Your Style
                  </h3>
                  <p className="text-muted-foreground">
                    Pick from 100+ backgrounds, adjust shadows, corners, and
                    padding to match your brand.
                  </p>
                </div>
              </div>
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    Export & Share
                  </h3>
                  <p className="text-muted-foreground">
                    Download in PNG or JPG. Scale up to 5x for crisp, high-res
                    output.
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link
                href="/features/browser-mockups"
                className="flex items-center justify-between p-4 bg-background border rounded-xl hover:border-primary transition-colors group"
              >
                <span className="font-medium text-sm">Browser Mockups</span>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
              <Link
                href="/features/social-media-graphics"
                className="flex items-center justify-between p-4 bg-background border rounded-xl hover:border-primary transition-colors group"
              >
                <span className="font-medium text-sm">Social Media Graphics</span>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
              <Link
                href="/features/animation-maker"
                className="flex items-center justify-between p-4 bg-background border rounded-xl hover:border-primary transition-colors group"
              >
                <span className="font-medium text-sm">Animation Maker</span>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
              <Link
                href="/features/3d-effects"
                className="flex items-center justify-between p-4 bg-background border rounded-xl hover:border-primary transition-colors group"
              >
                <span className="font-medium text-sm">3D Effects</span>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Beautify Your Screenshots?
            </h2>
            <p className="text-muted-foreground mb-8">
              Join thousands of creators making professional graphics.
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
