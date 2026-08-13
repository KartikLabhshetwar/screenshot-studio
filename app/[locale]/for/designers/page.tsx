import { Metadata } from "next";
import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import Link from "next/link";
import {
  PaintBoardIcon,
  ColorsIcon,
  PenTool01Icon,
  SmartPhone01Icon,
  Layers01Icon,
  EyeIcon,
  SparklesIcon,
} from "hugeicons-react";

export const metadata: Metadata = {
  title: "Screenshot Studio for Designers - Professional Design Tools",
  description:
    "Create stunning screenshots and mockups for your design portfolio. Perfect for UI/UX designers, graphic designers, and creative professionals.",
  keywords: [
    "screenshot tool for designers",
    "UI mockup creator",
    "design portfolio screenshots",
    "designer screenshot editor",
  ],
};

const ctaClassName =
  "relative inline-flex items-center justify-center rounded-md border-0 bg-[var(--nav-cta-bg)] px-6 py-2.5 text-base font-medium text-[var(--nav-cta-fg)] shadow-none transition-[transform,box-shadow] duration-150 ease-out [text-shadow:var(--nav-cta-text-shadow)] hover:shadow-[var(--nav-cta-hover-shadow)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 active:scale-[0.97]";

const secondaryCtaClassName =
  "inline-flex items-center justify-center rounded-md px-6 py-2.5 text-base font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground active:scale-[0.99]";

const cardSurface =
  "rounded-2xl bg-card p-6 ring-1 ring-inset ring-border shadow-[var(--card-highlight-shadow)]";

const INTER =
  "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

const useCases = [
  {
    icon: PaintBoardIcon,
    title: "Portfolio Presentations",
    description:
      "Showcase your UI designs with professional mockups and beautiful presentations",
  },
  {
    icon: ColorsIcon,
    title: "Client Presentations",
    description:
      "Create polished mockups for client reviews and design presentations",
  },
  {
    icon: PenTool01Icon,
    title: "Design Systems",
    description:
      "Document your design systems with clear, consistent visual examples",
  },
  {
    icon: SmartPhone01Icon,
    title: "App Store Assets",
    description:
      "Generate stunning screenshots for App Store and Play Store listings",
  },
];

const features = [
  {
    icon: Layers01Icon,
    title: "Advanced Layering",
    description: "Full control over layers, shadows, and visual hierarchy",
  },
  {
    icon: EyeIcon,
    title: "Precise Controls",
    description: "Pixel-perfect adjustments for professional results",
  },
  {
    icon: ColorsIcon,
    title: "Color Palettes",
    description: "Beautiful gradients and solid colors for any brand",
  },
  {
    icon: SparklesIcon,
    title: "Export Options",
    description: "High-resolution exports in multiple formats",
  },
];

export default function ForDesignersPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-4xl text-center">
            <p
              className="mb-6 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground"
              style={{ fontFamily: INTER }}
            >
              Built for Designers
            </p>
            <h1
              className="mb-6 text-5xl font-semibold tracking-[-0.04em] text-foreground md:text-6xl"
              style={{ fontFamily: INTER }}
            >
              Design Tools That Match Your Standards
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-xl leading-relaxed text-muted-foreground">
              Create portfolio-worthy screenshots and mockups with the precision
              and control that designers demand. No compromises on quality.
            </p>
            <div className="mb-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/" className={ctaClassName}>
                Start Designing Free
              </Link>
              <Link href="/features" className={secondaryCtaClassName}>
                See All Features
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border py-20">
        <div className="container mx-auto px-6">
          <div className="mb-16 text-center">
            <h2
              className="mb-4 text-3xl font-semibold tracking-[-0.03em] text-foreground md:text-4xl"
              style={{ fontFamily: INTER }}
            >
              Perfect for Every Design Workflow
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              From client presentations to portfolio pieces, we&apos;ve got you
              covered
            </p>
          </div>

          <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2">
            {useCases.map((useCase) => (
              <div key={useCase.title} className={cardSurface}>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-foreground/[0.06] text-foreground ring-1 ring-inset ring-border">
                  <useCase.icon size={24} strokeWidth={1.75} />
                </div>
                <h3
                  className="mb-2 text-xl font-semibold tracking-[-0.02em] text-foreground"
                  style={{ fontFamily: INTER }}
                >
                  {useCase.title}
                </h3>
                <p className="text-muted-foreground">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border py-20">
        <div className="container mx-auto px-6">
          <div className="mb-16 text-center">
            <h2
              className="mb-4 text-3xl font-semibold tracking-[-0.03em] text-foreground md:text-4xl"
              style={{ fontFamily: INTER }}
            >
              Features Designers Love
            </h2>
          </div>

          <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.title} className={`${cardSurface} text-center`}>
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-foreground/[0.06] text-foreground ring-1 ring-inset ring-border">
                  <feature.icon size={24} strokeWidth={1.75} />
                </div>
                <h3
                  className="mb-2 text-lg font-semibold tracking-[-0.02em] text-foreground"
                  style={{ fontFamily: INTER }}
                >
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border py-20">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2
              className="mb-6 text-3xl font-semibold tracking-[-0.03em] text-foreground md:text-4xl"
              style={{ fontFamily: INTER }}
            >
              Ready to Elevate Your Design Presentations?
            </h2>
            <p className="mb-8 text-xl text-muted-foreground">
              Join thousands of designers creating stunning visual content
            </p>
            <Link href="/" className={ctaClassName}>
              Start Creating Free
            </Link>
          </div>
        </div>
      </section>

      <Footer brandName="Screenshot Studio" />
    </div>
  );
}
