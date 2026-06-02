import { Metadata } from "next";
import Link from "next/link";
import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Changelog - Latest Updates & Features",
  description:
    "See what's new in Screenshot Studio. Latest updates including animation timeline, video export, 3D effects, and more.",
  keywords: [
    "screenshot studio changelog",
    "screenshot studio updates",
    "screenshot editor new features",
    "image editor release notes",
    "animation maker updates",
  ],
  openGraph: {
    title: "Changelog - Screenshot Studio",
    description:
      "See what's new in Screenshot Studio. Latest updates including animation timeline, video export, and more.",
    url: "/changelog",
  },
  alternates: {
    canonical: "/changelog",
  },
};

interface ChangelogEntry {
  date: string;
  version: string;
  title: string;
  description: string;
  changes: {
    type: "added" | "improved" | "fixed";
    text: string;
  }[];
}

const changelog: ChangelogEntry[] = [
  {
    date: "March 9, 2026",
    version: "2.5.0",
    title: "Browser Mockups",
    description:
      "Realistic Safari and Chrome browser frames with light and dark modes, adjustable header size, and custom URL.",
    changes: [
      {
        type: "added",
        text: "Safari browser frame (light & dark) with traffic lights, sidebar, back/forward, and centered address bar",
      },
      {
        type: "added",
        text: "Chrome browser frame (light & dark) with tab bar, active tab, and omnibox address bar",
      },
      {
        type: "added",
        text: "Adjustable browser header size slider (50%–200%) for fine-tuning toolbar proportions",
      },
      {
        type: "added",
        text: "Custom URL display in the browser address bar",
      },
      {
        type: "improved",
        text: "Browser frames are shared components — identical rendering in both 2D and 3D perspective views",
      },
      {
        type: "improved",
        text: "Browser style previews in the editor now match the style section card layout",
      },
    ],
  },
  {
    date: "March 7, 2026",
    version: "2.4.0",
    title: "Tweet Import, Code Snippets & Overlay Improvements",
    description:
      "Import tweets as screenshots, generate beautiful code snippets, and enjoy improved overlay resize and depth controls.",
    changes: [
      {
        type: "added",
        text: "Tweet Import — paste any tweet URL to preview and capture it as a high-res screenshot with light/dark theme toggle",
      },
      {
        type: "added",
        text: "Code Snippet Generator — syntax-highlighted code screenshots with 20+ themes, 20 languages, 10 mono fonts, and customizable font size, border radius, and line numbers",
      },
      {
        type: "added",
        text: "Tweet dark theme uses X's \"Lights out\" pure black instead of the default blue \"Dim\" theme",
      },
      {
        type: "improved",
        text: "Image overlay resize and rotate handles now work reliably — fixed pointer-events and deselection issues with Moveable controls",
      },
      {
        type: "improved",
        text: "Depth section simplified — removed shadow overlays for a cleaner asset picker focused on 3D objects",
      },
      {
        type: "improved",
        text: "Main image resize handles no longer deselect when clicked, fixing the resize-on-click bug for code snippets and tweet screenshots",
      },
      {
        type: "fixed",
        text: "Input and dropdown padding no longer inflated by global font-size rule — scoped to mobile only for iOS zoom prevention",
      },
      {
        type: "fixed",
        text: "Overlay context toolbar replaced with a cleaner, universal design (layer toggle, duplicate, delete)",
      },
    ],
  },
  {
    date: "March 6, 2026",
    version: "2.3.0",
    title: "Annotation Tools, Text Overlay Revamp & UI Polish",
    description:
      "Draw arrows, curves, rectangles, circles, and blur regions directly on the canvas. Text overlay controls redesigned. Changelog and landing page refreshed.",
    changes: [
      {
        type: "added",
        text: "Annotation tools — draw arrows, curved arrows, lines, rectangles, circles, and blur regions on canvas",
      },
      {
        type: "added",
        text: "Annotations auto-select after drawing for immediate color and stroke editing from the sidebar",
      },
      {
        type: "added",
        text: "Per-annotation editing — click any shape on canvas to change its color and stroke width",
      },
      {
        type: "added",
        text: "Draggable curve control point for curved arrows with guide lines",
      },
      {
        type: "added",
        text: "Blur tool — draw regions on canvas that apply backdrop blur, with per-region intensity control",
      },
      {
        type: "added",
        text: "Stroke width range increased to 24px with preset buttons and fine-control slider",
      },
      {
        type: "improved",
        text: "Text overlay controls completely redesigned — compact inline editing, quick color swatches, native font/weight selectors, shadow toggle",
      },
      {
        type: "improved",
        text: "Annotate section moved to the top of the Edit panel for faster access",
      },
      {
        type: "improved",
        text: "Changelog page redesigned with a cleaner, minimal layout grouped by change type",
      },
      {
        type: "improved",
        text: "Video testimonials section now uses a responsive grid supporting multiple videos",
      },
      {
        type: "improved",
        text: "Arrow heads redesigned with sleek notched shape and line shortening to prevent overlap",
      },
      {
        type: "fixed",
        text: "YouTube embeds on landing page no longer blocked by Cross-Origin-Embedder-Policy headers",
      },
      {
        type: "fixed",
        text: "Annotation stroke width slider max increased from 8 to 24 — previously too thin on large canvases",
      },
    ],
  },
  {
    date: "February 28, 2026",
    version: "2.2.0",
    title: "Templates Sidebar, Tab Transitions & Export Fix",
    description:
      "Presets moved to a new Templates overlay, tab switching now has smooth transitions, and animation video export accuracy has been fixed.",
    changes: [
      {
        type: "added",
        text: "Templates overlay — presets gallery moved from the tab bar to a dedicated slide-in panel accessible via the \"Templates\" button above tabs",
      },
      {
        type: "added",
        text: "Smooth tab content transitions — switching between Settings, Edit, BG, 3D, and Animate tabs now fades with a subtle slide animation",
      },
      {
        type: "improved",
        text: "Right panel tab bar reduced from 6 to 5 tabs for a cleaner layout, with presets accessible from the Templates overlay",
      },
      {
        type: "improved",
        text: "Templates overlay opens/closes with a smooth slide-in animation and supports Escape key to dismiss",
      },
      {
        type: "fixed",
        text: "Animation video export now captures exact frame values — previously, a CSS transition on the 3D overlay caused exported frames to show smoothed/lagged intermediate values instead of the intended animation",
      },
      {
        type: "fixed",
        text: "Export frame timing improved with double-RAF technique ensuring React DOM commits are fully painted before each frame capture",
      },
    ],
  },
  {
    date: "February 23, 2026",
    version: "2.1.0",
    title: "Overlay Resize, Custom Presets & Arc Controls",
    description:
      "Resize overlays directly on the canvas, save your own presets, and fine-tune Arc frame borders with new width and opacity sliders.",
    changes: [
      {
        type: "added",
        text: "On-canvas resize handles for arrow and sticker overlays — drag any corner to resize (20–800px)",
      },
      {
        type: "added",
        text: "Custom presets — save your current canvas configuration and reuse it later, persisted in local storage",
      },
      {
        type: "added",
        text: "Arc frame width slider (1–20px) and opacity slider (0–100%) in Frames section and Border Controls",
      },
      {
        type: "improved",
        text: "Arc frame borders now use dynamic width and opacity instead of hardcoded values across all render paths",
      },
      {
        type: "fixed",
        text: "Arc frame opacity and width changes now reflect immediately on the canvas",
      },
    ],
  },
  {
    date: "February 20, 2026",
    version: "2.0.0",
    title: "Animation & Video Export",
    description:
      "Bring your screenshots to life with keyframe animations and export as MP4, WebM, or GIF.",
    changes: [
      {
        type: "added",
        text: "Timeline editor with interactive playhead, ruler, and animation tracks",
      },
      {
        type: "added",
        text: "20+ animation presets across 5 categories: Reveal, Flip, Perspective, Orbit, and Depth",
      },
      {
        type: "added",
        text: "Keyframe animation system with 8 easing functions (linear, ease-in, ease-out, cubic, expo)",
      },
      {
        type: "added",
        text: "Real-time animation preview with play, pause, loop, and scrub controls",
      },
      {
        type: "added",
        text: "Video export in MP4, WebM, and GIF formats with quality presets (High/Medium/Low)",
      },
      {
        type: "added",
        text: "Hardware-accelerated encoding via WebCodecs API with FFmpeg WASM fallback",
      },
      {
        type: "added",
        text: "Multi-threaded FFmpeg encoding using SharedArrayBuffer for faster exports",
      },
      {
        type: "added",
        text: "Export progress dialog with real-time frame count and status tracking",
      },
      {
        type: "added",
        text: "Animation preset gallery with category browsing in the right panel",
      },
      {
        type: "added",
        text: "Multi-clip support with overlap handling on the timeline",
      },
      {
        type: "improved",
        text: "Editor right panel now includes dedicated Animate tab",
      },
      {
        type: "improved",
        text: "Analytics tracking added to editor, timeline controls, CTA, and hero sections",
      },
    ],
  },
  {
    date: "February 14, 2026",
    version: "1.0.0",
    title: "Complete Revamp",
    description:
      "A ground-up rebuild of Screenshot Studio with a modern stack, new UI, and powerful new features.",
    changes: [
      {
        type: "added",
        text: "New editor layout with unified right panel (Settings, Edit, BG, 3D, Animate, Presets tabs)",
      },
      {
        type: "added",
        text: "3D perspective transforms with real-time preview",
      },
      {
        type: "added",
        text: "50+ gradient and solid color backgrounds with blur and noise effects",
      },
      {
        type: "added",
        text: "Device frames: macOS, Windows, Arc-style, and Polaroid borders",
      },
      {
        type: "added",
        text: "Text overlays with 25+ fonts, custom colors, shadows, and positioning",
      },
      {
        type: "added",
        text: "Image overlays with rotation, flip, opacity, and drag positioning",
      },
      {
        type: "added",
        text: "Website screenshot capture via Screen-Shot.xyz (desktop and mobile viewports)",
      },
      {
        type: "added",
        text: "High-res export up to 5x scale in PNG and JPG formats",
      },
      {
        type: "added",
        text: "Undo/redo with unlimited history via Zundo",
      },
      {
        type: "added",
        text: "Design presets for one-click styling",
      },
      {
        type: "added",
        text: "Aspect ratio presets for Instagram, YouTube, Twitter, LinkedIn, and Open Graph",
      },
      {
        type: "added",
        text: "Error boundaries and lazy loading for gradient components",
      },
      {
        type: "improved",
        text: "Migrated to Next.js 16 with React 19 and React Compiler",
      },
      {
        type: "improved",
        text: "Upgraded to Tailwind CSS 4 with new theming system",
      },
      {
        type: "improved",
        text: "State management rebuilt with Zustand + temporal middleware",
      },
      {
        type: "improved",
        text: "Landing page redesigned with new hero, features, testimonials, and FAQ sections",
      },
      {
        type: "improved",
        text: "SEO-optimized feature pages for screenshot beautifier, social media graphics, animations, and 3D effects",
      },
    ],
  },
];

