import { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight01Icon,
  ColorsIcon,
  Download04Icon,
  Link01Icon,
  SourceCodeIcon,
} from "hugeicons-react";
import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { OG_DEFAULTS } from "@/lib/seo/metadata";

export const metadata: Metadata = {
  title: "Code to Image Generator: Free Code Screenshots",
  description:
    "Free code to image tool: pick a syntax theme, gradient background, line numbers, and window frame, then export a crisp PNG. A free ray.so and carbon.now.sh alternative. No signup.",
  keywords: [
    "code to image",
    "code snippet screenshot",
    "code screenshot generator",
    "code to png",
    "ray.so alternative",
    "carbon alternative",
    "carbon.now.sh alternative",
    "syntax highlighting screenshot",
    "beautiful code screenshots",
    "code image generator free",
    "share code as image",
    "code snippet to image",
    "programming screenshot tool",
  ],
  openGraph: {
    ...OG_DEFAULTS,
    title: "Code to Image Generator - Screenshot Studio",
    description:
      "Turn code into beautiful, shareable images. Themes, gradients, line numbers, and window frames. Free, no signup.",
    url: "/features/code-snippets",
  },
  alternates: {
    canonical: "/features/code-snippets",
  },
};

const INTER = 'Inter, "Inter Fallback", Arial, Helvetica, sans-serif';

const ctaClassName =
  "relative inline-flex items-center justify-center rounded-md border-0 bg-[var(--nav-cta-bg)] px-6 py-2.5 text-base font-medium text-[var(--nav-cta-fg)] shadow-none transition-[transform,box-shadow] duration-150 ease-out [text-shadow:var(--nav-cta-text-shadow)] hover:shadow-[var(--nav-cta-hover-shadow)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 active:scale-[0.97]";

const cardSurface =
  "rounded-2xl bg-card ring-1 ring-border shadow-[var(--card-edge-shadow)]";

const chipLinkClassName =
  "group flex items-center justify-between rounded-md bg-foreground/[0.04] px-4 py-3 text-sm font-medium text-foreground/90 ring-1 ring-border transition-colors hover:bg-foreground/[0.08] hover:text-foreground";

const features = [
  {
    icon: SourceCodeIcon,
    title: "14 Syntax Themes",
    description:
      "Midnight, Sunset, Candy, and more. Auto-detects your language or pick from 20+ manually.",
  },
  {
    icon: ColorsIcon,
    title: "Gradients, Images & Patterns",
    description:
      "Every theme ships its own gradient, or pick from dozens of gradients, image backgrounds, and patterns, or turn the background off for a transparent PNG.",
  },
  {
    icon: Download04Icon,
    title: "Line Numbers & Window Frame",
    description:
      "Toggle line numbers, a macOS-style title bar or none at all, and resize the frame to fit your code.",
  },
  {
    icon: Link01Icon,
    title: "Shareable Links & 2x/4x Export",
    description:
      "Every setting is saved to the URL, so you can share a link or export a 2x or 4x PNG.",
  },
] as const;

const howToSteps = [
  {
    step: "1",
    title: "Paste or Type Your Code",
    description:
      "Drop in a snippet or start typing directly in the code card. Formatting and indentation are preserved.",
  },
  {
    step: "2",
    title: "Pick a Theme and Background",
    description:
      "Choose a syntax theme, a gradient, padding, and whether to show line numbers or a window frame.",
  },
  {
    step: "3",
    title: "Export or Share",
    description:
      "Download a 2x PNG, copy the image to your clipboard, or copy a link that reopens your exact design.",
  },
];

