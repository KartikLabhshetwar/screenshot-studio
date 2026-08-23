import { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight01Icon,
  CubeIcon,
  Layers01Icon,
  RotateClockwiseIcon,
  IdeaIcon,
} from "hugeicons-react";
import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";

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

const INTER =
  'Inter, "Inter Fallback", Arial, Helvetica, sans-serif';

const ctaClassName =
  "relative inline-flex items-center justify-center rounded-md border-0 bg-[var(--nav-cta-bg)] px-6 py-2.5 text-base font-medium text-[var(--nav-cta-fg)] shadow-none transition-[transform,box-shadow] duration-150 ease-out [text-shadow:var(--nav-cta-text-shadow)] hover:shadow-[var(--nav-cta-hover-shadow)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 active:scale-[0.97]";

const cardSurface =
  "rounded-2xl bg-card ring-1 ring-border shadow-[var(--card-edge-shadow)]";

const chipLinkClassName =
  "group flex items-center justify-between rounded-md bg-foreground/[0.04] px-4 py-3 text-sm font-medium text-foreground/90 ring-1 ring-border transition-colors hover:bg-foreground/[0.08] hover:text-foreground";

const effects = [
  {
    icon: CubeIcon,
    title: "3D Perspective",
    description:
      "Add depth with perspective transforms. Make flat screenshots look like real product shots.",
  },
  {
    icon: RotateClockwiseIcon,
    title: "Rotation & Tilt",
    description:
      "Rotate on X, Y, and Z axes. Create dramatic angles that grab attention.",
  },
  {
    icon: Layers01Icon,
    title: "Depth Shadows",
    description:
      "Realistic shadows that follow your 3D transforms. Adjustable blur and distance.",
  },
  {
    icon: IdeaIcon,
    title: "Lighting Effects",
    description:
      "Simulated lighting that responds to your perspective for realistic results.",
  },
] as const;

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

const whyPoints = [
  {
    title: "Higher Engagement",
    description:
      "3D images get 30% more clicks than flat screenshots in social media posts.",
  },
  {
    title: "Professional Look",
    description:
      "Add polish without hiring a designer or learning complex 3D software.",
  },
  {
    title: "Stand Out",
    description:
      "Differentiate your content in crowded feeds where everyone uses flat images.",
  },
];

const relatedLinks = [
  { href: "/features/screenshot-beautifier", label: "Screenshot Beautifier" },
  { href: "/features/social-media-graphics", label: "Social Media Graphics" },
  { href: "/features/animation-maker", label: "Animation Maker" },
] as const;

export default function ThreeDEffectsPage() {
  const breadcrumb = {
    "@context": "https://schema.org",
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
        name: "Features",
        item: "https://www.screenshot-studio.com/features",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "3D Effects",
        item: "https://www.screenshot-studio.com/features/3d-effects",
      },
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

      <Navigation brandName="Screenshot Studio" />

      <main className="flex-1">
        <section className="px-6 pb-20 pt-32">
          <div className="mx-auto max-w-4xl text-center">
            <h1
              className="mb-6 text-4xl font-semibold tracking-[-0.03em] text-foreground md:text-6xl"
              style={{ fontFamily: INTER }}
            >
              Free 3D Screenshot Effects
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground md:text-xl">
              Transform flat screenshots into stunning 3D visuals. Add
              perspective, rotation, and realistic shadows without any design
              skills.
            </p>
            <div className="flex flex-col items-center">
              <Link href="/" className={ctaClassName}>
                Add 3D Effects Free
              </Link>
              <p className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground/70">
                <span>100% Free</span>
                <span className="h-3 w-px bg-border" aria-hidden />
                <span>No Signup Required</span>
              </p>
            </div>
          </div>
        </section>

        <section className="border-y border-border px-6 py-16">
          <div className="mx-auto max-w-6xl">
            <h2
              className="mb-12 text-center text-3xl font-semibold tracking-[-0.03em] text-foreground"
              style={{ fontFamily: INTER }}
            >
              3D Effects & Transforms
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {effects.map((effect) => (
                <div
                  key={effect.title}
                  className={`flex gap-4 p-6 ${cardSurface}`}
                >
                  <effect.icon
                    className="size-6 shrink-0 text-foreground"
                    aria-hidden
                  />
                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-foreground">
                      {effect.title}
                    </h3>
                    <p className="text-muted-foreground">{effect.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-16">
          <div className="mx-auto max-w-4xl">
            <h2
              className="mb-4 text-center text-3xl font-semibold tracking-[-0.03em] text-foreground"
              style={{ fontFamily: INTER }}
            >
              Easy-to-Use Controls
            </h2>
            <p className="mx-auto mb-12 max-w-2xl text-center text-muted-foreground">
              Adjust 3D effects with simple sliders. See changes in real-time as
              you experiment with different perspectives.
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                {
                  title: "Rotate X",
                  description:
                    "Tilt forward or backward for dramatic perspective",
                },
                {
                  title: "Rotate Y",
                  description: "Turn left or right to show different angles",
                },
                {
                  title: "Rotate Z",
                  description: "Spin for creative diagonal compositions",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className={`p-6 text-center ${cardSurface}`}
                >
                  <h3 className="mb-2 font-semibold text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-border px-6 py-16">
          <div className="mx-auto max-w-6xl">
            <h2
              className="mb-12 text-center text-3xl font-semibold tracking-[-0.03em] text-foreground"
              style={{ fontFamily: INTER }}
            >
              Perfect For
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {useCases.map((useCase) => (
                <div key={useCase.title} className={`p-6 ${cardSurface}`}>
                  <h3 className="mb-2 font-semibold text-foreground">
                    {useCase.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {useCase.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-16">
          <div className="mx-auto max-w-4xl">
            <h2
              className="mb-12 text-center text-3xl font-semibold tracking-[-0.03em] text-foreground"
              style={{ fontFamily: INTER }}
            >
              Why Add 3D Effects?
            </h2>
            <div className="space-y-6">
              {whyPoints.map((point) => (
                <div key={point.title} className="flex gap-4">
                  <div
                    className="mt-3 size-2 shrink-0 rounded-full bg-primary"
                    aria-hidden
                  />
                  <div>
                    <h3 className="mb-1 font-semibold text-foreground">
                      {point.title}
                    </h3>
                    <p className="text-muted-foreground">{point.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-border px-6 py-16">
          <div className="mx-auto max-w-4xl">
            <h2
              className="mb-8 text-center text-2xl font-semibold tracking-[-0.03em] text-foreground"
              style={{ fontFamily: INTER }}
            >
              Explore More Features
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {relatedLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={chipLinkClassName}
                >
                  <span>{link.label}</span>
                  <ArrowRight01Icon
                    className="size-3.5 text-muted-foreground/70 transition-colors group-hover:text-foreground"
                    aria-hidden
                  />
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-20">
          <div className="mx-auto max-w-4xl text-center">
            <h2
              className="mb-4 text-3xl font-semibold tracking-[-0.03em] text-foreground"
              style={{ fontFamily: INTER }}
            >
              Add 3D Effects to Your Screenshots
            </h2>
            <p className="mb-8 text-muted-foreground">
              No 3D software required. Create stunning visuals in your browser.
            </p>
            <Link href="/" className={ctaClassName}>
              Try 3D Effects Free
            </Link>
          </div>
        </section>
      </main>

      <Footer brandName="Screenshot Studio" />
    </div>
  );
}
