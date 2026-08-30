import { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight01Icon,
  InstagramIcon,
  Linkedin01Icon,
  NewTwitterIcon,
  Share08Icon,
} from "hugeicons-react";
import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Free Social Media Graphics Maker",
  description:
    "Create social media graphics for Twitter, LinkedIn, and Instagram. Turn screenshots into shareable posts with perfect dimensions. Free, no signup.",
  keywords: [
    "social media graphics maker",
    "twitter card generator",
    "linkedin post maker",
    "instagram post creator",
    "social media image editor",
    "free graphics maker",
    "social media templates",
    "twitter post image maker",
    "og image generator free",
    "social media screenshot tool",
    "product hunt screenshot maker",
    "social media mockup generator",
    "twitter banner maker free",
  ],
  openGraph: {
    title: "Free Social Media Graphics Maker - Create Stunning Posts",
    description:
      "Create professional social media graphics. Perfect dimensions for every platform.",
    url: "/features/social-media-graphics",
  },
  alternates: {
    canonical: "/features/social-media-graphics",
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

const platforms = [
  {
    icon: NewTwitterIcon,
    name: "Twitter / X",
    dimensions: "1200 x 675px",
    description:
      "Create eye-catching Twitter cards and post images that drive engagement.",
  },
  {
    icon: Linkedin01Icon,
    name: "LinkedIn",
    dimensions: "1200 x 627px",
    description:
      "Professional graphics for LinkedIn posts that establish authority.",
  },
  {
    icon: InstagramIcon,
    name: "Instagram",
    dimensions: "1080 x 1080px",
    description: "Square posts and stories that stand out in crowded feeds.",
  },
  {
    icon: Share08Icon,
    name: "Any Platform",
    dimensions: "Custom sizes",
    description:
      "Export at any dimension for blogs, presentations, or documentation.",
  },
] as const;

const benefits = [
  {
    title: "No Design Skills Needed",
    description:
      "Our intuitive editor makes it easy to create professional graphics in minutes.",
  },
  {
    title: "Consistent Branding",
    description:
      "Use custom backgrounds and colors to match your brand identity across all posts.",
  },
  {
    title: "High Resolution Output",
    description:
      "Export at up to 5x resolution for crisp graphics on any device.",
  },
  {
    title: "Zero Cost",
    description:
      "Create unlimited graphics without watermarks. 100% free forever.",
  },
];

const createItems = [
  {
    title: "Product Announcements",
    description:
      "Share new features with beautiful screenshots that get clicks.",
  },
  {
    title: "Tutorial Screenshots",
    description:
      "Create professional how-to content that builds authority.",
  },
  {
    title: "Code Snippets",
    description:
      "Share code with beautiful backgrounds that developers love.",
  },
];

const relatedLinks = [
  { href: "/features/screenshot-beautifier", label: "Screenshot Beautifier" },
  { href: "/features/animation-maker", label: "Animation Maker" },
  { href: "/features/3d-effects", label: "3D Effects" },
] as const;

export default function SocialMediaGraphicsPage() {
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
        name: "Social Media Graphics",
        item: "https://www.screenshot-studio.com/features/social-media-graphics",
      },
    ],
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Screenshot Studio - Social Media Graphics Maker",
    applicationCategory: "DesignApplication",
    operatingSystem: "Web Browser",
    description:
      "Free online tool to create professional social media graphics for Twitter, LinkedIn, and Instagram.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Twitter card generator",
      "LinkedIn post maker",
      "Instagram graphics",
      "Custom dimensions",
      "High-resolution export",
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
              Social Media Graphics Maker
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground md:text-xl">
              Create stunning graphics for Twitter, LinkedIn, and Instagram in
              seconds. Transform screenshots into shareable content that drives
              engagement.
            </p>
            <div className="flex flex-col items-center">
              <Link href="/" className={ctaClassName}>
                Create Graphics Free
              </Link>
              <p className="mt-4 inline-flex flex-wrap items-center justify-center gap-2 text-sm font-medium text-muted-foreground/70">
                <span>No Signup</span>
                <span className="h-3 w-px bg-border" aria-hidden />
                <span>No Watermarks</span>
                <span className="h-3 w-px bg-border" aria-hidden />
                <span>Completely Free</span>
              </p>
            </div>
          </div>
        </section>

        <section className="border-y border-border px-6 py-16">
          <div className="mx-auto max-w-6xl">
            <h2
              className="mb-4 text-center text-3xl font-semibold tracking-[-0.03em] text-foreground"
              style={{ fontFamily: INTER }}
            >
              Perfect Dimensions for Every Platform
            </h2>
            <p className="mx-auto mb-12 max-w-2xl text-center text-muted-foreground">
              Create graphics optimized for each social platform with the right
              aspect ratios and resolutions.
            </p>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {platforms.map((platform) => (
                <div key={platform.name} className={`p-6 ${cardSurface}`}>
                  <platform.icon
                    className="mb-4 size-8 text-foreground"
                    aria-hidden
                  />
                  <h3 className="mb-1 text-lg font-semibold text-foreground">
                    {platform.name}
                  </h3>
                  <p className="mb-2 text-sm text-foreground/90">
                    {platform.dimensions}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {platform.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-16">
          <div className="mx-auto max-w-6xl">
            <h2
              className="mb-12 text-center text-3xl font-semibold tracking-[-0.03em] text-foreground"
              style={{ fontFamily: INTER }}
            >
              Why Creators Choose Screenshot Studio
            </h2>
            <div className="grid gap-8 md:grid-cols-2">
              {benefits.map((benefit) => (
                <div key={benefit.title} className="flex gap-4">
                  <div
                    className="mt-3 size-2 shrink-0 rounded-full bg-primary"
                    aria-hidden
                  />
                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-foreground">
                      {benefit.title}
                    </h3>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-border px-6 py-16">
          <div className="mx-auto max-w-4xl">
            <h2
              className="mb-12 text-center text-3xl font-semibold tracking-[-0.03em] text-foreground"
              style={{ fontFamily: INTER }}
            >
              What Can You Create?
            </h2>
            <div className="grid gap-4 md:grid-cols-3">
              {createItems.map((item) => (
                <div key={item.title} className={`p-6 ${cardSurface}`}>
                  <h3 className="mb-2 font-semibold text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-16">
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

        <section className="border-t border-border px-6 py-20">
          <div className="mx-auto max-w-4xl text-center">
            <h2
              className="mb-4 text-3xl font-semibold tracking-[-0.03em] text-foreground"
              style={{ fontFamily: INTER }}
            >
              Start Creating Social Media Graphics
            </h2>
            <p className="mb-8 text-muted-foreground">
              No design experience required. Start creating in 30 seconds.
            </p>
            <Link href="/" className={ctaClassName}>
              Try Free Now
            </Link>
          </div>
        </section>
      </main>

      <Footer brandName="Screenshot Studio" />
    </div>
  );
}
