import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { ArrowRight, Check, X } from "lucide-react";
import {
  comparisons,
  getComparison,
  getAllComparisonSlugs,
} from "@/lib/seo/comparisons";

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
      title: data.metaTitle,
      description: data.metaDescription,
      url: `/compare/${data.slug}`,
    },
    alternates: {
      canonical: `/compare/${data.slug}`,
    },
  };
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
            item: "https://screenshot-studio.com",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Compare",
            item: "https://screenshot-studio.com/compare",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: `vs ${data.competitorName}`,
            item: `https://screenshot-studio.com/compare/${data.slug}`,
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
        url: `https://screenshot-studio.com/compare/${data.slug}`,
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
              Comparison
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              Screenshot Studio vs {data.competitorName}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              {data.tagline}
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-8 py-4 rounded-full hover:opacity-90 transition-opacity"
            >
              Try Screenshot Studio Free
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

        {/* Feature Comparison Table */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Feature Comparison
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4 px-4 font-semibold text-muted-foreground">
                      Feature
                    </th>
                    <th className="text-left py-4 px-4 font-semibold text-primary">
                      Screenshot Studio
                    </th>
                    <th className="text-left py-4 px-4 font-semibold text-muted-foreground">
                      {data.competitorName}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.features.map((feature) => (
                    <tr
                      key={feature.name}
                      className="border-b border-border/50"
                    >
                      <td className="py-3 px-4 font-medium text-sm">
                        {feature.name}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <span className="flex items-center gap-2">
                          {feature.studio.toLowerCase() === "not available" ? (
                            <X className="w-4 h-4 text-destructive flex-shrink-0" />
                          ) : (
                            <Check className="w-4 h-4 text-primary flex-shrink-0" />
                          )}
                          {feature.studio}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-2">
                          {feature.competitor.toLowerCase() ===
                          "not available" ? (
                            <X className="w-4 h-4 text-destructive flex-shrink-0" />
                          ) : (
                            <Check className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          )}
                          {feature.competitor}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Why Switch / Advantages */}
        <section className="py-20 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-2xl font-bold mb-6 text-primary">
                  Screenshot Studio Advantages
                </h2>
                <ul className="space-y-3">
                  {data.studioAdvantages.map((adv) => (
                    <li key={adv} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>{adv}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-6 text-muted-foreground">
                  {data.competitorName} Limitations
                </h2>
                <ul className="space-y-3">
                  {data.competitorLimitations.map((lim) => (
                    <li
                      key={lim}
                      className="flex items-start gap-3 text-muted-foreground"
                    >
                      <X className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                      <span>{lim}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Verdict */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">The Verdict</h2>
            <p className="text-lg text-muted-foreground">{data.verdict}</p>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {data.faqs.map((faq) => (
                <div key={faq.q} className="border-b border-border pb-6">
                  <h3 className="font-semibold text-lg mb-2">{faq.q}</h3>
                  <p className="text-muted-foreground">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Other Comparisons */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-center">
              Other Comparisons
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {otherComparisons.map((comp) => (
                <Link
                  key={comp.slug}
                  href={`/compare/${comp.slug}`}
                  className="flex items-center justify-between p-4 bg-background border rounded-xl hover:border-primary transition-colors group"
                >
                  <span className="font-medium text-sm">
                    vs {comp.competitorName}
                  </span>
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
              Try Screenshot Studio Free
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              No signup. No downloads. No watermarks. Open the editor and see
              the difference.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-8 py-4 rounded-full hover:opacity-90 transition-opacity"
            >
              Open Free Editor
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>

      <Footer brandName="Screenshot Studio" />
    </div>
  );
}
