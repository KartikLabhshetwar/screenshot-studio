const BASE = process.env.VERIFY_BASE_URL ?? "http://localhost:3000";

interface Check {
  name: string;
  path: string;
  method?: string;
  headers?: Record<string, string>;
  body?: string;
  expectStatus: number | number[];
  expectHeaders?: Record<string, RegExp>;
  expectBody?: RegExp[];
}

const CHECKS: Check[] = [
  {
    name: "homepage HTML has an H1",
    path: "/",
    expectStatus: 200,
    expectHeaders: { "content-type": /text\/html/ },
    expectBody: [/<h1[^>]*>Screenshot Studio/i, /\/openapi\.json/],
  },
  {
    name: "machine-readable routes advertise Vary: Accept",
    path: "/llms.txt",
    expectStatus: 200,
    expectHeaders: { vary: /\bAccept\b(?!-)/i },
  },
  {
    name: "homepage serves markdown for Accept: text/markdown",
    path: "/",
    headers: { Accept: "text/markdown" },
    expectStatus: 200,
    expectHeaders: {
      "content-type": /text\/markdown/,
      vary: /\bAccept\b(?!-)/i,
    },
    expectBody: [/^# /],
  },
  {
    name: "markdown honours q-values",
    path: "/docs",
    headers: { Accept: "text/markdown;q=0.9, text/html;q=0.1" },
    expectStatus: 200,
    expectHeaders: { "content-type": /text\/markdown/ },
    expectBody: [/# Screenshot Studio API Documentation/],
  },
  {
    name: "browser Accept still gets HTML",
    path: "/docs",
    headers: {
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    },
    expectStatus: 200,
    expectHeaders: { "content-type": /text\/html/ },
  },
  {
    name: "unsupported Accept returns 406",
    path: "/",
    headers: { Accept: "application/pdf" },
    expectStatus: 406,
    expectHeaders: { "content-type": /text\/markdown/, vary: /\bAccept\b(?!-)/i },
    expectBody: [/# 406 Not Acceptable/],
  },
  {
    name: "unknown page returns a real 404 with recovery links",
    path: "/this-page-does-not-exist",
    expectStatus: 404,
    expectBody: [/Page not found/i, /\/developers/],
  },
  {
    name: "unknown page returns markdown 404 for agents",
    path: "/this-page-does-not-exist",
    headers: { Accept: "text/markdown" },
    expectStatus: 404,
    expectHeaders: { "content-type": /text\/markdown/ },
    expectBody: [/# 404 Not Found/, /Where to look next/],
  },
  {
    name: "/openapi.json serves the spec",
    path: "/openapi.json",
    expectStatus: 200,
    expectHeaders: { "content-type": /application\/json/ },
    expectBody: [/"openapi":\s*"3\.1\.0"/, /"captureScreenshot"/],
  },
  {
    name: "/.well-known/openapi.json serves the spec",
    path: "/.well-known/openapi.json",
    expectStatus: 200,
    expectBody: [/"openapi":\s*"3\.1\.0"/],
  },
  {
    name: "/llms.txt is markdown",
    path: "/llms.txt",
    expectStatus: 200,
    expectHeaders: { "content-type": /text\/plain|text\/markdown/ },
    expectBody: [/Developer Resources/, /openapi\.json/],
  },
  {
    name: "/llms-full.txt is markdown",
    path: "/llms-full.txt",
    expectStatus: 200,
    expectBody: [/Developer and API Reference/],
  },
  {
    name: "/robots.txt allows AI crawlers",
    path: "/robots.txt",
    expectStatus: 200,
    expectBody: [/GPTBot/, /ClaudeBot/, /PerplexityBot/, /Sitemap:/],
  },
  {
    name: "/sitemap.xml lists the developer pages",
    path: "/sitemap.xml",
    expectStatus: 200,
    expectBody: [/\/docs<\/loc>/, /\/developers<\/loc>/],
  },
  {
    name: "/docs renders",
    path: "/docs",
    expectStatus: 200,
    expectBody: [/Screenshot Studio API Documentation/, /operationId/],
  },
  {
    name: "/docs/authentication renders",
    path: "/docs/authentication",
    expectStatus: 200,
    expectBody: [/API Authentication/, /Rate limits/],
  },
  {
    name: "/developers renders",
    path: "/developers",
    expectStatus: 200,
    expectBody: [/Developer Portal/, /openapi\.json/],
  },
  {
    name: "missing API route returns JSON 404",
    path: "/api/does-not-exist",
    expectStatus: 404,
    expectHeaders: { "content-type": /application\/json/ },
    expectBody: [/"code":"not_found"/, /openapi\.json/],
  },
  {
    name: "GET on a POST-only endpoint returns JSON 405 with Allow",
    path: "/api/screenshot",
    expectStatus: 405,
    expectHeaders: { allow: /POST/ },
    expectBody: [/"code":"method_not_allowed"/],
  },
  {
    name: "invalid screenshot request returns a structured error",
    path: "/api/screenshot",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{}",
    expectStatus: 400,
    expectBody: [
      /"code":"invalid_request"/,
      /"hint":/,
      /"documentation":/,
      /"error":"URL is required"/,
    ],
  },
  {
    name: "invalid export request returns a structured error",
    path: "/api/export",
    method: "POST",
    expectStatus: 400,
    expectBody: [/"code":"invalid_request"/, /"documentation":/],
  },
  {
    name: "image proxy rejects non-allowlisted hosts",
    path: "/api/image-proxy?url=https%3A%2F%2Fexample.com%2Fa.png",
    expectStatus: 403,
    expectBody: [/"code":"forbidden_domain"/],
  },
];

async function run() {
  let failed = 0;

  for (const check of CHECKS) {
    const url = `${BASE}${check.path}`;
    const problems: string[] = [];

    try {
      const response = await fetch(url, {
        method: check.method ?? "GET",
        headers: check.headers,
        body: check.body,
        redirect: "manual",
      });
      const text = await response.text();

      const expected = Array.isArray(check.expectStatus)
        ? check.expectStatus
        : [check.expectStatus];
      if (!expected.includes(response.status)) {
        problems.push(`status ${response.status}, expected ${expected.join("|")}`);
      }

      for (const [header, pattern] of Object.entries(check.expectHeaders ?? {})) {
        const value = response.headers.get(header) ?? "";
        if (!pattern.test(value)) {
          problems.push(`header ${header}="${value}" does not match ${pattern}`);
        }
      }

      for (const pattern of check.expectBody ?? []) {
        if (!pattern.test(text)) {
          problems.push(`body does not match ${pattern}`);
        }
      }
    } catch (error) {
      problems.push(`request failed: ${(error as Error).message}`);
    }

    if (problems.length === 0) {
      console.log(`PASS  ${check.name}`);
    } else {
      failed += 1;
      console.log(`FAIL  ${check.name}  (${check.method ?? "GET"} ${check.path})`);
      for (const problem of problems) console.log(`        ${problem}`);
    }
  }

  console.log(`\n${CHECKS.length - failed}/${CHECKS.length} checks passed against ${BASE}`);
  if (failed > 0) process.exitCode = 1;
}

run();
