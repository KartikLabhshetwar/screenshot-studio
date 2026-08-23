import { SITE_URL } from "@/lib/seo/metadata";

export const BASE_URL = SITE_URL;

export const MARKDOWN_PATH_HEADER = "x-markdown-path";

export interface AgentPage {
  path: string;
  title: string;
  summary: string;
  points?: string[];
}

export const AGENT_PAGES: AgentPage[] = [
  {
    path: "/",
    title: "Screenshot Studio - Free Screenshot Editor & Mockup Maker",
    summary:
      "The Screenshot Studio editor. Drop in a screenshot and add gradient backgrounds, browser mockups, shadows, 3D perspective, and animation, then export a PNG, JPEG, WebP, MP4, WebM, or GIF. Editing runs client side, so imported images are not uploaded to edit them; only export compression sends the finished image to the server, which returns it without storing it. No signup, no watermark, no paid tier.",
    points: [
      "100+ gradient, mesh, and pattern backgrounds",
      "Safari, Chrome, and Arc browser mockups in light and dark",
      "3D perspective transforms and fully configurable shadows",
      "20+ animation presets with a keyframe timeline and video export",
      "Import a tweet by URL or a code snippet and render it as an image",
      "Export up to 5x resolution",
    ],
  },
  {
    path: "/landing",
    title: "Screenshot Studio - Product Overview",
    summary:
      "Product landing page: what Screenshot Studio does, who it is for, and how it compares to paid screenshot beautifiers.",
  },
  {
    path: "/free-screenshot-editor",
    title: "Free Screenshot Editor Online - Screenshot Studio",
    summary:
      "Free browser-based screenshot editor with no signup and no watermark. Covers the full editing workflow from upload to export.",
  },
  {
    path: "/features",
    title: "Features - Screenshot Studio",
    summary:
      "Index of every Screenshot Studio feature: backgrounds, browser mockups, device frames, 3D effects, animation, text and image overlays, and export formats.",
  },
  {
    path: "/features/screenshot-beautifier",
    title: "Screenshot Beautifier - Screenshot Studio",
    summary:
      "Background, padding, corner radius, and shadow controls that turn a raw screenshot into a presentable graphic.",
  },
  {
    path: "/features/social-media-graphics",
    title: "Social Media Graphics Maker - Screenshot Studio",
    summary:
      "Aspect ratio presets and styling for X/Twitter, Instagram, LinkedIn, and Product Hunt images.",
  },
  {
    path: "/features/animation-maker",
    title: "Animation Maker - Screenshot Studio",
    summary:
      "Keyframe timeline, 20+ animation presets, multi-slide slideshows, and in-browser MP4, WebM, and GIF encoding via FFmpeg WASM.",
  },
  {
    path: "/features/3d-effects",
    title: "3D Effects - Screenshot Studio",
    summary:
      "Perspective transforms, tilt, depth, and shadow controls for pseudo-3D product shots.",
  },
  {
    path: "/features/browser-mockups",
    title: "Browser Mockups - Screenshot Studio",
    summary:
      "Safari, Chrome, and Arc browser frames plus macOS window chrome, with editable URL bar text.",
  },
  {
    path: "/for/developers",
    title: "Screenshot Studio for Developers",
    summary:
      "Ship README, changelog, and docs screenshots that look designed, including code-snippet-to-image capture.",
  },
  {
    path: "/for/marketers",
    title: "Screenshot Studio for Marketers",
    summary:
      "Launch graphics, ad creative, and social posts built from product screenshots.",
  },
  {
    path: "/for/designers",
    title: "Screenshot Studio for Designers",
    summary:
      "Present work with mockups, framing, and animation without leaving the browser.",
  },
  {
    path: "/docs",
    title: "Screenshot Studio API Documentation",
    summary:
      "Public HTTP API reference: endpoints, request and response schemas, rate limits, and error codes. The machine-readable contract is published at /openapi.json.",
    points: [
      "POST /api/screenshot - capture a live URL as a base64 PNG",
      "POST /api/export - recompress an image as PNG, JPEG, or WebP",
      "GET /api/tweet/{id} - fetch tweet JSON for tweet-to-image rendering",
      "GET /api/image-proxy - same-origin proxy for Twitter media",
      "OpenAPI 3.1 spec: /openapi.json",
    ],
  },
  {
    path: "/docs/authentication",
    title: "Screenshot Studio API Authentication",
    summary:
      "The public Screenshot Studio API needs no API key, token, or account. Requests are anonymous and shaped by per-IP rate limits instead of credentials.",
    points: [
      "No API key or Authorization header is required",
      "POST /api/screenshot is limited to 20 requests per minute per IP",
      "Rate-limited responses return HTTP 429 with Retry-After and X-RateLimit-* headers",
      "Only maintenance endpoints are credentialed, and they are not part of the public surface",
    ],
  },
  {
    path: "/developers",
    title: "Screenshot Studio Developer Portal",
    summary:
      "Developer entry point: API docs, OpenAPI spec, authentication and rate limits, quickstart requests, agent files, and the open-source repository.",
    points: [
      "API docs: /docs",
      "OpenAPI 3.1 spec: /openapi.json",
      "Authentication and rate limits: /docs/authentication",
      "Agent overview: /llms.txt and /llms-full.txt",
      "Source: https://github.com/KartikLabhshetwar/screenshot-studio",
    ],
  },
  {
    path: "/changelog",
    title: "Changelog - Screenshot Studio",
    summary: "Release notes and shipped changes, newest first.",
  },
  {
    path: "/about",
    title: "About Screenshot Studio",
    summary:
      "Why Screenshot Studio exists, what it offers, and how the open-source project is run.",
  },
  {
    path: "/contact",
    title: "Contact Screenshot Studio",
    summary:
      "Ways to reach the maintainers: GitHub issues, X/Twitter, and email.",
  },
  {
    path: "/privacy-policy",
    title: "Privacy Policy - Screenshot Studio",
    summary:
      "How data is handled. Image editing is entirely client side and no image is uploaded to a server.",
  },
  {
    path: "/terms",
    title: "Terms & Conditions - Screenshot Studio",
    summary: "Terms of use for Screenshot Studio.",
  },
  {
    path: "/compare/pika-style",
    title: "Screenshot Studio vs Pika Style",
    summary: "Feature-by-feature comparison with Pika Style.",
  },
  {
    path: "/compare/shots-so",
    title: "Screenshot Studio vs Shots.so",
    summary: "Feature-by-feature comparison with Shots.so.",
  },
  {
    path: "/compare/snagit",
    title: "Screenshot Studio vs Snagit",
    summary: "Feature-by-feature comparison with Snagit.",
  },
  {
    path: "/compare/cleanshot-x",
    title: "Screenshot Studio vs CleanShot X",
    summary: "Feature-by-feature comparison with CleanShot X.",
  },
  {
    path: "/compare/screely",
    title: "Screenshot Studio vs Screely",
    summary: "Feature-by-feature comparison with Screely.",
  },
];

