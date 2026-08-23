import { Metadata } from "next";
import Link from "next/link";
import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import {
  Github01Icon,
  SourceCodeIcon,
  ComputerTerminal01Icon,
  DocumentCodeIcon,
  Layers01Icon,
  Video01Icon,
  ArrowRight01Icon,
} from "hugeicons-react";

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

const ctaClassName =
  "relative inline-flex items-center justify-center rounded-md border-0 bg-[var(--nav-cta-bg)] px-6 py-2.5 text-base font-medium text-[var(--nav-cta-fg)] shadow-none transition-[transform,box-shadow] duration-150 ease-out [text-shadow:var(--nav-cta-text-shadow)] hover:shadow-[var(--nav-cta-hover-shadow)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 active:scale-[0.97]";

const secondaryCtaClassName =
  "inline-flex items-center justify-center rounded-md px-6 py-2.5 text-base font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground active:scale-[0.99]";

const cardSurface =
  "rounded-2xl bg-card p-6 ring-1 ring-inset ring-border shadow-[var(--card-highlight-shadow)]";

const chipLinkClassName =
  "group flex items-center justify-between rounded-md bg-foreground/[0.04] px-4 py-3 text-sm font-medium text-foreground/90 ring-1 ring-border transition-colors hover:bg-foreground/[0.08] hover:text-foreground";

const INTER =
  "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

const useCases = [
  {
    icon: Github01Icon,
    title: "GitHub README Images",
    description:
      "Make your open source projects stand out with polished screenshots in README files. Add backgrounds and shadows to app screenshots that show off your work at its best.",
  },
  {
    icon: SourceCodeIcon,
    title: "Code Snippet Sharing",
    description:
      "Share beautiful code screenshots on Twitter, LinkedIn, or dev blogs. Add gradient backgrounds and device frames that make your code pop in any feed.",
  },
  {
    icon: ComputerTerminal01Icon,
    title: "Terminal & CLI Output",
    description:
      "Turn raw terminal output into clean visuals for documentation and tutorials. Add macOS window frames and subtle shadows for a professional finish.",
  },
  {
    icon: DocumentCodeIcon,
    title: "Technical Blog Posts",
    description:
      "Create eye-catching hero images and inline screenshots for dev.to, Hashnode, or your personal blog. Consistent styling across all your content.",
  },
  {
    icon: Layers01Icon,
    title: "Portfolio & Case Studies",
    description:
      "Showcase your projects with 3D perspective mockups and professional styling. Present your work the way it deserves to be seen.",
  },
  {
    icon: Video01Icon,
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
      "Pick a preset that matches your style. Dark mode gradients, minimal whites, or vibrant colors. Done in seconds.",
  },
];

const reasons = [
  {
    title: "Open Source",
    description:
      "Fully open source on GitHub. Inspect the code, contribute, or self-host.",
  },
  {
    title: "Privacy First",
    description:
      "Editing runs in your browser. Imported images are not uploaded to edit them, and export compression returns the finished image without storing it.",
  },
  {
    title: "Fast & Lightweight",
    description:
      "No heavy downloads or Electron apps. Just open a browser tab and start editing.",
  },
];

