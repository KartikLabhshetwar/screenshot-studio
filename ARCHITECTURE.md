# Stage Architecture Documentation

## Overview

Stage is a modern web-based canvas editor built with Next.js 16 and React 19. It enables users to create stunning visual designs by uploading images, adding text overlays, customizing backgrounds, and exporting high-quality graphics—all in the browser.

## Tech Stack

### Core Framework
- **Next.js 16** - React framework with App Router
- **React 19** - UI library with React Compiler enabled
- **TypeScript** - Type safety throughout the codebase

### Canvas & Rendering
- **Konva/React-Konva** - 2D canvas rendering engine for user images and overlays
- **html2canvas** - DOM-to-canvas conversion for background rendering
- **modern-screenshot** - 3D transform capture for perspective effects

### State Management
- **Zustand** - Lightweight state management with two main stores:
  - `useImageStore` - Main image and design state (with Zundo undo/redo)
  - `useEditorStore` - Canvas rendering state (synced with image store)

### Animation & Video
- **Custom Animation Engine** - Keyframe interpolation with 8 easing functions
- **FFmpeg WASM** - Multi-threaded video encoding (H.264, WebM, GIF)
- **WebCodecs API** - Hardware-accelerated H.264 encoding with mp4-muxer
- **MediaRecorder API** - Native WebM recording fallback

### Styling
- **Tailwind CSS 4** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Hugeicons** - Icon library

### Image Processing & Storage
- **Cloudflare R2** - Object storage for assets
- **Microlink API** - Free website screenshot capture service (no API key required)
- **IndexedDB** - Client-side storage for images and exports
- **Sharp** - Server-side image processing (dev dependency)
- **Prisma + PostgreSQL** - Database for screenshot caching

## Project Structure

```text
stage/
├── app/                      # Next.js App Router pages
│   ├── api/                  # API routes
│   │   └── screenshot/       # Website screenshot API endpoint
│   ├── home/                 # Editor page
│   ├── features/             # Feature pages (SEO)
│   ├── changelog/            # Changelog page
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Landing page
│   └── globals.css           # Global styles
│
├── components/              # React components
│   ├── canvas/              # Canvas rendering components
│   │   ├── ClientCanvas.tsx  # Main Konva canvas renderer
│   │   ├── CanvasContext.tsx # Canvas state management
│   │   └── EditorCanvas.tsx  # Canvas wrapper component
│   ├── controls/            # Editor control panels
│   │   ├── BorderControls.tsx
│   │   ├── ShadowControls.tsx
│   │   ├── Perspective3DControls.tsx
│   │   └── UploadDropzone.tsx
│   ├── editor/              # Editor layout components
│   │   ├── EditorLayout.tsx
│   │   ├── editor-left-panel.tsx
│   │   └── unified-right-panel.tsx
│   ├── timeline/            # Animation timeline components
│   │   ├── TimelineEditor.tsx     # Main timeline UI
│   │   ├── TimelineControls.tsx   # Play/pause/loop controls
│   │   ├── TimelineRuler.tsx      # Time ruler with ticks
│   │   ├── TimelineTrack.tsx      # Animation track display
│   │   ├── TimelinePlayhead.tsx   # Draggable playhead
│   │   ├── KeyframeMarker.tsx     # Keyframe indicators
│   │   ├── AnimationPresetGallery.tsx # Preset browser
│   │   └── hooks/useTimelinePlayback.tsx # Playback engine
│   ├── export/              # Export UI components
│   ├── overlays/            # Overlay management
│   ├── presets/             # Preset selector
│   ├── text-overlay/        # Text overlay controls
│   ├── landing/             # Landing page components
│   └── ui/                  # Reusable UI components (shadcn/ui)
│
├── lib/                     # Core libraries and utilities
│   ├── store/               # Zustand stores
│   │   └── index.ts         # useImageStore & useEditorStore
│   ├── animation/           # Animation engine
│   │   ├── interpolation.ts # Keyframe interpolation & easing
│   │   └── presets.ts       # 20+ animation presets
│   ├── export/              # Export functionality
│   │   ├── export-service.ts          # Image export logic
│   │   ├── export-slideshow-video.ts  # Video export orchestrator
│   │   ├── ffmpeg-encoder.ts          # FFmpeg WASM encoder
│   │   ├── webcodecs-encoder.ts       # WebCodecs H.264 encoder
│   │   ├── video-encoder.ts           # MediaRecorder wrapper
│   │   └── export-utils.ts            # Export utilities
│   ├── constants/           # Configuration constants
│   │   ├── aspect-ratios.ts
│   │   ├── backgrounds.ts
│   │   ├── fonts.ts
│   │   ├── gradient-colors.ts
│   │   ├── presets.ts
│   │   └── solid-colors.ts
│   ├── canvas/              # Canvas utilities
│   ├── image-storage.ts     # IndexedDB image storage
│   └── export-storage.ts    # IndexedDB export storage
│
├── hooks/                   # Custom React hooks
│   ├── useExport.ts         # Export hook
│   ├── useCanvas.ts         # Canvas operations hook
│   └── useAspectRatioDimensions.ts
│
├── types/                   # TypeScript type definitions
│   ├── canvas.ts
│   ├── editor.ts
│   └── animation.ts         # Animation, timeline, keyframe types
│
└── public/                  # Static assets
    ├── assets/              # Demo images
    ├── overlays/            # Overlay images
    └── backgrounds/          # Background images
```

