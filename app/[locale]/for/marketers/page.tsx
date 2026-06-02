import { Metadata } from "next";
import Link from "next/link";
import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import {
  ArrowRight,
  TrendingUp,
  BarChart3,
  Share2,
  Megaphone,
  Presentation,
  Image,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Screenshot Editor for Marketers - Free Tool",
  description:
    "Create scroll-stopping product screenshots for landing pages, social media, and ad creatives. Add backgrounds, 3D effects, and animations. Free, no design skills needed.",
  keywords: [
    "screenshot editor for marketers",
    "product screenshot tool",
    "saas screenshot maker",
    "landing page images",
    "marketing screenshot editor",
    "ad creative tool",
    "product mockup generator",
    "social media marketing images",
    "product hunt launch images",
    "saas landing page hero image",
    "startup screenshot maker",
    "pitch deck screenshot tool",
    "feature announcement images",
    "comparison screenshot maker",
  ],
  openGraph: {
    title: "Screenshot Editor for Marketers",
    description:
      "Create professional product screenshots for campaigns, landing pages, and social media. Free, no signup.",
    url: "/for/marketers",
  },
  alternates: {
    canonical: "/for/marketers",
  },
};

const useCases = [
  {
    icon: Megaphone,
    title: "Landing Page Hero Images",
    description:
      "Turn raw product screenshots into polished hero images that convert. Add gradient backgrounds, shadows, and 3D perspective to showcase your product at its best.",
  },
  {
    icon: Share2,
    title: "Social Media Campaigns",
    description:
      "Create consistent, branded graphics for Twitter, LinkedIn, and Instagram. Perfect dimensions for every platform, optimized for engagement.",
  },
  {
    icon: TrendingUp,
    title: "Ad Creatives",
    description:
      "Build ad images that stop the scroll. Beautified product screenshots with eye-catching backgrounds and angles outperform generic stock photos.",
  },
  {
    icon: Presentation,
    title: "Pitch Decks & Proposals",
    description:
      "Impress investors and clients with professional product mockups. 3D perspective and device frames add credibility to any presentation.",
  },
  {
    icon: BarChart3,
    title: "Product Announcements",
    description:
      "Launch new features with stunning visuals. Animated screenshots grab attention and clearly demonstrate what your product does.",
  },
  {
    icon: Image,
    title: "Email Marketing",
    description:
      "Create clean product images for newsletters and drip campaigns. High-res exports that look sharp on any device.",
  },
];

const benefits = [
  {
    title: "No Design Skills Required",
    description:
      "One-click presets handle the design work. Just upload a screenshot, pick a style, and export. Your whole team can create on-brand visuals.",
  },
  {
    title: "Consistent Brand Assets",
    description:
      "Use the same backgrounds, shadows, and styling across all your marketing materials. Build recognition with visual consistency.",
  },
  {
    title: "Faster Than Figma or Canva",
    description:
      "Purpose-built for screenshots, not general design. What takes 15 minutes in Figma takes 30 seconds here. No learning curve.",
  },
  {
    title: "Animated Content That Converts",
    description:
      "Create animated product demos with zoom and pan effects. Export as video or GIF for social media posts that outperform static images.",
  },
];

export default function ForMarketersPage() {
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
            name: "For Marketers",
            item: "https://screenshot-studio.com/for/marketers",
          },
        ],
      },
      {
        "@type": "SoftwareApplication",
        name: "Screenshot Studio for Marketers",
        applicationCategory: "DesignApplication",
        operatingSystem: "Web Browser",
        description:
          "Free screenshot editor for marketers. Create professional product screenshots for landing pages, social media, and ad creatives without design skills.",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        featureList: [
          "Product screenshot beautification",
          "Social media graphics",
          "Ad creative generation",
          "3D product mockups",
          "Animated demo videos",
          "No signup required",
        ],
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
        {/* Hero */}
        <section className="pt-32 pb-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              Built for Marketers
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
              Screenshot Editor for Marketers
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Create scroll-stopping product visuals for landing pages, social
              media, and ad creatives. No design skills needed, no Figma
              required.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-8 py-4 rounded-full hover:opacity-90 transition-opacity"
              >
                Create Marketing Images
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

        {/* Use Cases */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                How Marketers Use Screenshot Studio
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                From landing page heroes to social campaigns, create visuals
                that convert.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {useCases.map((uc) => (
                <div
                  key={uc.title}
                  className="flex gap-4 p-6 bg-background rounded-xl border"
                >
                  <div className="flex-shrink-0">
                    <uc.icon className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{uc.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {uc.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Why Marketing Teams Choose Screenshot Studio
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {benefits.map((b) => (
                <div key={b.title} className="p-6 border rounded-xl">
                  <h3 className="font-semibold text-lg mb-2">{b.title}</h3>
                  <p className="text-muted-foreground">{b.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Feature Links */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-center">
              Explore Features
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { href: "/features/screenshot-beautifier", label: "Screenshot Beautifier" },
                { href: "/features/social-media-graphics", label: "Social Media Graphics" },
                { href: "/features/animation-maker", label: "Animation Maker" },
                { href: "/features/3d-effects", label: "3D Effects" },
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
              Create Marketing Visuals in Seconds
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Free forever. No signup. No watermarks.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-8 py-4 rounded-full hover:opacity-90 transition-opacity"
            >
              Open Editor
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>

      <Footer brandName="Screenshot Studio" />
    </div>
  );
}
