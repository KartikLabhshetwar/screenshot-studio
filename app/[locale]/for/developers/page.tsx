import { Metadata } from "next";
import Link from "next/link";
import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import {
  ArrowRight,
  Code,
  Github,
  Terminal,
  FileCode,
  Layers,
  Video,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Screenshot Editor for Developers - Free Tool",
  description:
    "Make your code, projects, and portfolio look professional. Beautify terminal screenshots, code snippets, and app UIs with backgrounds, 3D effects, and animations. Free, no signup.",
  keywords: [
    "screenshot editor for developers",
    "code screenshot beautifier",
    "developer portfolio images",
    "github readme images",
    "terminal screenshot tool",
    "code snippet beautifier",
    "developer screenshot tool",
    "project showcase images",
    "github readme screenshot maker",
    "app store screenshot generator",
    "documentation screenshot tool",
    "code screenshot with background",
    "api screenshot beautifier",
    "open source project screenshots",
  ],
  openGraph: {
    title: "Screenshot Editor for Developers",
    description:
      "Beautify code screenshots, terminal output, and project UIs. Free browser-based tool for developers.",
    url: "/for/developers",
  },
  alternates: {
    canonical: "/for/developers",
  },
};

const useCases = [
  {
    icon: Github,
    title: "GitHub README Images",
    description:
      "Make your open source projects stand out with polished screenshots in README files. Add backgrounds and shadows to app screenshots that show off your work at its best.",
  },
  {
    icon: Code,
    title: "Code Snippet Sharing",
    description:
      "Share beautiful code screenshots on Twitter, LinkedIn, or dev blogs. Add gradient backgrounds and device frames that make your code pop in any feed.",
  },
  {
    icon: Terminal,
    title: "Terminal & CLI Output",
    description:
      "Turn raw terminal output into clean visuals for documentation and tutorials. Add macOS window frames and subtle shadows for a professional finish.",
  },
  {
    icon: FileCode,
    title: "Technical Blog Posts",
    description:
      "Create eye-catching hero images and inline screenshots for dev.to, Hashnode, or your personal blog. Consistent styling across all your content.",
  },
  {
    icon: Layers,
    title: "Portfolio & Case Studies",
    description:
      "Showcase your projects with 3D perspective mockups and professional styling. Present your work the way it deserves to be seen.",
  },
  {
    icon: Video,
    title: "Demo Videos & GIFs",
    description:
      "Create animated walkthroughs of your apps with zoom, pan, and transition effects. Export as MP4 or GIF for issue trackers and pull requests.",
  },
];

const workflows = [
  {
    title: "Paste from Clipboard",
    description:
      "Take a screenshot with your OS shortcut, then Cmd+V directly into the editor. No saving files first.",
  },
  {
    title: "Drag & Drop",
    description:
      "Drag any image file from your file manager straight onto the canvas. Supports PNG, JPG, WebP.",
  },
  {
    title: "One-Click Presets",
    description:
      "Pick a preset that matches your style — dark mode gradients, minimal whites, or vibrant colors. Done in seconds.",
  },
];

export default function ForDevelopersPage() {
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
            name: "For Developers",
            item: "https://screenshot-studio.com/for/developers",
          },
        ],
      },
      {
        "@type": "SoftwareApplication",
        name: "Screenshot Studio for Developers",
        applicationCategory: "DesignApplication",
        operatingSystem: "Web Browser",
        description:
          "Free screenshot editor built for developers. Beautify code screenshots, terminal output, and project UIs for READMEs, blogs, and portfolios.",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        featureList: [
          "Code screenshot beautification",
          "Terminal window frames",
          "GitHub README images",
          "3D perspective mockups",
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
              Built for Developers
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
              Screenshot Editor for Developers
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Make your code, projects, and portfolio look professional. Add
              backgrounds, device frames, 3D effects, and animations to any
              screenshot. Free in your browser.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-8 py-4 rounded-full hover:opacity-90 transition-opacity"
              >
                Open Editor
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
                How Developers Use Screenshot Studio
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                From README files to conference talks, make every screenshot
                count.
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

        {/* Workflow */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Fits Your Workflow
              </h2>
              <p className="text-muted-foreground">
                No accounts, no installs, no bloat. Just a fast editor in your
                browser.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {workflows.map((w, i) => (
                <div key={w.title} className="text-center">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl mx-auto mb-4">
                    {i + 1}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{w.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {w.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Devs Choose Us */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Why Developers Choose Screenshot Studio
            </h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-2 h-2 mt-3 rounded-full bg-primary" />
                <div>
                  <h3 className="font-semibold mb-1">Open Source</h3>
                  <p className="text-muted-foreground">
                    Fully open source on GitHub. Inspect the code, contribute, or
                    self-host.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-2 h-2 mt-3 rounded-full bg-primary" />
                <div>
                  <h3 className="font-semibold mb-1">Privacy First</h3>
                  <p className="text-muted-foreground">
                    Everything runs in your browser. Your images never leave your
                    machine.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-2 h-2 mt-3 rounded-full bg-primary" />
                <div>
                  <h3 className="font-semibold mb-1">Fast & Lightweight</h3>
                  <p className="text-muted-foreground">
                    No heavy downloads or Electron apps. Just open a browser tab
                    and start editing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Links */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-center">
              Explore Features
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { href: "/features/screenshot-beautifier", label: "Screenshot Beautifier" },
                { href: "/features/animation-maker", label: "Animation Maker" },
                { href: "/features/3d-effects", label: "3D Effects" },
                { href: "/features/social-media-graphics", label: "Social Media Graphics" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center justify-between p-4 bg-muted/30 border rounded-xl hover:border-primary transition-colors group"
                >
                  <span className="font-medium text-sm">{link.label}</span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ship Better Looking Projects
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
