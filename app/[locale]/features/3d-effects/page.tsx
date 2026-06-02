import { Metadata } from "next";
import Link from "next/link";
import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { ArrowRight, Box, RotateCcw, Layers, Lightbulb } from "lucide-react";

export const metadata: Metadata = {
  title: "Free 3D Screenshot Effects - Add Perspective & Depth",
  description:
    "Add stunning 3D effects to screenshots. Perspective tilt, rotation, depth shadows, and realistic lighting. Transform flat images into eye-catching 3D mockups.",
  keywords: [
    "3d screenshot effects",
    "3d image editor",
    "perspective screenshot",
    "3d mockup generator",
    "screenshot tilt effect",
    "3d rotation effect",
    "image perspective tool",
    "free 3d effects",
    "3d product mockup free",
    "isometric screenshot maker",
    "perspective transform tool",
    "3d app screenshot",
    "hero image 3d effect",
    "landing page screenshot 3d",
  ],
  openGraph: {
    title: "Free 3D Screenshot Effects - Add Perspective & Depth",
    description:
      "Add stunning 3D effects to screenshots. Perspective, rotation, and realistic shadows.",
    url: "/features/3d-effects",
  },
  alternates: {
    canonical: "/features/3d-effects",
  },
};

const effects = [
  {
    icon: Box,
    title: "3D Perspective",
    description:
      "Add depth with perspective transforms. Make flat screenshots look like real product shots.",
  },
  {
    icon: RotateCcw,
    title: "Rotation & Tilt",
    description:
      "Rotate on X, Y, and Z axes. Create dramatic angles that grab attention.",
  },
  {
    icon: Layers,
    title: "Depth Shadows",
    description:
      "Realistic shadows that follow your 3D transforms. Adjustable blur and distance.",
  },
  {
    icon: Lightbulb,
    title: "Lighting Effects",
    description:
      "Simulated lighting that responds to your perspective for realistic results.",
  },
];

const useCases = [
  {
    title: "App Store Screenshots",
    description:
      "Create professional app preview images with 3D perspective that increase downloads.",
  },
  {
    title: "Landing Page Heroes",
    description:
      "Eye-catching hero images that showcase your product from dynamic angles.",
  },
  {
    title: "Social Media Posts",
    description:
      "Stand out with 3D styled screenshots that stop the scroll.",
  },
  {
    title: "Product Mockups",
    description:
      "Professional mockups without expensive 3D software or design skills.",
  },
];

export default function ThreeDEffectsPage() {
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://screenshot-studio.com" },
      { "@type": "ListItem", position: 2, name: "Features", item: "https://screenshot-studio.com/features" },
      { "@type": "ListItem", position: 3, name: "3D Effects", item: "https://screenshot-studio.com/features/3d-effects" },
    ],
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Screenshot Studio - 3D Effects",
    applicationCategory: "DesignApplication",
    operatingSystem: "Web Browser",
    description:
      "Free online tool to add 3D perspective, rotation, and depth effects to screenshots.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "3D perspective transforms",
      "X, Y, Z rotation",
      "Depth shadows",
      "Lighting effects",
      "Real-time preview",
    ],
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <Navigation ctaLabel="Try Free" ctaHref="/" />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Free 3D Screenshot Effects
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Transform flat screenshots into stunning 3D visuals. Add
              perspective, rotation, and realistic shadows without any design
              skills.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-8 py-4 rounded-full hover:opacity-90 transition-opacity"
            >
              Add 3D Effects Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="text-sm text-muted-foreground mt-4">
              No signup required. Free forever.
            </p>
          </div>
        </section>

        {/* Effects Grid */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              3D Effects & Transforms
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {effects.map((effect) => (
                <div
                  key={effect.title}
                  className="flex gap-4 p-6 bg-background rounded-xl border"
                >
                  <div className="flex-shrink-0">
                    <effect.icon className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">
                      {effect.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {effect.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Controls Demo */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">
              Easy-to-Use Controls
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Adjust 3D effects with simple sliders. See changes in real-time as
              you experiment with different perspectives.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 border rounded-xl text-center">
                <h3 className="font-semibold mb-2">Rotate X</h3>
                <p className="text-sm text-muted-foreground">
                  Tilt forward or backward for dramatic perspective
                </p>
              </div>
              <div className="p-6 border rounded-xl text-center">
                <h3 className="font-semibold mb-2">Rotate Y</h3>
                <p className="text-sm text-muted-foreground">
                  Turn left or right to show different angles
                </p>
              </div>
              <div className="p-6 border rounded-xl text-center">
                <h3 className="font-semibold mb-2">Rotate Z</h3>
                <p className="text-sm text-muted-foreground">
                  Spin for creative diagonal compositions
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Perfect For
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {useCases.map((useCase) => (
                <div
                  key={useCase.title}
                  className="p-6 bg-background border rounded-xl hover:border-primary transition-colors"
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

        {/* Why 3D */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Why Add 3D Effects?
            </h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-2 h-2 mt-3 rounded-full bg-primary" />
                <div>
                  <h3 className="font-semibold mb-1">Higher Engagement</h3>
                  <p className="text-muted-foreground">
                    3D images get 30% more clicks than flat screenshots in social
                    media posts.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-2 h-2 mt-3 rounded-full bg-primary" />
                <div>
                  <h3 className="font-semibold mb-1">Professional Look</h3>
                  <p className="text-muted-foreground">
                    Add polish without hiring a designer or learning complex 3D
                    software.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-2 h-2 mt-3 rounded-full bg-primary" />
                <div>
                  <h3 className="font-semibold mb-1">Stand Out</h3>
                  <p className="text-muted-foreground">
                    Differentiate your content in crowded feeds where everyone
                    uses flat images.
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
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Add 3D Effects to Your Screenshots
            </h2>
            <p className="text-muted-foreground mb-8">
              No 3D software required. Create stunning visuals in your browser.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-8 py-4 rounded-full hover:opacity-90 transition-opacity"
            >
              Try 3D Effects Free
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>

      <Footer brandName="Screenshot Studio" />
    </div>
  );
}
