import { Metadata } from "next";
import Link from "next/link";
import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { ArrowRight, Play, Wand2, Video, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Free Animation Maker - Create Animated Screenshots & Slideshows",
  description:
    "Create stunning animations from screenshots. Build slideshows with zoom, pan, and fade effects. Export to video or GIF. Free browser-based animation tool.",
  keywords: [
    "animation maker",
    "screenshot animation",
    "slideshow maker",
    "animated slideshow",
    "screenshot to video",
    "zoom animation",
    "pan animation",
    "ken burns effect",
    "free animation tool",
    "animated screenshot maker",
    "product demo animation",
    "screenshot gif maker",
    "app preview video maker",
    "animated mockup generator",
    "screenshot video export free",
  ],
  openGraph: {
    title: "Free Animation Maker - Create Animated Screenshots & Slideshows",
    description:
      "Create stunning animations from screenshots. Zoom, pan, and fade effects with video export.",
    url: "/features/animation-maker",
  },
  alternates: {
    canonical: "/features/animation-maker",
  },
};

const animations = [
  {
    name: "Zoom In",
    description: "Dramatic zoom effect that draws attention to key details",
  },
  {
    name: "Zoom Out",
    description: "Reveal the full picture from a focused starting point",
  },
  {
    name: "Pan Left/Right",
    description: "Smooth horizontal movement across wide screenshots",
  },
  {
    name: "Ken Burns",
    description: "Classic documentary-style slow zoom and pan combo",
  },
  {
    name: "Tilt Up/Down",
    description: "Vertical panning for long screenshots and pages",
  },
  {
    name: "Fade Transitions",
    description: "Elegant crossfade between multiple slides",
  },
];

const features = [
  {
    icon: Wand2,
    title: "20+ Animation Presets",
    description:
      "One-click animations including zoom, pan, tilt, rotate, and Ken Burns effects.",
  },
  {
    icon: Play,
    title: "Timeline Editor",
    description:
      "Fine-tune timing with our visual timeline. Adjust duration, easing, and keyframes.",
  },
  {
    icon: Video,
    title: "Video Export",
    description:
      "Export as MP4 video or animated GIF. Perfect for social media and presentations.",
  },
  {
    icon: Sparkles,
    title: "Slideshow Builder",
    description:
      "Combine multiple screenshots into animated slideshows with transitions.",
  },
];

export default function AnimationMakerPage() {
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://screenshot-studio.com" },
      { "@type": "ListItem", position: 2, name: "Features", item: "https://screenshot-studio.com/features" },
      { "@type": "ListItem", position: 3, name: "Animation Maker", item: "https://screenshot-studio.com/features/animation-maker" },
    ],
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: "Screenshot Studio - Animation Maker",
        applicationCategory: "MultimediaApplication",
        operatingSystem: "Web Browser",
        description:
          "Free online tool to create animated screenshots and slideshows with zoom, pan, and fade effects.",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        featureList: [
          "Zoom animations",
          "Pan effects",
          "Ken Burns effect",
          "Timeline editor",
          "Video export",
          "Slideshow builder",
        ],
      },
      {
        "@type": "HowTo",
        name: "How to Create Screenshot Animations",
        description:
          "Create stunning animations from screenshots in 3 steps using Screenshot Studio's free animation maker.",
        totalTime: "PT2M",
        tool: {
          "@type": "HowToTool",
          name: "Screenshot Studio",
        },
        step: [
          {
            "@type": "HowToStep",
            name: "Upload Your Screenshots",
            text: "Add one or more screenshots to create a slideshow or animate a single image.",
            position: 1,
          },
          {
            "@type": "HowToStep",
            name: "Choose Animation Preset",
            text: "Select from 20+ presets like zoom, pan, Ken Burns, or create custom animations with the timeline.",
            position: 2,
          },
          {
            "@type": "HowToStep",
            name: "Export as Video",
            text: "Download as MP4 video or GIF. Share directly to social media or embed anywhere.",
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
              Free Screenshot Animation Maker
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Bring your screenshots to life with stunning animations. Create
              zoom effects, smooth pans, and animated slideshows. Export to video
              or GIF.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-8 py-4 rounded-full hover:opacity-90 transition-opacity"
            >
              Create Animation Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="text-sm text-muted-foreground mt-4">
              No signup. No watermarks. Export unlimited videos.
            </p>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Powerful Animation Tools
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

        {/* Animation Types */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">
              Animation Effects
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Choose from our library of professional animation presets or
              customize your own with the timeline editor.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {animations.map((animation) => (
                <div
                  key={animation.name}
                  className="p-6 border rounded-xl hover:border-primary transition-colors"
                >
                  <h3 className="font-semibold mb-2">{animation.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {animation.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Perfect For
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-6 bg-background border rounded-xl">
                <h3 className="font-semibold text-lg mb-2">
                  Product Demos
                </h3>
                <p className="text-muted-foreground">
                  Create engaging product walkthroughs that highlight key
                  features with smooth zoom and pan animations.
                </p>
              </div>
              <div className="p-6 bg-background border rounded-xl">
                <h3 className="font-semibold text-lg mb-2">
                  Social Media Content
                </h3>
                <p className="text-muted-foreground">
                  Stand out with animated posts that capture attention in crowded
                  feeds on Twitter, LinkedIn, and more.
                </p>
              </div>
              <div className="p-6 bg-background border rounded-xl">
                <h3 className="font-semibold text-lg mb-2">
                  Tutorial Videos
                </h3>
                <p className="text-muted-foreground">
                  Build step-by-step tutorials by combining screenshots into
                  animated slideshows with clear transitions.
                </p>
              </div>
              <div className="p-6 bg-background border rounded-xl">
                <h3 className="font-semibold text-lg mb-2">
                  Portfolio Showcases
                </h3>
                <p className="text-muted-foreground">
                  Present your work with cinematic Ken Burns effects that add
                  polish and professionalism.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              How to Create Animations
            </h2>
            <div className="space-y-8">
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    Upload Your Screenshots
                  </h3>
                  <p className="text-muted-foreground">
                    Add one or more screenshots to create a slideshow or animate a
                    single image.
                  </p>
                </div>
              </div>
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    Choose Animation Preset
                  </h3>
                  <p className="text-muted-foreground">
                    Select from 20+ presets like zoom, pan, Ken Burns, or create
                    custom animations with the timeline.
                  </p>
                </div>
              </div>
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    Export as Video
                  </h3>
                  <p className="text-muted-foreground">
                    Download as MP4 video or GIF. Share directly to social media
                    or embed anywhere.
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
              Start Creating Animations Today
            </h2>
            <p className="text-muted-foreground mb-8">
              No video editing experience required. Create professional
              animations in minutes.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-8 py-4 rounded-full hover:opacity-90 transition-opacity"
            >
              Try Animation Maker Free
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>

      <Footer brandName="Screenshot Studio" />
    </div>
  );
}