## Architecture Patterns

### State Management

The application uses a dual-store pattern with Zustand:

#### 1. Image Store (`useImageStore`)
Manages the main design state:
- Uploaded image URL and metadata
- Background configuration (gradient, solid, image)
- Text overlays array
- Image overlays array
- Image transformations (scale, opacity, border radius)
- Border and shadow configurations
- 3D perspective transforms
- Aspect ratio selection
- **Timeline state** (duration, playhead, isPlaying, isLooping, tracks, zoom)
- **Animation clips** (preset-based clips with start time, duration, color)
- **Slides** (multi-slide support for slideshows)

#### 2. Editor Store (`useEditorStore`)
Manages canvas rendering state:
- Screenshot/image state (for Konva)
- Background mode (solid/gradient)
- Shadow configuration
- Pattern configuration
- Frame configuration
- Canvas dimensions and padding
- Noise configuration

**Store Synchronization**: `EditorStoreSync` component keeps both stores in sync using React effects.

### Canvas Rendering Architecture

The canvas rendering uses a hybrid approach:

1. **Background Layer** - Rendered via HTML/CSS, captured with html2canvas
2. **User Image Layer** - Rendered via Konva Stage
3. **Overlay Layer** - Text and image overlays rendered separately, composited on top

This separation allows:
- High-quality background rendering with CSS effects
- Precise image positioning with Konva
- Proper layering of overlays above user content

### Export Pipeline

The export process follows a multi-step compositing pipeline:

```text
1. Export Background (html2canvas)
   ├── Clone background element
   ├── Apply blur effects
   └── Apply noise overlay

2. Export Konva Stage (user images)
   ├── Hide background layer
   ├── Export at high pixel ratio
   └── Scale to export dimensions

3. Export Overlays (html2canvas)
   ├── Create temporary DOM container
   ├── Render text overlays with fonts
   ├── Render image overlays
   └── Capture with html2canvas

4. Composite Layers
   ├── Background (bottom)
   ├── User Image (middle)
   └── Overlays (top)

5. Add Watermark
6. Convert to Blob/DataURL
```

### Image Storage

Images are stored using a hybrid approach:

1. **Blob URLs** - Temporary URLs for uploaded images
2. **IndexedDB** - Persistent storage for:
   - Uploaded image blobs (keyed by unique ID)
   - Exported images with metadata
   - Export preferences

When an image is uploaded:
- A blob URL is created for immediate use
- The blob is saved to IndexedDB with a unique ID
- The ID is stored in canvas objects for persistence

### Component Architecture

#### Layout Components
- `EditorLayout` - Main editor container with responsive panels
- `EditorLeftPanel` - Left sidebar with controls
- `EditorRightPanel` - Right sidebar with style options
- `EditorBottomBar` - Bottom bar with export/actions

#### Canvas Components
- `EditorCanvas` - Wrapper that shows upload UI or canvas
- `ClientCanvas` - Main Konva canvas renderer (client-only)
- `CanvasContext` - Context provider for canvas operations

