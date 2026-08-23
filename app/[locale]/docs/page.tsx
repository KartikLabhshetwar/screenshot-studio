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
  title: "Screenshot Studio API Documentation",
  description:
    "Screenshot Studio API documentation: endpoints, request and response schemas, rate limits, JSON error codes, and the OpenAPI 3.1 specification. No API key required.",
  keywords: [
    "Screenshot Studio API",
    "Screenshot Studio API docs",
    "Screenshot Studio OpenAPI",
    "screenshot API",
    "screenshot capture API",
  ],
  openGraph: {
    ...OG_DEFAULTS,
    title: "Screenshot Studio API Documentation",
    description:
      "Endpoints, schemas, rate limits, and error codes for the public Screenshot Studio API.",
    url: "/docs",
  },
  alternates: {
    canonical: "/docs",
  },
};

interface Endpoint {
  operationId: string;
  method: string;
  path: string;
  description: string;
  request: string;
  response: string;
}

const ENDPOINTS: Endpoint[] = [
  {
    operationId: "captureScreenshot",
    method: "POST",
    path: "/api/screenshot",
    description:
      "Renders the page at the given URL and returns the screenshot as a base64-encoded PNG. Results are cached per URL, device type, and color scheme.",
    request: `curl -X POST https://www.screenshot-studio.com/api/screenshot \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://example.com",
    "deviceType": "desktop",
    "colorScheme": "light",
    "forceRefresh": false
  }'`,
    response: `{
  "screenshot": "iVBORw0KGgoAAAANSUhEUg...",
  "url": "https://example.com",
  "cached": false,
  "strategy": "microlink",
  "deviceType": "desktop",
  "colorScheme": "light"
}`,
  },
  {
    operationId: "optimizeExportImage",
    method: "POST",
    path: "/api/export",
    description:
      "Recompresses an image with Sharp and returns the optimized bytes. JPEG uses MozJPEG, WebP uses libwebp, PNG uses adaptive filtering. The response body is the image itself, not JSON.",
    request: `curl -X POST https://www.screenshot-studio.com/api/export \\
  -F "image=@shot.png" \\
  -F "format=webp" \\
  -F "qualityPreset=high" \\
  -o shot.webp`,
    response: `HTTP/2 200
content-type: image/webp

<binary image bytes>`,
  },
  {
    operationId: "getTweet",
    method: "GET",
    path: "/api/tweet/{id}",
    description:
      "Returns the public tweet payload used to render a tweet as an image. The id is the numeric status ID from the tweet URL.",
    request: `curl https://www.screenshot-studio.com/api/tweet/1234567890123456789`,
    response: `{
  "data": {
    "id_str": "1234567890123456789",
    "text": "...",
    "user": { "name": "...", "screen_name": "..." }
  }
}`,
  },
  {
    operationId: "proxyTwitterImage",
    method: "GET",
    path: "/api/image-proxy",
    description:
      "Streams a Twitter-hosted image through this origin so it can be drawn onto a canvas without tainting it. Only pbs.twimg.com, abs.twimg.com, ton.twitter.com, and video.twimg.com are allowed.",
    request: `curl "https://www.screenshot-studio.com/api/image-proxy?url=https://pbs.twimg.com/media/EXAMPLE.jpg" \\
  -o media.jpg`,
    response: `HTTP/2 200
content-type: image/jpeg

<binary image bytes>`,
  },
];

const ERROR_CODES = [
  {
    code: "invalid_request",
    status: "400",
    meaning: "A required field is missing or malformed.",
  },
  {
    code: "invalid_url",
    status: "400",
    meaning: "The url is not a valid absolute http or https URL.",
  },
  {
    code: "unsupported_value",
    status: "400",
    meaning: "A field was set to a value outside its allowed enum.",
  },
  {
    code: "forbidden_domain",
    status: "403",
    meaning: "The requested host is not on the proxy allowlist.",
  },
  {
    code: "not_found",
    status: "404",
    meaning: "No endpoint or resource matches the request.",
  },
  {
    code: "method_not_allowed",
    status: "405",
    meaning: "The endpoint does not accept this HTTP method.",
  },
  {
    code: "rate_limited",
    status: "429",
    meaning: "The per-IP rate limit was exceeded. Honour Retry-After.",
  },
  {
    code: "upstream_timeout",
    status: "408",
    meaning: "The target page took too long to load.",
  },
  {
    code: "upstream_unavailable",
    status: "503",
    meaning: "The upstream capture service is unreachable.",
  },
  {
    code: "upstream_failed",
    status: "502",
    meaning: "The upstream host refused or failed the request.",
  },
  {
    code: "internal_error",
    status: "500",
    meaning: "Unexpected server-side failure.",
  },
];

const RESOURCES = [
  {
    href: "/openapi.json",
    label: "OpenAPI 3.1 specification",
    detail: "Machine-readable contract for every operation on this page.",
  },
  {
    href: "/docs/authentication",
    label: "Authentication and rate limits",
    detail: "No API key is required. Read the per-IP limits here.",
  },
  {
    href: "/developers",
    label: "Developer portal",
    detail: "Quickstart, agent files, and the open-source repository.",
  },
  {
    href: "/llms.txt",
    label: "llms.txt",
    detail: "Markdown overview of the whole site for AI agents.",
  },
];

