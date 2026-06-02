import { Metadata } from "next";
import Link from "next/link";
import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import {
  ArrowRight,
  Palette,
  Layers,
  Smartphone,
  PenTool,
  Eye,
  Sparkles,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Screenshot Editor for Designers - Free Tool",
  description:
    "Present your designs with polished mockups and professional styling. Add 3D perspective, device frames, animations, and export in high resolution. Free, browser-based.",
  keywords: [
    "screenshot editor for designers",
    "design mockup tool",
    "UI screenshot beautifier",
    "design portfolio images",
    "mockup generator free",
    "dribbble shot maker",
    "behance project images",
    "design presentation tool",
    "ui design showcase tool",
    "design case study images",
    "figma export beautifier",
    "device frame mockup free",
    "portfolio screenshot presenter",
    "design handoff screenshot tool",
  ],
  openGraph: {
    title: "Screenshot Editor for Designers",
    description:
      "Present your designs with professional mockups, 3D effects, and animations. Free, no signup.",
    url: "/for/designers",
  },
  alternates: {
    canonical: "/for/designers",
  },
};

const useCases = [
  {
    icon: PenTool,
    title: "Dribbble & Behance Shots",
    description:
      "Present your UI designs with polished mockups that stand out in portfolio feeds. Add depth with 3D perspective, gradient backgrounds, and realistic shadows.",
  },
  {
    icon: Smartphone,
    title: "Device Mockups",
    description:
      "Wrap your designs in macOS, Windows, or mobile device frames. Show how your work looks in context without separate mockup tools.",
  },
  {
    icon: Layers,
    title: "Design System Showcases",
    description:
      "Document and present your component libraries and design systems with consistent, professional screenshots.",
  },
  {
    icon: Eye,
    title: "Client Presentations",
    description:
      "Impress clients by presenting your work with polished mockups instead of flat screenshots. 3D perspective adds depth and professionalism.",
  },
  {
    icon: Sparkles,
    title: "Social Media Portfolio",
    description:
      "Share your latest work on Twitter and LinkedIn with perfectly styled screenshots. Platform-optimized dimensions built in.",
  },
  {
    icon: Palette,
    title: "Case Study Visuals",
    description:
      "Create beautiful before/after comparisons and process documentation. Animated transitions show your design thinking in action.",
  },
];

const features = [
  {
    title: "100+ Gradient Backgrounds",
    description:
      "Curated gradient collection designed to complement any UI. Dark, light, vibrant, and subtle options.",
  },
  {
    title: "3D Perspective & Rotation",
    description:
      "Tilt and rotate on all axes. Create the exact angle that shows off your design best.",
  },
  {
    title: "Device Frames",
    description:
      "macOS, Windows, Arc, and Polaroid frames. Context matters when presenting UI work.",
  },
  {
    title: "Animation & Video Export",
    description:
      "Create animated walkthroughs of your designs. Zoom into details, pan across layouts, export as MP4 or GIF.",
  },
  {
    title: "High-Res Export (up to 5x)",
    description:
      "Export at retina resolution and beyond. Your portfolio deserves pixel-perfect images.",
  },
  {
    title: "Text & Annotation Overlays",
    description:
      "Add labels, callouts, and annotations with 25+ fonts. Explain your design decisions visually.",
  },
];

export default function ForDesignersPage() {
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
            name: "For Designers",
            item: "https://screenshot-studio.com/for/designers",
          },
        ],
      },
      {
        "@type": "SoftwareApplication",
        name: "Screenshot Studio for Designers",
        applicationCategory: "DesignApplication",
        operatingSystem: "Web Browser",
        description:
          "Free screenshot editor for designers. Create professional mockups, portfolio shots, and client presentations with 3D effects and animations.",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        featureList: [
          "Design mockup creation",
          "Portfolio shot styling",
          "Device frame overlays",
          "3D perspective transforms",
          "Animation and video export",
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
              Built for Designers
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
              Screenshot Editor for Designers
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Present your designs the way they deserve to be seen. Professional
              mockups, 3D perspective, device frames, and animated showcases.
              Free in your browser.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-8 py-4 rounded-full hover:opacity-90 transition-opacity"
              >
                Create Mockup
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
                How Designers Use Screenshot Studio
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                From portfolio shots to client presentations, present your work
                beautifully.
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

        {/* Features */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Tools Designers Actually Need
              </h2>
              <p className="text-muted-foreground">
                Not a generic editor. Built specifically for presenting visual
                work.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((f) => (
                <div key={f.title} className="p-6 border rounded-xl">
                  <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {f.description}
                  </p>
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
                { href: "/features/3d-effects", label: "3D Effects" },
                { href: "/features/animation-maker", label: "Animation Maker" },
                { href: "/features/social-media-graphics", label: "Social Media Graphics" },
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
              Present Your Designs Beautifully
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
