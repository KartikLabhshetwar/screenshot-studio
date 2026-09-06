import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight01Icon, CheckmarkCircle02Icon } from "hugeicons-react";
import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { OG_DEFAULTS } from "@/lib/seo/metadata";
import { buildToolsHubJsonLd } from "@/lib/seo/tool-metadata";
import {
  CONVERTER_TOOLS,
  PRIMARY_TOOLS,
  TOOLS,
  TOOLS_HUB_PATH,
} from "@/lib/seo/tools";

export const metadata: Metadata = {
  title: "Free Online Image Tools: Compress, Convert, Resize, Crop",
  description:
    "Compress, convert, resize, crop, and rotate images in your browser. Batch processing, no signup, no watermark, and nothing is ever uploaded.",
  keywords: [
    "image tools",
    "online image tools",
    "free image editor tools",
    "compress image",
    "convert image",
    "resize image",
    "crop image",
    "rotate image",
    "batch image tools",
    "image tools without upload",
    "iloveimg alternative",
    "privacy friendly image tools",
  ],
  openGraph: {
    ...OG_DEFAULTS,
    title: "Free Online Image Tools: Compress, Convert, Resize, Crop",
    description:
      "A suite of free image tools that run entirely in your browser. Batch processing, no signup, no watermark, no upload.",
    url: TOOLS_HUB_PATH,
  },
  alternates: {
    canonical: TOOLS_HUB_PATH,
  },
};

const PROMISES = [
  "Nothing is uploaded. Every tool runs in your browser",
  "Batch processing with a single zip download",
  "Free forever, no signup and no watermark",
  "Open source under the Apache 2.0 licence",
];

export default function ToolsHubPage() {
  const jsonLd = buildToolsHubJsonLd(TOOLS);

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
            <h1 className="mb-3 text-3xl font-semibold tracking-[-0.02em] text-foreground sm:text-4xl">
              Free Online Image Tools
            </h1>
            <p className="max-w-2xl text-base text-muted-foreground">
              Compress, convert, resize, crop, and rotate images without
              uploading them anywhere. Every tool below runs entirely inside your
              browser, works on a whole folder at once, and costs nothing.
            </p>

            <ul className="mt-8 grid gap-2.5 sm:grid-cols-2">
              {PROMISES.map((promise) => (
                <li key={promise} className="flex items-start gap-2.5">
                  <CheckmarkCircle02Icon
                    size={17}
                    className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-500"
                    aria-hidden="true"
                  />
                  <span className="text-sm text-muted-foreground">{promise}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="px-6 pb-16">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-4 text-xl font-semibold tracking-[-0.01em] text-foreground">
              Tools
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {PRIMARY_TOOLS.map((tool) => (
                <Link
                  key={tool.slug}
                  href={tool.slug}
                  className="group flex flex-col rounded-xl border border-border bg-card p-5 transition-colors hover:border-foreground/25"
                >
                  <span className="mb-1.5 flex items-center justify-between gap-2 text-base font-medium text-foreground">
                    {tool.name}
                    <ArrowRight01Icon
                      size={16}
                      className="text-muted-foreground transition-transform group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {tool.description}
                  </span>
                </Link>
              ))}
            </div>

            <h2 className="mt-12 mb-4 text-xl font-semibold tracking-[-0.01em] text-foreground">
              Format converters
            </h2>
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {CONVERTER_TOOLS.map((tool) => (
                <Link
                  key={tool.slug}
                  href={tool.slug}
                  className="rounded-lg border border-border bg-card px-4 py-3 text-center text-sm font-medium text-foreground transition-colors hover:border-foreground/25"
                >
                  {tool.name}
                </Link>
              ))}
            </div>

            <p className="mt-12 max-w-2xl text-sm text-muted-foreground">
              Looking for something more than a quick fix? The{" "}
              <Link href="/" className="underline">
                Screenshot Studio editor
              </Link>{" "}
              turns a plain screenshot into a finished graphic with gradient
              backgrounds, browser mockups, shadows, 3D perspective, annotations,
              and video export, and{" "}
              <Link href="/code" className="underline">
                Code Images
              </Link>{" "}
              does the same for code snippets.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