const featureLinks = [
  { href: "/features/screenshot-beautifier", label: "Screenshot Beautifier" },
  { href: "/features/animation-maker", label: "Animation Maker" },
  { href: "/features/3d-effects", label: "3D Effects" },
  { href: "/features/social-media-graphics", label: "Social Media Graphics" },
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
            item: "https://www.screenshot-studio.com",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "For Developers",
            item: "https://www.screenshot-studio.com/for/developers",
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
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Navigation />

      <main className="flex-1">
        <section className="px-6 pb-20 pt-32">
          <div className="mx-auto max-w-4xl text-center">
            <p
              className="mb-6 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground"
              style={{ fontFamily: INTER }}
            >
              Built for Developers
            </p>
            <h1
              className="mb-6 text-4xl font-semibold tracking-[-0.04em] text-foreground md:text-6xl"
              style={{ fontFamily: INTER }}
            >
              Screenshot Editor for Developers
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground md:text-xl">
              Make your code, projects, and portfolio look professional. Add
              backgrounds, device frames, 3D effects, and animations to any
              screenshot. Free in your browser.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/" className={ctaClassName}>
                Open Editor
              </Link>
              <Link href="/features" className={secondaryCtaClassName}>
                See All Features
              </Link>
            </div>
          </div>
        </section>

        <section className="border-t border-border px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 text-center">
              <h2
                className="mb-4 text-3xl font-semibold tracking-[-0.03em] text-foreground md:text-4xl"
                style={{ fontFamily: INTER }}
              >
                How Developers Use Screenshot Studio
              </h2>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                From README files to conference talks, make every screenshot
                count.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {useCases.map((uc) => (
                <div key={uc.title} className={`${cardSurface} flex gap-4`}>
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-foreground/[0.06] text-foreground ring-1 ring-inset ring-border">
                    <uc.icon size={20} strokeWidth={1.75} />
                  </div>
                  <div>
                    <h3
                      className="mb-2 text-lg font-semibold tracking-[-0.02em] text-foreground"
                      style={{ fontFamily: INTER }}
                    >
                      {uc.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {uc.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-border px-6 py-20">
          <div className="mx-auto max-w-4xl">
            <div className="mb-16 text-center">
              <h2
                className="mb-4 text-3xl font-semibold tracking-[-0.03em] text-foreground md:text-4xl"
                style={{ fontFamily: INTER }}
              >
                Fits Your Workflow
              </h2>
              <p className="text-muted-foreground">
                No accounts, no installs, no bloat. Just a fast editor in your
                browser.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {workflows.map((w, i) => (
                <div key={w.title} className="text-center">
                  <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-md bg-primary text-base font-semibold text-primary-foreground">
                    {i + 1}
                  </div>
                  <h3
                    className="mb-2 text-lg font-semibold tracking-[-0.02em] text-foreground"
                    style={{ fontFamily: INTER }}
                  >
                    {w.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{w.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-border px-6 py-20">
          <div className="mx-auto max-w-4xl">
            <h2
              className="mb-12 text-center text-3xl font-semibold tracking-[-0.03em] text-foreground"
              style={{ fontFamily: INTER }}
            >
              Why Developers Choose Screenshot Studio
            </h2>
            <div className="space-y-6">
              {reasons.map((reason) => (
                <div key={reason.title} className="flex gap-4">
                  <div className="mt-3 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  <div>
                    <h3
                      className="mb-1 font-semibold tracking-[-0.02em] text-foreground"
                      style={{ fontFamily: INTER }}
                    >
                      {reason.title}
                    </h3>
                    <p className="text-muted-foreground">{reason.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-border px-6 py-16">
          <div className="mx-auto max-w-4xl">
            <h2
              className="mb-8 text-center text-2xl font-semibold tracking-[-0.03em] text-foreground"
              style={{ fontFamily: INTER }}
            >
              Explore Features
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {featureLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={chipLinkClassName}
                >
                  <span>
                    {link.label}
                  </span>
                  <ArrowRight01Icon
                    size={14}
                    strokeWidth={1.75}
                    className="size-3.5 shrink-0 text-muted-foreground/70 transition-colors group-hover:text-foreground"
                  />
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-border px-6 py-20">
          <div className="mx-auto max-w-3xl text-center">
            <h2
              className="mb-4 text-3xl font-semibold tracking-[-0.03em] text-foreground md:text-4xl"
              style={{ fontFamily: INTER }}
            >
              Ship Better Looking Projects
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Free forever. No signup. No watermarks.
            </p>
            <Link href="/" className={ctaClassName}>
              Open Editor
            </Link>
          </div>
        </section>
      </main>

      <Footer brandName="Screenshot Studio" />
    </div>
  );
}
