import { Metadata } from "next";
import Link from "next/link";
import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { ArrowRight, Sparkles, Share2, Play, Box, Globe } from "lucide-react";

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
    title: "Features - Screenshot Studio",
    description:
      "All tools and capabilities in one free editor. Beautify, animate, and transform screenshots.",
    url: "/features",
  },
  alternates: {
    canonical: "/features",
  },
};

const features = [
  {
    icon: Sparkles,
    title: "Screenshot Beautifier",
    description:
      "Transform plain screenshots into professional visuals. Add backgrounds, shadows, and rounded corners.",
    href: "/features/screenshot-beautifier",
    keywords: ["backgrounds", "shadows", "corners", "padding"],
  },
  {
    icon: Share2,
    title: "Social Media Graphics",
    description:
      "Create perfectly sized graphics for Twitter, LinkedIn, and Instagram. No design skills needed.",
    href: "/features/social-media-graphics",
    keywords: ["Twitter", "LinkedIn", "Instagram", "posts"],
  },
  {
    icon: Play,
    title: "Animation Maker",
    description:
      "Bring screenshots to life with zoom, pan, and fade animations. Export as video or GIF.",
    href: "/features/animation-maker",
    keywords: ["zoom", "pan", "slideshow", "video export"],
  },
  {
    icon: Box,
    title: "3D Effects",
    description:
      "Add stunning 3D perspective, rotation, and depth to flat screenshots. Real-time preview.",
    href: "/features/3d-effects",
    keywords: ["perspective", "rotation", "depth", "mockups"],
  },
  {
    icon: Globe,
    title: "Browser Mockups",
    description:
      "Add realistic Safari and Chrome browser frames to screenshots. Light and dark modes with custom URL.",
    href: "/features/browser-mockups",
    keywords: ["Safari", "Chrome", "browser frame", "URL bar"],
  },
];

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
      url: `https://screenshot-studio.com${feature.href}`,
    })),
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
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
              All Features
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Everything you need to create stunning visuals from screenshots.
              100% free, no signup required.
            </p>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {features.map((feature) => (
                <Link
                  key={feature.title}
                  href={feature.href}
                  className="group p-8 bg-muted/30 rounded-2xl border hover:border-primary transition-all"
                >
                  <feature.icon className="w-12 h-12 text-primary mb-6" />
                  <h2 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    {feature.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {feature.keywords.map((keyword) => (
                      <span
                        key={keyword}
                        className="text-xs px-2 py-1 bg-background rounded-full border"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1 text-primary font-medium">
                    Learn more
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Create?
            </h2>
            <p className="text-muted-foreground mb-8">
              All features, zero cost. Start creating in seconds.
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