const faqs = [
  {
    question: "Is the code to image generator free?",
    answer:
      "Yes. It is completely free, with no signup, no watermark, and no paid tier.",
  },
  {
    question: "How is this different from ray.so or carbon.now.sh?",
    answer:
      "It covers the same core workflow, themes, gradients, line numbers, and a window frame, built into Screenshot Studio's own editor, with shareable links and no account required.",
  },
  {
    question: "Can I export a transparent background?",
    answer:
      'Yes. Set the background to "Transparent" before exporting and the PNG will have no backdrop.',
  },
  {
    question: "Which languages are supported?",
    answer:
      "Auto-detect picks up most popular languages automatically, or you can choose from 20+ languages manually, including TypeScript, Python, Rust, Go, and SQL.",
  },
  {
    question: "Is my code uploaded anywhere?",
    answer:
      "The code card is rendered and exported entirely in your browser, so your code is not sent to a server to create the image.",
  },
];

const relatedLinks = [
  { href: "/code", label: "Open the Code Image Editor" },
  { href: "/features/screenshot-beautifier", label: "Screenshot Beautifier" },
  { href: "/features/browser-mockups", label: "Browser Mockups" },
  { href: "/features/social-media-graphics", label: "Social Media Graphics" },
  { href: "/features", label: "All Features" },
] as const;

export default function CodeSnippetsFeaturePage() {
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
        name: "Code Images",
        item: "https://www.screenshot-studio.com/features/code-snippets",
      },
    ],
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: "Screenshot Studio - Code to Image",
        applicationCategory: "DesignApplication",
        operatingSystem: "Web Browser",
        description:
          "Free online tool that turns code into beautiful, shareable images with syntax themes, gradient backgrounds, and a window frame.",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        featureList: [
          "14 syntax highlighting themes",
          "Gradient, image, and pattern backgrounds plus transparent export",
          "Line numbers and macOS window frame",
          "Shareable links and 2x or 4x PNG export",
          "No signup required",
        ],
      },
      {
        "@type": "HowTo",
        name: "How to Turn Code Into an Image",
        description:
          "Create a shareable code screenshot in three steps using Screenshot Studio.",
        totalTime: "PT1M",
        tool: {
          "@type": "HowToTool",
          name: "Screenshot Studio",
        },
        step: howToSteps.map((item, index) => ({
          "@type": "HowToStep",
          name: item.title,
          text: item.description,
          position: index + 1,
        })),
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <Navigation brandName="Screenshot Studio" />

      <main className="flex-1">
        <section className="px-6 pb-20 pt-32">
          <div className="mx-auto max-w-4xl text-center">
            <h1
              className="mb-6 text-4xl font-semibold tracking-[-0.03em] text-foreground md:text-6xl"
              style={{ fontFamily: INTER }}
            >
              Turn Code Into Beautiful Images
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground md:text-xl">
              Pick a theme, a gradient background, line numbers, and a window
              frame, then export a crisp PNG or share a link. A free ray.so
              and carbon.now.sh alternative.
            </p>
            <div className="flex flex-col items-center">
              <Link href="/code" className={ctaClassName}>
                Create a Code Image
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
              Everything You Need for a Great Code Screenshot
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className={`flex gap-4 p-6 ${cardSurface}`}
                >
                  <feature.icon
                    className="size-6 shrink-0 text-foreground"
                    aria-hidden
                  />
                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
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
              How It Works
            </h2>
            <div className="space-y-8">
              {howToSteps.map((item) => (
                <div key={item.step} className="flex items-start gap-6">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary text-sm font-semibold text-primary-foreground">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="mb-1 text-lg font-semibold text-foreground">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-border px-6 py-16">
          <div className="mx-auto max-w-3xl">
            <h2
              className="mb-12 text-center text-3xl font-semibold tracking-[-0.03em] text-foreground"
              style={{ fontFamily: INTER }}
            >
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {faqs.map((faq) => (
                <div key={faq.question} className={`p-6 ${cardSurface}`}>
                  <h3 className="mb-2 font-semibold text-foreground">
                    {faq.question}
                  </h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
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
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
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
              Ready to Turn Your Code Into an Image?
            </h2>
            <p className="mb-8 text-muted-foreground">
              Free, fast, and no account needed.
            </p>
            <Link href="/code" className={ctaClassName}>
              Open Code Images
            </Link>
          </div>
        </section>
      </main>

      <Footer brandName="Screenshot Studio" />
    </div>
  );
}
