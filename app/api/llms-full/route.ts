const BASE_URL = "https://screenshot-studio.com";

const content = `# Screenshot Studio - Complete Reference

> Free, open-source browser-based screenshot editor. Transform plain screenshots into professional graphics with backgrounds, browser mockups, 3D effects, animations, and video export. No signup, no watermarks.

## What is Screenshot Studio?

Screenshot Studio is a free, browser-based screenshot editor that transforms plain screenshots into professional-quality graphics. It runs entirely in the browser — your images are never uploaded to any server. It is open source and available at https://github.com/KartikLabhshetwar/stage.

Built as a free alternative to paid tools like Pika Style, Shots.so, and CleanShot X, Screenshot Studio is used by developers, marketers, and designers to create polished images for social media, landing pages, documentation, and presentations.

## Complete Feature List

### Backgrounds
- 100+ gradient backgrounds (linear, radial, mesh, conic)
- Solid color backgrounds with custom color picker
- Paper texture backgrounds
- Pattern backgrounds
- Custom image backgrounds
- Transparent background support

### Browser Mockups
- Safari browser frame (light and dark mode)
- Chrome browser frame (light and dark mode)
- Arc browser frame
- Minimal window frame
- Custom URL bar text

### Device Frames
- macOS window chrome
- Polaroid-style frame
- Glass morphism frame
- Outline frame
- Border frame with customizable radius

### 3D Effects
- Perspective transforms (X, Y, Z rotation)
- Tilt effects
- Depth-of-field simulation
- Custom shadow with blur, spread, offset, and color

### Image Editing
- Resize and scale
- Opacity control
- Border radius (0 to fully rounded)
- Padding and inset controls
- Shadow with full customization
- Position and alignment

### Text Overlays
- Multiple text layers
- 27+ Google Fonts (Geist, Inter, Poppins, Space Grotesk, Outfit, Plus Jakarta Sans, DM Sans, Sora, Manrope, Raleway, Montserrat, Lexend, Work Sans, Urbanist, Albert Sans, Oswald, Bebas Neue, Righteous, Playfair Display, Lora, Libre Baskerville, Caveat, Pacifico, Dancing Script, JetBrains Mono, Fira Code)
- Custom font size, weight, color
- Text shadow and positioning
- Letter spacing and line height

### Animation & Video
- 20+ animation presets (zoom in/out, pan, Ken Burns, tilt, fade, bounce, slide, etc.)
- Keyframe timeline editor
- Multi-slide slideshows
- Video export: MP4, WebM, GIF
- Custom duration and easing per animation
- FFmpeg WASM-based encoding (runs in browser)

### Import
- Drag and drop images
- Paste from clipboard
- Import tweets by URL (renders as image)
- Import code snippets (syntax highlighted)

### Export
- PNG (lossless, up to 5x resolution)
- JPEG (configurable quality)
- WebP (configurable quality)
- MP4 video
- WebM video
- GIF animation
- Copy to clipboard
- Scale: 1x, 2x, 3x, 4x, 5x

### Templates & Presets
- One-click professional styling presets
- Aspect ratio presets: Auto, 1:1, 4:3, 16:9, 9:16, 4:5, 2:3, 3:2, 21:9
- Social platform presets (Twitter, Instagram, LinkedIn, etc.)

## All Pages

### Core
| Page | URL | Description |
|------|-----|-------------|
| Editor | ${BASE_URL}/ | Main canvas editor for creating designs |
| Landing | ${BASE_URL}/landing | Product landing page with overview |
| Free Screenshot Editor | ${BASE_URL}/free-screenshot-editor | SEO landing page for free editor |

### Features
| Page | URL | Description |
|------|-----|-------------|
| Features Hub | ${BASE_URL}/features | All features overview |
| Screenshot Beautifier | ${BASE_URL}/features/screenshot-beautifier | Background and styling features |
| Social Media Graphics | ${BASE_URL}/features/social-media-graphics | Social platform image creation |
| Animation Maker | ${BASE_URL}/features/animation-maker | Animation timeline and video export |
| 3D Effects | ${BASE_URL}/features/3d-effects | Perspective and depth effects |
| Browser Mockups | ${BASE_URL}/features/browser-mockups | Safari, Chrome, Arc frames |

### Audience Pages
| Page | URL | Description |
|------|-----|-------------|
| For Developers | ${BASE_URL}/for/developers | Developer-focused use cases |
| For Marketers | ${BASE_URL}/for/marketers | Marketing-focused use cases |
| For Designers | ${BASE_URL}/for/designers | Design-focused use cases |

### Comparison Pages
| Page | URL | Description |
|------|-----|-------------|
| vs Pika Style | ${BASE_URL}/compare/pika-style | Feature comparison with Pika Style |
| vs Shots.so | ${BASE_URL}/compare/shots-so | Feature comparison with Shots.so |
| vs Snagit | ${BASE_URL}/compare/snagit | Feature comparison with Snagit |

### Company
| Page | URL | Description |
|------|-----|-------------|
| About | ${BASE_URL}/about | About the project and team |
| Contact | ${BASE_URL}/contact | Ways to reach us |
| Privacy Policy | ${BASE_URL}/privacy-policy | How we handle data |
| Terms & Conditions | ${BASE_URL}/terms | Usage terms |
| Changelog | ${BASE_URL}/changelog | Release notes and updates |

## Internationalization

Screenshot Studio is available in 8 languages with subpath routing:

| Language | Prefix | Example |
|----------|--------|---------|
| English (default) | / | ${BASE_URL}/about |
| Spanish | /es | ${BASE_URL}/es/about |
| French | /fr | ${BASE_URL}/fr/about |
| German | /de | ${BASE_URL}/de/about |
| Japanese | /ja | ${BASE_URL}/ja/about |
| Portuguese | /pt | ${BASE_URL}/pt/about |
| Korean | /ko | ${BASE_URL}/ko/about |
| Chinese | /zh | ${BASE_URL}/zh/about |

Locale detection: URL path > cookie > Accept-Language header > default (English).

## Technology Stack

- **Framework**: Next.js 16 with App Router
- **UI**: React 19, Tailwind CSS, Radix UI primitives
- **State**: Zustand with temporal (undo/redo)
- **Canvas**: HTML Canvas with modern-screenshot for rendering
- **Video**: FFmpeg WASM for browser-based encoding
- **Assets**: Cloudflare R2
- **i18n**: next-intl with 8 locales
- **TypeScript**: Full type safety throughout

## Pricing

100% free forever. No signup required, no watermarks, no premium tier, no hidden costs. Every feature is available to every user with unlimited exports.

## Privacy

All image processing happens in the browser. No images are uploaded to any server. The only data collected is basic analytics (page views, feature usage) via privacy-respecting analytics. No cookies for advertising or tracking.

## Use Cases

1. **Social Media Graphics**: Create eye-catching images for Twitter/X, Instagram, LinkedIn, and Product Hunt launches
2. **SaaS Screenshots**: Beautify product screenshots for landing pages, documentation, and app stores
3. **Developer Portfolios**: Showcase projects with professional-looking screenshots
4. **Marketing Materials**: Create graphics for presentations, pitch decks, and ads
5. **Documentation**: Add polished screenshots to docs and READMEs
6. **Animated Content**: Create animated slideshows and export as video

## Contact & Links

- **Website**: ${BASE_URL}
- **GitHub**: https://github.com/KartikLabhshetwar/stage
- **Twitter/X**: https://x.com/code_kartik
- **Email**: kartik.labhshetwar@gmail.com
- **Bug Reports**: https://github.com/KartikLabhshetwar/stage/issues
- **Feature Requests**: https://github.com/KartikLabhshetwar/stage/issues/new?labels=enhancement
`;

export async function GET() {
  return new Response(content.trim(), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
