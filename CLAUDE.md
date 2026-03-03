# CLAUDE.md — Screenshot Studio

> For full architecture details, see [ARCHITECTURE.md](./ARCHITECTURE.md).

## Project Overview

Screenshot Studio is a free, browser-based visual editor for creating screenshots, animated visuals, and video exports. No signup, no watermarks. Live at [screenshot-studio.com](https://screenshot-studio.com).

## Dev Setup

```bash
# Requires .env with a DATABASE_URL (even a dummy value — only needed for prisma generate)
echo 'DATABASE_URL="postgresql://localhost:5432/screenshot_studio"' > .env

npm install
npm run dev        # → http://localhost:3000
```

- `npm run dev` runs `prisma generate` before `next dev --webpack`
- Core features work without a real DB or R2 — only website screenshot caching needs them
- The editor lives at `/home`

## Tech Stack

| Area | Tech |
|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript 5.9 |
| Styling | Tailwind CSS 4, Radix UI, shadcn/ui (`components/ui/`) |
| State | Zustand 5 + Zundo (undo/redo on `useImageStore`) |
| Canvas | HTML/CSS background + Konva user image (hybrid) |
| Animation | Custom keyframe engine (`lib/animation/`) |
| Video Export | WebCodecs + FFmpeg WASM + mp4-muxer |
| DB / Storage | Prisma + PostgreSQL, Cloudflare R2, IndexedDB |
| Icons | Hugeicons (`hugeicons-react`) |

## Key Architecture

### Dual Store Pattern
- **`useImageStore`** (`lib/store/index.ts`) — source of truth: image URL, all styles, overlays, timeline, slides. Wrapped with Zundo for undo/redo.
- **`useEditorStore`** (`lib/store/index.ts`) — canvas render state (screenshot src, dimensions, patterns). Kept in sync via `EditorStoreSync` component.

### Canvas Layers (composited on export)
1. Background — HTML/CSS, captured with `modern-screenshot`
2. User image — Konva stage
3. Overlays (text + image) — composited on top

### Image Upload Flow
```
User drops/pastes file
  → addImages(files)        [imageStore: creates slide + sets uploadedImageUrl]
  → setScreenshot({ src })  [editorStore: triggers canvas render]
  → ClientCanvas re-renders
```

### Replace Image Flow (new — preserves styles)
```
User drops/pastes while image is loaded
  → replaceImage(file)      [imageStore: swaps URL only, all styles untouched]
  → setScreenshot({ src })  [editorStore: triggers canvas render]
```

## Important Files

| File | Purpose |
|---|---|
| `lib/store/index.ts` | All Zustand state — `useImageStore` + `useEditorStore` |
| `components/canvas/EditorCanvas.tsx` | Canvas area — routes between upload state and canvas, holds global drag/drop/paste handlers |
| `components/canvas/ClientCanvas.tsx` | Konva canvas renderer (client-only, dynamic import) |
| `components/controls/CleanUploadState.tsx` | Upload dropzone UI (shown before first image) |
| `lib/animation/interpolation.ts` | Keyframe interpolation engine |
| `lib/animation/presets.ts` | 20+ animation presets in 5 categories |
| `lib/export/export-slideshow-video.ts` | Video export orchestrator |
| `lib/constants.ts` | `MAX_IMAGE_SIZE`, `ALLOWED_IMAGE_TYPES` |
| `lib/constants/` | Backgrounds, gradients, solid colors, fonts, aspect ratios, presets |
| `types/animation.ts` | `Keyframe`, `AnimationTrack`, `AnimationClip`, `TimelineState` types |

## State: What setImage vs replaceImage Does

| Action | Use Case | Resets Styles? |
|---|---|---|
| `setImage(file)` | First image upload (via `addImages`) | YES — full reset to defaults |
| `replaceImage(file)` | Swap image after one is loaded | NO — only swaps URL + name |
| `clearImage()` | Remove button | YES — full reset |

## Global Drag/Drop/Paste (after image is loaded)

Handled in `EditorCanvas.tsx` via `useEffect` on `hasImage`:
- `window dragover` → `preventDefault()` + show drop overlay
- `window drop` → validate type/size → `replaceImage` + `setScreenshot`
- `document paste` → skips INPUT/TEXTAREA targets → same swap
- All listeners cleaned up on unmount

## Conventions

- Components use named exports (`export function Foo`)
- Tailwind utility classes; `cn()` from `lib/utils` for conditional classes
- Store actions are co-located in `lib/store/index.ts` (single file)
- Icon imports from `hugeicons-react`
- `noClick: true` on dropzone in `CleanUploadState` — click is handled by the card `onClick={open}`
- Background assets served from Cloudflare R2; `getR2ImageUrl()` in `lib/r2.ts` handles URL construction

## Recent Changes

| Date | Change |
|---|---|
| 2026-03-03 | Added `replaceImage` store action — swaps image URL while preserving all styles |
| 2026-03-03 | Global drag/drop/paste handlers in `EditorCanvas` — fixes browser opening images in new tab after first upload |
| 2026-03-03 | Drop overlay with "Drop to replace image / Your styles will be preserved" feedback |

---

_Last updated: 2026-03-03 — initial CLAUDE.md created; drag/drop replace bug fixed_
