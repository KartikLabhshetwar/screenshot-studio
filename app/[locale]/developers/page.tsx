import { Metadata } from "next";
import Link from "next/link";
import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { OG_DEFAULTS } from "@/lib/seo/metadata";
import {
  INTER,
  cardSurface,
  codeBlockClassName,
  linkClassName,
} from "@/lib/seo/docs-shared";

export const metadata: Metadata = {
  title: "Screenshot Studio Developer Portal",
  description:
    "Developer portal for Screenshot Studio: API docs, OpenAPI 3.1 spec, authentication, rate limits, quickstart requests, and the open-source repository.",
  keywords: [
    "Screenshot Studio developers",
    "Screenshot Studio developer portal",
    "Screenshot Studio API",
    "screenshot API quickstart",
    "screenshot OpenAPI spec",
  ],
  openGraph: {
    ...OG_DEFAULTS,
    title: "Screenshot Studio Developer Portal",
    description:
      "API docs, OpenAPI spec, authentication, quickstart requests, and the open-source repository.",
    url: "/developers",
  },
  alternates: {
    canonical: "/developers",
  },
};

const RESOURCES = [
  {
    href: "/docs",
    label: "API documentation",
    detail:
      "Every public endpoint with request and response examples, plus the error-code table.",
  },
  {
    href: "/openapi.json",
    label: "OpenAPI 3.1 specification",
    detail:
      "Machine-readable contract with operationIds, typed parameters, and response schemas.",
  },
  {
    href: "/docs/authentication",
    label: "Authentication and rate limits",
    detail: "No API key is required. Per-IP limits and 429 semantics.",
  },
  {
    href: "/llms.txt",
    label: "llms.txt",
    detail: "Markdown site overview for AI agents and LLM crawlers.",
  },
  {
    href: "/llms-full.txt",
    label: "llms-full.txt",
    detail: "Long-form Markdown reference covering features and the API.",
  },
  {
    href: "https://github.com/opennookorg/screenshot-studio",
    label: "Source code on GitHub",
    detail: "Apache 2.0. Issues, discussions, and self-hosting instructions.",
  },
];

const QUICKSTART = [
  {
    id: "capture",
    title: "1. Capture a live page",
    body: "No key, no signup. Post a URL and read back a base64 PNG.",
    code: `curl -s -X POST https://www.screenshot-studio.com/api/screenshot \\
  -H "Content-Type: application/json" \\
  -d '{"url":"https://example.com","deviceType":"desktop"}' \\
  | jq -r .screenshot | base64 -d > shot.png`,
  },
  {
    id: "optimize",
    title: "2. Optimize the export",
    body: "Send the image back through Sharp to recompress it as WebP.",
    code: `curl -s -X POST https://www.screenshot-studio.com/api/export \\
  -F "image=@shot.png" \\
  -F "format=webp" \\
  -F "qualityPreset=high" \\
  -o shot.webp`,
  },
  {
    id: "handle-errors",
    title: "3. Handle failures",
    body: "Every failing request returns the same JSON envelope. Branch on code.",
    code: `{
  "error": "URL is required",
  "code": "invalid_request",
  "message": "URL is required",
  "hint": "Send a JSON body with a \\"url\\" string.",
  "status": 400,
  "documentation": "https://www.screenshot-studio.com/docs#errors"
}`,
  },
];