export default function DocsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navigation />

      <main className="mx-auto max-w-3xl flex-1 px-6 pb-16 pt-28 sm:pb-24">
        <h1
          className="mb-4 text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-4xl"
          style={{ fontFamily: INTER }}
        >
          Screenshot Studio API Documentation
        </h1>
        <p className="mb-12 text-lg leading-relaxed text-muted-foreground">
          Screenshot Studio exposes a small public HTTP API: capture a live web
          page as an image, recompress an exported image, resolve a tweet, and
          proxy Twitter media. There is no API key, no token, and no account.
          Every failing request returns the same JSON error envelope. The
          machine-readable contract lives at{" "}
          <Link href="/openapi.json" className={linkClassName}>
            /openapi.json
          </Link>
          .
        </p>

        <div className="space-y-12">
          <section id="quickstart">
            <h2
              className="mb-3 text-xl font-semibold tracking-[-0.02em] text-foreground"
              style={{ fontFamily: INTER }}
            >
              Quickstart
            </h2>
            <p className="mb-4 leading-relaxed text-muted-foreground">
              Capture a page and write the PNG to disk in one command.
            </p>
            <pre className={codeBlockClassName}>
              <code>{`curl -s -X POST https://www.screenshot-studio.com/api/screenshot \\
  -H "Content-Type: application/json" \\
  -d '{"url":"https://example.com"}' \\
  | jq -r .screenshot | base64 -d > shot.png`}</code>
            </pre>
          </section>

          <section id="base-url">
            <h2
              className="mb-3 text-xl font-semibold tracking-[-0.02em] text-foreground"
              style={{ fontFamily: INTER }}
            >
              Base URL
            </h2>
            <pre className={codeBlockClassName}>
              <code>https://www.screenshot-studio.com</code>
            </pre>
          </section>

          <section id="endpoints">
            <h2
              className="mb-4 text-xl font-semibold tracking-[-0.02em] text-foreground"
              style={{ fontFamily: INTER }}
            >
              Endpoints
            </h2>
            <div className="space-y-8">
              {ENDPOINTS.map((endpoint) => (
                <div key={endpoint.operationId} id={endpoint.operationId}>
                  <p className="mb-1 flex flex-wrap items-center gap-2">
                    <span className="rounded-md bg-foreground/[0.06] px-2 py-0.5 font-mono text-xs font-medium text-foreground ring-1 ring-inset ring-border">
                      {endpoint.method}
                    </span>
                    <code className="font-mono text-sm text-foreground">
                      {endpoint.path}
                    </code>
                  </p>
                  <p className="mb-1 text-xs text-muted-foreground">
                    operationId: <code>{endpoint.operationId}</code>
                  </p>
                  <p className="mb-4 leading-relaxed text-muted-foreground">
                    {endpoint.description}
                  </p>
                  <p className="mb-2 text-sm font-medium text-foreground">
                    Request
                  </p>
                  <pre className={`${codeBlockClassName} mb-4`}>
                    <code>{endpoint.request}</code>
                  </pre>
                  <p className="mb-2 text-sm font-medium text-foreground">
                    Response
                  </p>
                  <pre className={codeBlockClassName}>
                    <code>{endpoint.response}</code>
                  </pre>
                </div>
              ))}
            </div>
          </section>

          <section id="errors">
            <h2
              className="mb-3 text-xl font-semibold tracking-[-0.02em] text-foreground"
              style={{ fontFamily: INTER }}
            >
              Errors
            </h2>
            <p className="mb-4 leading-relaxed text-muted-foreground">
              Every failing request returns JSON with the same shape. Branch on{" "}
              <code>code</code>, which is stable; <code>error</code> and{" "}
              <code>message</code> carry the same human-readable text, and{" "}
              <code>hint</code> explains how to recover.
            </p>
            <pre className={`${codeBlockClassName} mb-6`}>
              <code>{`{
  "error": "URL is required",
  "code": "invalid_request",
  "message": "URL is required",
  "hint": "Send a JSON body with a \\"url\\" string, for example {\\"url\\": \\"https://example.com\\"}.",
  "status": 400,
  "documentation": "https://www.screenshot-studio.com/docs#errors"
}`}</code>
            </pre>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="py-2 pr-4 font-medium text-foreground">
                      Code
                    </th>
                    <th className="py-2 pr-4 font-medium text-foreground">
                      Status
                    </th>
                    <th className="py-2 font-medium text-foreground">
                      Meaning
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {ERROR_CODES.map((row) => (
                    <tr key={row.code} className="border-b border-border/60">
                      <td className="py-2 pr-4 font-mono text-xs text-foreground">
                        {row.code}
                      </td>
                      <td className="py-2 pr-4 text-muted-foreground">
                        {row.status}
                      </td>
                      <td className="py-2 text-muted-foreground">
                        {row.meaning}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section id="markdown">
            <h2
              className="mb-3 text-xl font-semibold tracking-[-0.02em] text-foreground"
              style={{ fontFamily: INTER }}
            >
              Markdown content negotiation
            </h2>
            <p className="mb-4 leading-relaxed text-muted-foreground">
              Every page on this site serves Markdown to clients that ask for
              it. Responses set{" "}
              <code>Content-Type: text/markdown; charset=utf-8</code> and{" "}
              <code>Vary: Accept, Accept-Encoding</code>. A request that accepts
              neither <code>text/html</code> nor <code>text/markdown</code> is
              answered with <code>406</code>, and an unknown path returns{" "}
              <code>404</code> with a Markdown body listing where to look next.
            </p>
            <pre className={codeBlockClassName}>
              <code>{`curl -H "Accept: text/markdown" https://www.screenshot-studio.com/`}</code>
            </pre>
          </section>

          <section id="resources">
            <h2
              className="mb-4 text-xl font-semibold tracking-[-0.02em] text-foreground"
              style={{ fontFamily: INTER }}
            >
              Related resources
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
        </div>
      </main>

      <Footer />
    </div>
  );
}
