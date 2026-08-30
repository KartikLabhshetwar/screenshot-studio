# Contributing to Screenshot Studio

## Setup

Requires Node.js 20+ and npm.

```bash
git clone https://github.com/<your-username>/screenshot-studio.git
cd screenshot-studio
npm install
npm run dev
```

Open [localhost:3000](http://localhost:3000). Core features work with no configuration. Copy `.env.example` to `.env.local` only if you need Cloudflare R2 asset storage, the Postgres screenshot cache, or analytics.

## Scripts

```bash
npm run dev        # start dev server
npm run build      # production build
npm run lint       # eslint
npm run lint:fix   # eslint --fix
npm test           # node test runner (tests/*.test.ts)
```

## Project Structure

```
app/              Next.js routes, API routes, sitemap, robots
  [locale]/       Marketing pages, editor (/), code image page (/code)
components/
  canvas/         Frames, overlays, canvas dimensions
  controls/       Editor control panels
  editor/         Editor layout and sections
  export/         Export dialogs and progress UI
  landing/        Landing page sections, Navigation, Footer
  timeline/       Animation timeline and playback
  ui/             Shared Radix-based primitives
lib/
  store/          Zustand state
  animation/      Animation engine and presets
  export/         Image and video export pipeline
  constants/      Backgrounds, presets, fonts
  seo/            Metadata, JSON-LD, comparison page data
hooks/            Custom hooks
types/            TypeScript definitions
tests/            Node test files
```

## Coding Standards

- TypeScript everywhere. No `any`; use `unknown` when the type is truly unknown.
- Functional components, named exports, `'use client'` only where needed.
- Use Tailwind theme tokens (`bg-background`, `text-foreground`, `border-border`). Never hardcode colors.
- Components are `PascalCase.tsx`, utilities are `kebab-case.ts`.
- No code comments; make names explain the code.
- Run `npm run lint` and `npm run build` before opening a PR.

## Common Tasks

| Task | Where |
|------|-------|
| New editor control | `components/controls/`, wire to `lib/store/` |
| New browser mockup | `components/canvas/frames/BrowserToolbar.tsx`, `Frame3DOverlay.tsx`, `canvas-dimensions.ts`, `components/editor/sections/BrowserMockupSection.tsx` |
| New background | `lib/constants/backgrounds.ts` |
| New animation preset | `lib/animation/presets.ts`, use `clonePresetTracks()` when applying |
| Export changes | `lib/export/export-service.ts`, `video-encoder.ts`, `webcodecs-encoder.ts`, `ffmpeg-encoder.ts` |
| New SEO comparison page | Add an entry to `lib/seo/comparisons.ts`; the route and sitemap pick it up |
| New marketing page | Add `app/[locale]/<path>/page.tsx` with `alternates.canonical`, then add the path to `app/sitemap.ts` |

## Pull Requests

1. Branch from `main`: `feat/short-name` or `fix/short-name`.
2. Use conventional commits: `feat(export): add watermark option`, `fix(canvas): image offset on resize`.
3. Describe what changed, why, and how to test. Add screenshots for visual changes.
4. Checklist: `npm run build` and `npm run lint` pass, tested in the browser, no console errors.

## Bug Reports

Open a [GitHub issue](https://github.com/opennookorg/screenshot-studio/issues) with steps to reproduce, expected vs actual behavior, browser and OS, and screenshots or console errors.

## License

Contributions are licensed under [Apache 2.0](./LICENSE).