export const AGENT_RESOURCES = [
  { name: "API documentation", url: `${BASE_URL}/docs` },
  { name: "Developer portal", url: `${BASE_URL}/developers` },
  { name: "OpenAPI specification", url: `${BASE_URL}/openapi.json` },
  {
    name: "Authentication and rate limits",
    url: `${BASE_URL}/docs/authentication`,
  },
  { name: "llms.txt", url: `${BASE_URL}/llms.txt` },
  { name: "llms-full.txt", url: `${BASE_URL}/llms-full.txt` },
  { name: "Sitemap", url: `${BASE_URL}/sitemap.xml` },
  { name: "robots.txt", url: `${BASE_URL}/robots.txt` },
];

const LOCALE_PREFIX = /^\/(?:es|fr|de|ja|pt|ko|zh)(?=\/|$)/;

export function normalizeAgentPath(pathname: string): string {
  const withoutLocale = pathname.replace(LOCALE_PREFIX, "");
  const trimmed = withoutLocale.replace(/\/+$/, "");
  return trimmed === "" ? "/" : trimmed;
}

export function findAgentPage(pathname: string): AgentPage | undefined {
  const normalized = normalizeAgentPath(pathname);
  return AGENT_PAGES.find((page) => page.path === normalized);
}

export function renderAgentPageMarkdown(page: AgentPage): string {
  const lines = [`# ${page.title}`, "", page.summary];

  if (page.points?.length) {
    lines.push("", ...page.points.map((point) => `- ${point}`));
  }

  lines.push(
    "",
    "## Canonical URL",
    "",
    `${BASE_URL}${page.path === "/" ? "/" : page.path}`,
    "",
    "## Machine-readable resources",
    "",
    ...AGENT_RESOURCES.map(
      (resource) => `- [${resource.name}](${resource.url})`,
    ),
  );

  return `${lines.join("\n")}\n`;
}

export function renderNotFoundMarkdown(pathname: string): string {
  return [
    "# 404 Not Found",
    "",
    `No page exists at \`${pathname}\` on Screenshot Studio.`,
    "",
    "## Where to look next",
    "",
    ...AGENT_RESOURCES.map(
      (resource) => `- [${resource.name}](${resource.url})`,
    ),
    "",
    "## Main pages",
    "",
    ...AGENT_PAGES.slice(0, 12).map(
      (page) => `- [${page.title}](${BASE_URL}${page.path})`,
    ),
    "",
  ].join("\n");
}

export function renderNotAcceptableMarkdown(accept: string): string {
  return [
    "# 406 Not Acceptable",
    "",
    `This URL cannot be represented as \`${accept}\`.`,
    "",
    "## Supported representations",
    "",
    "- `text/html` (default)",
    "- `text/markdown` (send `Accept: text/markdown`)",
    "",
    `Machine-readable index: ${BASE_URL}/llms.txt`,
    "",
  ].join("\n");
}