#### Control Components
- `BorderControls` - Border style and configuration
- `ShadowControls` - Shadow customization
- `Perspective3DControls` - 3D transform controls
- `BackgroundEffects` - Background blur and noise

## Key Features Implementation

### 1. Image Upload
- **File Upload**: Uses `react-dropzone` for drag-and-drop
- **Website Screenshot**: API route calls [Microlink](https://microlink.io) API
  - Supports desktop (1920x1080) and mobile (375x667) viewport sizes
  - Device type selection via UI dropdown
  - Screenshots cached separately by device type
- **Validation**: File type and size validation, URL validation
- **Storage**: Blob URL creation + IndexedDB persistence

### 2. Background System
Supports three background types:
- **Gradient**: CSS linear gradients with customizable colors and angles
- **Solid**: Single color backgrounds
- **Image**: Cloudinary-hosted images or uploaded images

Background effects:
- **Blur**: Applied via CSS filter, captured in export
- **Noise**: Generated noise texture with overlay blend mode

### 3. Text Overlays
- Multiple text overlays with independent positioning
- Custom fonts, colors, sizes, weights
- Text shadows with customizable properties
- Vertical/horizontal orientation
- Position stored as percentage for responsive scaling

### 4. Image Overlays
- Decorative overlays from Cloudinary gallery
- Custom uploaded overlays
- Position, size, rotation, flip controls
- Opacity and visibility toggles

### 5. Image Transformations
- **Scale**: Percentage-based scaling
- **Opacity**: 0-100% opacity control
- **Border Radius**: Rounded corners
- **Borders**: Multiple border styles (glassy, window, ruler, etc.)
- **Shadows**: Customizable shadow with blur, offset, spread, color
- **3D Perspective**: CSS 3D transforms with perspective

### 6. Export System
- **Format**: PNG (with transparency support)
- **Quality**: 0-1 quality slider
- **Scale**: Up to 5x scaling for high-resolution exports
- **Watermark**: Automatic watermark addition
- **Storage**: Exported images saved to IndexedDB

### 7. Presets
Pre-configured design presets that apply:
- Aspect ratio
- Background configuration
- Border and shadow settings
- Image transformations

Presets are defined in `lib/constants/presets.ts` and can be applied with one click.

### 8. Animation & Timeline System

The animation system enables keyframe-based animations on canvas properties with real-time preview and video export.

#### Animation Engine (`lib/animation/`)

**Interpolation** (`interpolation.ts`):
- `getInterpolatedProperties()` - Interpolate values between keyframes at a given time
- `getClipInterpolatedProperties()` - Multi-clip aware interpolation (later clips override earlier)
- `findSurroundingKeyframes()` - Locate keyframe context for smooth transitions
- `clonePresetTracks()` - Apply presets with fresh unique IDs

**Easing Functions**: linear, ease-in, ease-out, ease-in-out, ease-in-cubic, ease-out-cubic, ease-in-expo, ease-out-expo

**Animatable Properties**: `perspective`, `rotateX`, `rotateY`, `rotateZ`, `translateX`, `translateY`, `scale`, `imageOpacity`

#### Animation Presets (`lib/animation/presets.ts`)

20+ presets organized in 5 categories:

| Category | Presets |
|----------|---------|
| Reveal | Hero Landing, Slide In 3D, Rise & Settle, Drop In |
| Flip | Flip X, Flip Y, Peek |
| Perspective | Showcase Tilt, Isometric, Hover Float, Parallax Drift |
| Orbit | Orbit Left, Orbit Right, Turntable |
| Depth | Push Away, Pull Close, Dramatic Zoom, Breathe 3D |

#### Timeline Components (`components/timeline/`)

- **TimelineEditor** - Main timeline UI with ruler, playhead, and tracks
- **TimelineControls** - Playback controls (play, pause, skip, loop toggle)
- **TimelineTrack** - Individual animation track with keyframe markers
- **TimelinePlayhead** - Draggable vertical line for current position
- **KeyframeMarker** - Visual keyframe indicators on tracks
- **AnimationPresetGallery** - Browse and apply animation presets

#### Playback Engine (`hooks/useTimelinePlayback`)

The playback hook manages the animation loop:
1. Runs via `requestAnimationFrame` to update the playhead every frame
2. Applies interpolated properties to the store's `perspective3D` and `imageOpacity`
3. Supports scrubbing (when paused, updates properties on playhead change)
4. Handles automatic slide switching based on playhead position
5. Supports looping with modulo math

#### Type Definitions (`types/animation.ts`)

```typescript
interface Keyframe {
  id: string
  time: number            // milliseconds
  properties: Partial<AnimatableProperties>
  easing: EasingFunction
}

interface AnimationTrack {
  id: string
  name: string
  type: 'transform' | 'opacity'
  keyframes: Keyframe[]
  isLocked: boolean
  isVisible: boolean
  clipId?: string         // Links to animation clip
}

interface AnimationClip {
  id: string
  presetId: string
  name: string
  startTime: number       // ms
  duration: number        // ms
  color: string
}

interface TimelineState {
  duration: number
  playhead: number
  isPlaying: boolean
  isLooping: boolean
  tracks: AnimationTrack[]
  zoom: number
  snapToKeyframes: boolean
}
```

### 9. Video Export System

The video export pipeline supports multiple formats and encoders with automatic selection.

#### Export Pipeline (`lib/export/export-slideshow-video.ts`)

```text
User clicks Export Video
  ↓
Select encoder (based on format + browser support)
  ↓
For each frame:
  1. Set playhead to frame time
  2. Apply interpolated animation properties
  3. Capture canvas as image
  4. Encode frame
  ↓
Finalize video file
  ↓
Download + progress tracking
```

#### Encoder Selection

```text
Format=GIF   → FFmpeg (only option)
Format=WebM  → MediaRecorder (native support)
Format=MP4   → WebCodecs (if available) → FFmpeg (fallback)
```

#### Encoders

| Encoder | File | Use Case |
|---------|------|----------|
| FFmpeg WASM | `ffmpeg-encoder.ts` | H.264/GIF, multi-threaded via SharedArrayBuffer |
| WebCodecs | `webcodecs-encoder.ts` | Hardware-accelerated H.264 with mp4-muxer |
| MediaRecorder | `video-encoder.ts` | Native WebM via browser API |

#### Quality Presets

| Quality | Bitrate | CRF |
|---------|---------|-----|
| High | 25 Mbps | 18 |
| Medium | 10 Mbps | 23 |
| Low | 5 Mbps | 28 |

#### Performance Optimizations
- FFmpeg uses JPEG frames (~5x faster than PNG)
- WASM binaries cached via Cache API across sessions
- Streaming frame processing to prevent memory bloat
- Progress tracking via `useExportProgress` hook

## Data Flow

### Upload Flow

```text
User uploads image
  ↓
File validation
  ↓
Create blob URL
  ↓
Update useImageStore (uploadedImageUrl)
  ↓
EditorStoreSync syncs to useEditorStore (screenshot.src)
  ↓
ClientCanvas renders image on Konva stage
```

### Export Flow

```text
User clicks export
  ↓
useExport hook called
  ↓
Get Konva stage reference
  ↓
exportElement() called with all state
  ↓
1. Export background (html2canvas)
2. Export Konva stage (user image)
3. Export overlays (html2canvas)
4. Composite all layers
5. Add watermark
6. Convert to blob
  ↓
Download file + save to IndexedDB
```

### State Update Flow

```text
User changes control (e.g., border width)
  ↓
Control component calls store setter
  ↓
Zustand store updates
  ↓
Components subscribed to store re-render
  ↓
EditorStoreSync syncs changes to editor store
  ↓
ClientCanvas re-renders with new state
```

## Performance Considerations

### Canvas Rendering
- Konva stage uses `batchDraw()` to minimize redraws
- Pattern and noise textures are cached
- Background images are loaded once and reused

### Export Performance
- Background and overlays exported separately to optimize memory
- High-resolution exports use scaling instead of large canvas dimensions
- Export operations are async to prevent UI blocking

### Image Loading
- Cloudinary images use optimized URLs with auto-format and quality
- Images are cached in browser cache
- IndexedDB provides persistent storage for offline access

## Environment Variables

```bash
# Required for screenshot caching: Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Optional: Screenshot API URL (defaults to free Microlink API)
# Uses https://api.microlink.io by default (no API key required)
SCREENSHOT_API_URL=https://api.microlink.io

# Optional: Analytics
BETTER_AUTH_URL=https://your-domain.com
```

## API Routes

### `/api/screenshot`
- **Method**: POST
- **Purpose**: Capture website screenshots using the Microlink API
- **Body**:
  ```json
  {
    "url": "string (required)",
    "deviceType": "desktop" | "mobile" (optional, defaults to "desktop"),
    "forceRefresh": "boolean" (optional)
  }
  ```
- **Returns**:
  ```json
  {
    "screenshot": "string (base64)",
    "url": "string",
    "cached": "boolean",
    "deviceType": "desktop" | "mobile",
    "strategy": "string"
  }
  ```
- **Technology**: [Microlink API](https://microlink.io) - Free screenshot service (no API key required)
  - Default endpoint: `https://api.microlink.io`
  - Two-step capture: request returns a hosted screenshot URL, which is then fetched for image bytes
  - Supports viewport customization (width/height parameters)
  - Desktop: 1920x1080 viewport
  - Mobile: 375x667 viewport
- **Caching**: Screenshots cached in Cloudinary and database, keyed by URL and device type
- **Rate Limiting**: 20 requests per minute per IP

## Browser Storage

### IndexedDB Stores

1. **`image-blobs`** - Stored uploaded images
   - Key: Unique image ID
   - Value: Blob, type, timestamp

2. **`exports`** - Stored exported images
   - Key: Unique export ID
   - Value: Blob, format, quality, scale, timestamp, fileName

3. **`export-preferences`** - Export settings
   - Key: `'preferences'`
   - Value: format, quality, scale

### LocalStorage

- `canvas-objects` - Canvas object state (for persistence)
- `canvas-background-prefs` - Background preferences

## Dependencies Overview

### Production Dependencies
- **next** (16.0.1) - React framework
- **react** (19.2.0) - UI library
- **konva** (10.0.8) - Canvas library
- **react-konva** (19.2.0) - React bindings for Konva
- **zustand** (5.0.8) - State management
- **html2canvas** (1.4.1) - DOM to canvas
- **modern-screenshot** (4.6.6) - 3D transform capture
- **cloudinary** (2.8.0) - Image optimization
- **radix-ui** - UI primitives
- **tailwindcss** (4) - Styling

### Development Dependencies
- **typescript** (5) - Type checking
- **sharp** (0.34.4) - Image processing
- **tsx** (4.20.6) - TypeScript execution

## Security Considerations

1. **File Upload Validation**: File type and size validation on client and server
2. **CORS**: Images loaded with `crossOrigin: 'anonymous'` for canvas operations
3. **API Keys**: Environment variables for sensitive credentials
4. **XSS Prevention**: React's built-in XSS protection
5. **Content Security**: No eval() or dangerous code execution

## Future Architecture Considerations

### Potential Improvements
1. **Web Workers**: Move heavy export operations to web workers
2. **Service Worker**: Cache assets and enable offline functionality
3. **Virtual Scrolling**: For large overlay galleries
4. **Collaboration**: Real-time collaboration with WebSockets
5. **Cloud Storage**: Optional cloud storage for designs
6. **Audio Support**: Add audio tracks to video exports
7. **Custom Easing Curves**: Bezier curve editor for animation easing

## Testing Strategy

### Unit Tests
- Store logic (Zustand stores)
- Utility functions (export, image processing)
- Component logic (hooks)

### Integration Tests
- Export pipeline
- Store synchronization
- Image upload flow

### E2E Tests
- Complete user workflows
- Export functionality
- Cross-browser compatibility

## Deployment

### Vercel Configuration
- Serverless functions for API routes
- Edge functions for static assets
- Environment variables configured in Vercel dashboard

### Build Process

```bash
npm run build  # Next.js production build
```

### Runtime Configuration
- `vercel.json` configures function timeouts and memory
- Screenshot API route has 60s timeout (maxDuration) for external API calls

## Monitoring & Analytics

- **Umami Analytics**: Privacy-focused analytics integration
- **Error Tracking**: Error boundaries catch React errors
- **Performance**: Next.js built-in performance monitoring

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed contribution guidelines.

