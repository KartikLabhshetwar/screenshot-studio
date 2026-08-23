import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { ArrowRight01Icon, Tick02Icon, Cancel01Icon } from "hugeicons-react";
import {
  comparisons,
  getComparison,
  getAllComparisonSlugs,
} from "@/lib/seo/comparisons";
import { OG_DEFAULTS } from "@/lib/seo/metadata";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllComparisonSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = getComparison(slug);
  if (!data) return {};

  return {
    title: data.metaTitle,
    description: data.metaDescription,
    keywords: data.keywords,
    openGraph: {
      ...OG_DEFAULTS,
      title: data.metaTitle,
      description: data.metaDescription,
      url: `/compare/${data.slug}`,
    },
    alternates: {
      canonical: `/compare/${data.slug}`,
    },
  };
}

const ctaClassName =
  "relative inline-flex items-center justify-center rounded-md border-0 bg-[var(--nav-cta-bg)] px-6 py-2.5 text-base font-medium text-[var(--nav-cta-fg)] shadow-none transition-[transform,box-shadow] duration-150 ease-out [text-shadow:var(--nav-cta-text-shadow)] hover:shadow-[var(--nav-cta-hover-shadow)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 active:scale-[0.97]";

const chipLinkClassName =
  "group flex items-center justify-between rounded-md bg-foreground/[0.04] px-4 py-3 text-sm font-medium text-foreground/90 ring-1 ring-border transition-colors hover:bg-foreground/[0.08] hover:text-foreground";

const INTER =
  "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

function FeatureStatus({
  value,
  emphasize,
}: {
  value: string;
  emphasize?: boolean;
}): React.JSX.Element {
  const unavailable = value.toLowerCase() === "not available";

  return (
    <span className="flex items-center gap-2">
      {unavailable ? (
        <Cancel01Icon
          size={16}
          strokeWidth={1.75}
          className="shrink-0 text-muted-foreground/70"
        />
      ) : (
        <Tick02Icon
          size={16}
          strokeWidth={1.75}
          className={
            emphasize
              ? "shrink-0 text-foreground"
              : "shrink-0 text-muted-foreground"
          }
        />
      )}
      {value}
    </span>
  );
}

export default async function ComparisonPage({ params }: PageProps) {
  const { slug } = await params;
  const data = getComparison(slug);
  if (!data) notFound();

  const otherComparisons = comparisons.filter((c) => c.slug !== slug);

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
            name: "Compare",
            item: "https://www.screenshot-studio.com/compare",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: `vs ${data.competitorName}`,
            item: `https://www.screenshot-studio.com/compare/${data.slug}`,
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: data.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.a,
          },
        })),
      },
      {
        "@type": "WebPage",
        name: data.metaTitle,
        description: data.metaDescription,
        url: `https://www.screenshot-studio.com/compare/${data.slug}`,
        mainEntity: {
          "@type": "SoftwareApplication",
          name: "Screenshot Studio",
          applicationCategory: "DesignApplication",
          operatingSystem: "Any (Web Browser)",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
        },
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
              Comparison
            </p>
            <h1
              className="mb-6 text-4xl font-semibold tracking-[-0.04em] text-foreground md:text-5xl"
              style={{ fontFamily: INTER }}
            >
              Screenshot Studio vs {data.competitorName}
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground md:text-xl">
              {data.tagline}
            </p>
            <Link href="/" className={ctaClassName}>
              Try Screenshot Studio Free
            </Link>
          </div>
        </section>

        <section className="border-t border-border px-6 py-20">
          <div className="mx-auto max-w-4xl">
            <h2
              className="mb-12 text-center text-3xl font-semibold tracking-[-0.03em] text-foreground"
              style={{ fontFamily: INTER }}
            >
              Feature Comparison
            </h2>
            <div className="overflow-x-auto rounded-2xl bg-card ring-1 ring-inset ring-border shadow-[var(--card-highlight-shadow)]">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-4 text-left text-sm font-semibold text-muted-foreground">
                      Feature
                    </th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-foreground">
                      Screenshot Studio
                    </th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-muted-foreground">
                      {data.competitorName}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.features.map((feature) => (
                    <tr
                      key={feature.name}
                      className="border-b border-border/50 last:border-b-0"
                    >
                      <td className="px-4 py-3 text-sm font-medium text-foreground">
                        {feature.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">
                        <FeatureStatus value={feature.studio} emphasize />
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        <FeatureStatus value={feature.competitor} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="border-t border-border px-6 py-20">
          <div className="mx-auto max-w-5xl">
            <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
              <div>
                <h2
                  className="mb-6 text-2xl font-semibold tracking-[-0.03em] text-foreground"
                  style={{ fontFamily: INTER }}
                >
                  Screenshot Studio Advantages
                </h2>
                <ul className="space-y-3">
                  {data.studioAdvantages.map((adv) => (
                    <li key={adv} className="flex items-start gap-3">
                      <Tick02Icon
                        size={20}
                        strokeWidth={1.75}
                        className="mt-0.5 shrink-0 text-foreground"
                      />
                      <span className="text-foreground">{adv}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2
                  className="mb-6 text-2xl font-semibold tracking-[-0.03em] text-muted-foreground"
                  style={{ fontFamily: INTER }}
                >
                  {data.competitorName} Limitations
                </h2>
                <ul className="space-y-3">
                  {data.competitorLimitations.map((lim) => (
                    <li
                      key={lim}
                      className="flex items-start gap-3 text-muted-foreground"
                    >
                      <Cancel01Icon
                        size={20}
                        strokeWidth={1.75}
                        className="mt-0.5 shrink-0 text-muted-foreground/70"
                      />
                      <span>{lim}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-border px-6 py-16">
          <div className="mx-auto max-w-3xl text-center">
            <h2
              className="mb-4 text-2xl font-semibold tracking-[-0.03em] text-foreground"
              style={{ fontFamily: INTER }}
            >
              The Verdict
            </h2>
            <p className="text-lg text-muted-foreground">{data.verdict}</p>
          </div>
        </section>

        <section className="border-t border-border px-6 py-20">
          <div className="mx-auto max-w-3xl">
            <h2
              className="mb-12 text-center text-3xl font-semibold tracking-[-0.03em] text-foreground"
              style={{ fontFamily: INTER }}
            >
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {data.faqs.map((faq) => (
                <div key={faq.q} className="border-b border-border pb-6">
                  <h3
                    className="mb-2 text-lg font-semibold tracking-[-0.02em] text-foreground"
                    style={{ fontFamily: INTER }}
                  >
                    {faq.q}
                  </h3>
                  <p className="text-muted-foreground">{faq.a}</p>
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
              Other Comparisons
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {otherComparisons.map((comp) => (
                <Link
                  key={comp.slug}
                  href={`/compare/${comp.slug}`}
                  className={chipLinkClassName}
                >
                  <span>
                    vs {comp.competitorName}
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
              Try Screenshot Studio Free
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              No signup. No downloads. No watermarks. Open the editor and see
              the difference.
            </p>
            <Link href="/" className={ctaClassName}>
              Open Free Editor
            </Link>
          </div>
        </section>
      </main>

      <Footer brandName="Screenshot Studio" />
    </div>
  );
}
