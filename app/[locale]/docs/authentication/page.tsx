import { Metadata } from "next";
import Link from "next/link";
import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { OG_DEFAULTS } from "@/lib/seo/metadata";
import { INTER, codeBlockClassName, linkClassName } from "@/lib/seo/docs-shared";

export const metadata: Metadata = {
  title: "Screenshot Studio API Authentication",
  description:
    "The Screenshot Studio API requires no API key, token, or account. Read how anonymous access, per-IP rate limits, 429 responses, and Retry-After headers work.",
  keywords: [
    "Screenshot Studio API authentication",
    "Screenshot Studio API key",
    "screenshot API rate limit",
    "screenshot API no auth",
  ],
  openGraph: {
    ...OG_DEFAULTS,
    title: "Screenshot Studio API Authentication",
    description:
      "No API key required. Anonymous access with per-IP rate limits and standard 429 semantics.",
    url: "/docs/authentication",
  },
  alternates: {
    canonical: "/docs/authentication",
  },
};

const LIMITS = [
  {
    endpoint: "POST /api/screenshot",
    limit: "20 requests per minute per IP",
    notes: "Returns 429 with Retry-After and X-RateLimit-* headers.",
  },
  {
    endpoint: "POST /api/export",
    limit: "Unmetered",
    notes: "Bounded by request body size and server processing time.",
  },
  {
    endpoint: "GET /api/tweet/{id}",
    limit: "Unmetered",
    notes: "Bounded by the upstream syndication API.",
  },
  {
    endpoint: "GET /api/image-proxy",
    limit: "Unmetered",
    notes: "Restricted to an allowlist of Twitter media hosts.",
  },
];

export default function AuthenticationPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navigation />

      <main className="mx-auto max-w-3xl flex-1 px-6 pb-16 pt-28 sm:pb-24">
        <h1
          className="mb-4 text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-4xl"
          style={{ fontFamily: INTER }}
        >
          Screenshot Studio API Authentication
        </h1>
        <p className="mb-12 text-lg leading-relaxed text-muted-foreground">
          The public Screenshot Studio API is unauthenticated. There is no API
          key to request, no token to rotate, and no account to create. Send the
          request and it is served. Access is shaped by per-IP rate limits
          rather than credentials.
        </p>

        <div className="space-y-10">
          <section id="no-credentials">
            <h2
              className="mb-3 text-xl font-semibold tracking-[-0.02em] text-foreground"
              style={{ fontFamily: INTER }}
            >
              No credentials required
            </h2>
            <p className="mb-4 leading-relaxed text-muted-foreground">
              Do not send an <code>Authorization</code> header. It is ignored.
              A complete request looks like this:
            </p>
            <pre className={codeBlockClassName}>
              <code>{`curl -X POST https://www.screenshot-studio.com/api/screenshot \\
  -H "Content-Type: application/json" \\
  -d '{"url":"https://example.com"}'`}</code>
            </pre>
          </section>

          <section id="rate-limits">
            <h2
              className="mb-3 text-xl font-semibold tracking-[-0.02em] text-foreground"
              style={{ fontFamily: INTER }}
            >
              Rate limits
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="py-2 pr-4 font-medium text-foreground">
                      Endpoint
                    </th>
                    <th className="py-2 pr-4 font-medium text-foreground">
                      Limit
                    </th>
                    <th className="py-2 font-medium text-foreground">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {LIMITS.map((row) => (
                    <tr key={row.endpoint} className="border-b border-border/60">
                      <td className="py-2 pr-4 font-mono text-xs text-foreground">
                        {row.endpoint}
                      </td>
                      <td className="py-2 pr-4 text-muted-foreground">
                        {row.limit}
                      </td>
                      <td className="py-2 text-muted-foreground">
                        {row.notes}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section id="handling-429">
            <h2
              className="mb-3 text-xl font-semibold tracking-[-0.02em] text-foreground"
              style={{ fontFamily: INTER }}
            >
              Handling 429
            </h2>
            <p className="mb-4 leading-relaxed text-muted-foreground">
              When the limit is exceeded the response carries{" "}
              <code>Retry-After</code> in seconds alongside{" "}
              <code>X-RateLimit-Limit</code>,{" "}
              <code>X-RateLimit-Remaining</code>, and{" "}
              <code>X-RateLimit-Reset</code>. Wait for{" "}
              <code>Retry-After</code> before retrying.
            </p>
            <pre className={codeBlockClassName}>
              <code>{`{
  "error": "Rate limit exceeded. Please try again later.",
  "code": "rate_limited",
  "message": "Rate limit exceeded. Please try again later.",
  "hint": "Wait 42 seconds, then retry. This endpoint allows 20 requests per minute per IP address.",
  "status": 429,
  "documentation": "https://www.screenshot-studio.com/docs#errors",
  "retryAfter": 42
}`}</code>
            </pre>
          </section>

          <section id="maintenance-endpoints">
            <h2
              className="mb-3 text-xl font-semibold tracking-[-0.02em] text-foreground"
              style={{ fontFamily: INTER }}
            >
              Credentialed maintenance endpoints
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              A small number of cache-maintenance endpoints require a shared
              secret held by the maintainers. They are not part of the public
              API surface and are deliberately absent from the{" "}
              <Link href="/openapi.json" className={linkClassName}>
                OpenAPI specification
              </Link>
              .
            </p>
          </section>

          <section id="next">
            <h2
              className="mb-3 text-xl font-semibold tracking-[-0.02em] text-foreground"
              style={{ fontFamily: INTER }}
            >
              Next steps
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              Read the full{" "}
              <Link href="/docs" className={linkClassName}>
                API documentation
              </Link>
              , browse the{" "}
              <Link href="/developers" className={linkClassName}>
                developer portal
              </Link>
              , or fetch the{" "}
              <Link href="/openapi.json" className={linkClassName}>
                OpenAPI 3.1 specification
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