export default function DevelopersPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navigation />

      <main className="mx-auto max-w-3xl flex-1 px-6 pb-16 pt-28 sm:pb-24">
        <h1
          className="mb-4 text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-4xl"
          style={{ fontFamily: INTER }}
        >
          Screenshot Studio Developer Portal
        </h1>
        <p className="mb-12 text-lg leading-relaxed text-muted-foreground">
          Screenshot Studio is an open-source, browser-based screenshot editor
          with a small public HTTP API. This page is the entry point for
          building against it: the endpoints are unauthenticated, the contract
          is published as OpenAPI 3.1, and the whole application is Apache 2.0
          on GitHub.
        </p>

        <div className="space-y-12">
          <section id="resources">
            <h2
              className="mb-4 text-xl font-semibold tracking-[-0.02em] text-foreground"
              style={{ fontFamily: INTER }}
            >
              Start here
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {RESOURCES.map((resource) => (
                <Link
                  key={resource.href}
                  href={resource.href}
                  className={cardSurface}
                >
                  <p className="mb-1 font-medium text-foreground">
                    {resource.label}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {resource.detail}
                  </p>
                </Link>
              ))}
            </div>
          </section>

          <section id="api-keys">
            <h2
              className="mb-3 text-xl font-semibold tracking-[-0.02em] text-foreground"
              style={{ fontFamily: INTER }}
            >
              API keys
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              There are none, and there is nothing to sign up for. The public
              API is anonymous and governed by per-IP rate limits instead of
              credentials. Details are in{" "}
              <Link href="/docs/authentication" className={linkClassName}>
                authentication and rate limits
              </Link>
              .
            </p>
          </section>

          <section id="quickstart">
            <h2
              className="mb-4 text-xl font-semibold tracking-[-0.02em] text-foreground"
              style={{ fontFamily: INTER }}
            >
              Quickstart
            </h2>
            <div className="space-y-8">
              {QUICKSTART.map((step) => (
                <div key={step.id} id={step.id}>
                  <h3 className="mb-2 text-base font-medium text-foreground">
                    {step.title}
                  </h3>
                  <p className="mb-3 leading-relaxed text-muted-foreground">
                    {step.body}
                  </p>
                  <pre className={codeBlockClassName}>
                    <code>{step.code}</code>
                  </pre>
                </div>
              ))}
            </div>
          </section>

          <section id="sandbox">
            <h2
              className="mb-3 text-xl font-semibold tracking-[-0.02em] text-foreground"
              style={{ fontFamily: INTER }}
            >
              Sandbox
            </h2>
            <p className="mb-4 leading-relaxed text-muted-foreground">
              There is no separate sandbox host. Production is safe to
              experiment against: the endpoints are read-only with respect to
              your data, nothing is stored against an account, and the editor
              itself never uploads your images. To run the full stack locally
              instead:
            </p>
            <pre className={codeBlockClassName}>
              <code>{`git clone https://github.com/opennookorg/screenshot-studio.git
cd screenshot-studio
npm install
npm run dev`}</code>
            </pre>
          </section>

          <section id="agents">
            <h2
              className="mb-3 text-xl font-semibold tracking-[-0.02em] text-foreground"
              style={{ fontFamily: INTER }}
            >
              Building an agent
            </h2>
            <p className="mb-4 leading-relaxed text-muted-foreground">
              Load{" "}
              <Link href="/openapi.json" className={linkClassName}>
                /openapi.json
              </Link>{" "}
              directly as a function-calling tool definition. Every operation
              carries a unique <code>operationId</code>, a description, typed
              parameters, and a response schema. Any page on this site also
              serves Markdown when asked:
            </p>
            <pre className={codeBlockClassName}>
              <code>{`curl -H "Accept: text/markdown" https://www.screenshot-studio.com/docs`}</code>
            </pre>
          </section>

          <section id="cli">
            <h2
              className="mb-3 text-xl font-semibold tracking-[-0.02em] text-foreground"
              style={{ fontFamily: INTER }}
            >
              CLI and MCP server
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              No official CLI tool and no MCP server are published yet. The
              curl examples above are the supported command-line path. If you
              want either one,{" "}
              <a
                href="https://github.com/opennookorg/screenshot-studio/issues"
                className={linkClassName}
              >
                open an issue
              </a>
              .
            </p>
          </section>

          <section id="support">
            <h2
              className="mb-3 text-xl font-semibold tracking-[-0.02em] text-foreground"
              style={{ fontFamily: INTER }}
            >
              Support
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              File bugs and feature requests on{" "}
              <a
                href="https://github.com/opennookorg/screenshot-studio/issues"
                className={linkClassName}
              >
                GitHub issues
              </a>
              , or reach the maintainers through the{" "}
              <Link href="/contact" className={linkClassName}>
                contact page
              </Link>
              .
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