const typeBadge = {
  added: "text-emerald-500",
  improved: "text-blue-500",
  fixed: "text-amber-500",
} as const;

const typeDot = {
  added: "bg-emerald-500",
  improved: "bg-blue-500",
  fixed: "bg-amber-500",
} as const;

export default function ChangelogPage() {
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
            name: "Changelog",
            item: "https://screenshot-studio.com/changelog",
          },
        ],
      },
      {
        "@type": "WebPage",
        name: "Screenshot Studio Changelog",
        description:
          "Latest updates, new features, and improvements to Screenshot Studio.",
        url: "https://screenshot-studio.com/changelog",
        mainEntity: {
          "@type": "ItemList",
          name: "Screenshot Studio Release History",
          itemListElement: changelog.map((entry, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: `v${entry.version} - ${entry.title}`,
            description: entry.description,
          })),
        },
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Navigation ctaLabel="Open Editor" ctaHref="/" />

      <main className="flex-1 pt-28 pb-20 px-4">
        <div className="max-w-2xl mx-auto">

          {/* Header */}
          <header className="mb-16">
            <h1 className="text-3xl font-semibold tracking-tight mb-2">Changelog</h1>
            <p className="text-muted-foreground text-sm">
              New features, improvements, and fixes.
            </p>
          </header>

          {/* Entries */}
          <div className="space-y-0">
            {changelog.map((entry, entryIndex) => (
              <article
                key={entry.version}
                className={entryIndex !== changelog.length - 1 ? "pb-12 mb-12 border-b border-border/50" : "pb-12"}
              >
                {/* Date + version */}
                <div className="flex items-baseline gap-3 mb-4">
                  <time className="text-xs text-muted-foreground font-mono">
                    {entry.date}
                  </time>
                  <span className="text-xs text-muted-foreground font-mono">
                    v{entry.version}
                  </span>
                </div>

                <h2 className="text-lg font-semibold tracking-tight mb-1.5">
                  {entry.title}
                </h2>
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                  {entry.description}
                </p>

                {/* Group changes by type */}
                {(["added", "improved", "fixed"] as const).map((type) => {
                  const items = entry.changes.filter((c) => c.type === type);
                  if (items.length === 0) return null;
                  return (
                    <div key={type} className="mb-4 last:mb-0">
                      <h3 className={`text-xs font-medium uppercase tracking-wider mb-2 ${typeBadge[type]}`}>
                        {type}
                      </h3>
                      <ul className="space-y-1.5">
                        {items.map((change, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-sm text-foreground/80 leading-relaxed">
                            <span className={`shrink-0 w-1.5 h-1.5 rounded-full mt-[7px] ${typeDot[type]}`} />
                            {change.text}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </article>
            ))}
          </div>

          {/* CTA */}
          <div className="pt-8 border-t border-border/50 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              All features are free. No signup required.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground text-sm font-medium px-5 py-2.5 rounded-full hover:bg-primary/90 transition-colors"
            >
              Open Editor
            </Link>
          </div>
        </div>
      </main>

      <Footer brandName="Screenshot Studio" />
    </div>
  );
}
