import Link from "next/link";
import { CheckmarkCircle02Icon, ArrowRight01Icon } from "hugeicons-react";
import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { buildToolJsonLd } from "@/lib/seo/tool-metadata";
import { getRelatedTools, TOOLS_HUB_PATH, type ToolDefinition } from "@/lib/seo/tools";
import { ToolWorkspace } from "./ToolWorkspace";
import { CropWorkspace } from "./CropWorkspace";

interface ToolPageProps {
  tool: ToolDefinition;
}

/**
 * The shared shell behind every /compress-image, /png-to-jpg, and friends.
 *
 * Server-rendered so the H1, intro, feature list, and FAQ text are in the HTML
 * a crawler receives; only the workspace itself is a client island.
 */
export function ToolPage({ tool }: ToolPageProps) {
  const related = getRelatedTools(tool);
  const jsonLd = buildToolJsonLd(tool);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navigation />

      <main className="bg-background">
        <section className="px-6 pt-28 pb-12">
          <div className="mx-auto max-w-5xl">
            <nav aria-label="Breadcrumb" className="mb-4">
              <ol className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <li>
                  <Link href="/" className="hover:text-foreground">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link href={TOOLS_HUB_PATH} className="hover:text-foreground">
                    Image Tools
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="text-foreground">{tool.name}</li>
              </ol>
            </nav>

            <h1 className="mb-3 text-3xl font-semibold tracking-[-0.02em] text-foreground sm:text-4xl">
              {tool.h1}
            </h1>
            <p className="max-w-2xl text-base text-muted-foreground">
              {tool.intro}
            </p>
          </div>
        </section>

        <section className="px-6 pb-16">
          {tool.engine === "crop" ? (
            <CropWorkspace tool={tool} />
          ) : (
            <ToolWorkspace tool={tool} />
          )}
        </section>

        <section className="border-t border-border px-6 py-16">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-xl font-semibold tracking-[-0.01em] text-foreground">
              What this tool does
            </h2>
            <ul className="mb-12 grid gap-3 sm:grid-cols-2">
              {tool.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5">
                  <CheckmarkCircle02Icon
                    size={17}
                    className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-500"
                    aria-hidden="true"
                  />
                  <span className="text-sm text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>

            <h2 className="mb-4 text-xl font-semibold tracking-[-0.01em] text-foreground">
              Frequently asked questions
            </h2>
            <Accordion type="single" collapsible>
              {tool.faqs.map((faq) => (
                <AccordionItem key={faq.question} value={faq.question}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            {related.length > 0 ? (
              <>
                <h2 className="mt-12 mb-4 text-xl font-semibold tracking-[-0.01em] text-foreground">
                  Related tools
                </h2>
                <div className="grid gap-3 sm:grid-cols-3">
                  {related.map((item) => (
                    <Link
                      key={item.slug}
                      href={item.slug}
                      className="group rounded-lg border border-border bg-card p-4 transition-colors hover:border-foreground/25"
                    >
                      <span className="flex items-center justify-between gap-2 text-sm font-medium text-foreground">
                        {item.name}
                        <ArrowRight01Icon
                          size={15}
                          className="text-muted-foreground transition-transform group-hover:translate-x-0.5"
                          aria-hidden="true"
                        />
                      </span>
                    </Link>
                  ))}
                </div>
              </>
            ) : null}

            <p className="mt-12 text-sm text-muted-foreground">
              Need more than a quick fix? The{" "}
              <Link href="/" className="underline">
                Screenshot Studio editor
              </Link>{" "}
              adds gradient backgrounds, browser mockups, shadows, 3D perspective,
              and annotations. You can also browse{" "}
              <Link href={TOOLS_HUB_PATH} className="underline">
                every image tool
              </Link>
              .
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
