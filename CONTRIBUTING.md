# Contributing to Screenshot Studio

Thanks for your interest in contributing! Here's what you need to know.

## Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **Git**
- Basic knowledge of React, TypeScript, and Next.js

### Setup

```bash
git clone https://github.com/your-username/screenshot-studio.git
cd screenshot-studio
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Environment Variables (optional)

Create `.env.local` for optional features:

```env
# Cloudflare R2 (asset storage)
R2_ACCESS_KEY_ID=your-access-key
R2_SECRET_ACCESS_KEY=your-secret-key
R2_BUCKET_NAME=your-bucket
R2_ACCOUNT_ID=your-account-id

# Database (screenshot caching)
DATABASE_URL="postgresql://user:password@host:port/dbname"

# Screenshot API (defaults to free Microlink API)
SCREENSHOT_API_URL=https://api.microlink.io
```

Core features work without any configuration.

## Project Structure

```
screenshot-studio/
├── app/                  # Next.js pages and API routes
├── components/
│   ├── canvas/           # HTML/CSS canvas rendering (frames, overlays, dimensions)
│   ├── controls/         # Editor control panels
│   ├── editor/           # Editor layout and header
│   ├── export/           # Export dialogs and progress UI
│   ├── landing/          # Landing page sections
│   ├── overlays/         # Image/sticker overlays
│   ├── templates/        # Template system
│   ├── text-overlay/     # Text layer components
│   ├── timeline/         # Animation timeline, tracks, playback
│   └── ui/               # Shared UI primitives (Radix-based)
├── lib/
│   ├── store/            # Zustand state management
│   ├── animation/        # Animation engine, presets, interpolation
│   ├── export/           # Image & video export pipeline
│   ├── constants/        # Backgrounds, presets, fonts
│   └── seo/              # SEO data and JSON-LD
├── hooks/                # Custom React hooks
└── types/                # TypeScript definitions
```

## Coding Standards

### TypeScript
- Use TypeScript for all new code
- Avoid `any` — use `unknown` if type is truly unknown
- Be explicit for function parameters and return types

### React
- Functional components with hooks only
- Named exports over default exports
- `'use client'` directive for client components
- Keep components focused and single-purpose

### Styling
- **Always use CSS theme variables** via Tailwind classes (`bg-background`, `text-foreground`, `bg-card`, `border-border`, `bg-primary`, etc.)
- **Never use hardcoded colors** (`bg-white`, `text-black`, `bg-neutral-*`, hex values)
- See `app/globals.css` for all available theme tokens

### File Naming
- Components: `PascalCase.tsx` (e.g., `EditorCanvas.tsx`)
- Utilities: `kebab-case.ts` (e.g., `export-utils.ts`)
- Types: PascalCase interfaces (e.g., `CanvasObject`)

### Linting

```bash
npm run lint          # Check for errors
npm run lint:fix      # Auto-fix
```

Always run lint before committing.

## Common Tasks

### Adding a New Control
1. Create component in `components/controls/`
2. Add to the appropriate editor panel
3. Connect to Zustand store (`lib/store/`)
4. Update types if needed

### Adding a Browser Mockup Style
1. Add toolbar component in `components/canvas/frames/BrowserToolbar.tsx`
2. The toolbar is shared between 2D (`HTMLMainImageLayer`) and 3D (`Frame3DOverlay`) views
3. Add frame type to `FrameConfig` in `Frame3DOverlay.tsx`
4. Update `canvas-dimensions.ts` with header height for the new frame
5. Add preview card in `components/editor/sections/BrowserMockupSection.tsx`

### Adding a New Background
1. Add definition to `lib/constants/backgrounds.ts`
2. Update `BackgroundConfig` type if needed

### Adding an Animation Preset
1. Add preset to `lib/animation/presets.ts`
2. Define keyframes with timing, properties, and easing
3. Use `clonePresetTracks()` when applying to ensure unique IDs

### Modifying Export Logic
- Image export: `lib/export/export-service.ts`
- Video export: `lib/export/video-encoder.ts`, `webcodecs-encoder.ts`, `ffmpeg-encoder.ts`

## Submitting Changes

### Branch & Commit

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

Use conventional commits:

```
feat(export): add watermark option
fix(canvas): fix image positioning on resize
refactor(store): simplify state management
docs: update contributing guide
```

### Pull Request

1. Push your branch
2. Open a PR with a clear description
3. Include what changed, why, and how to test it
4. Add screenshots if there are visual changes

### PR Checklist

- [ ] `npm run build` passes
- [ ] `npm run lint` passes
- [ ] Tested manually in the browser
- [ ] No console errors
- [ ] Follows existing code style

## Testing Checklist

Before submitting, verify:

- [ ] Image upload (drag & drop and file picker)
- [ ] Background changes (gradient, solid, image)
- [ ] Device frames and border controls
- [ ] 3D perspective transforms
- [ ] Text and image overlays
- [ ] Animation presets and timeline playback
- [ ] Export (PNG, JPG, video formats)
- [ ] Copy to clipboard
- [ ] Aspect ratio changes
- [ ] Responsive layout

## Bug Reports

Include:
- Steps to reproduce
- Expected vs actual behavior
- Browser, OS, device
- Screenshots or console errors

## Getting Help

- [GitHub Issues](https://github.com/KartikLabhshetwar/screenshot-studio/issues)
- [GitHub Discussions](https://github.com/KartikLabhshetwar/screenshot-studio/discussions)

## License

By contributing, your work is licensed under the same [Apache 2.0 License](./LICENSE) as the project.
