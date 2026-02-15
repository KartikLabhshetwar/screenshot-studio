# Screenshot Studio

<img width="3600" height="1890" alt="og" src="https://github.com/user-attachments/assets/59704a08-b6b3-4537-b4b7-0bbadd839e99" />


A free, browser-based editor for creating stunning screenshots and visuals. No signup, no watermarks.

**Live:** [https://screenshot-studio.com](https://screenshot-studio.com)

![Screenshot Studio](https://img.shields.io/badge/Screenshot%20Studio-Canvas%20Editor-blue)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![React](https://img.shields.io/badge/React-19-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

## Features

- **Drag & Drop Upload** - PNG, JPG, WEBP up to 100MB
- **Website Screenshots** - Capture any URL via [Screen-Shot.xyz](https://screen-shot.xyz)
- **50+ Backgrounds** - Gradients, solid colors, images, blur, and noise effects
- **Device Frames** - macOS, Windows, Arc-style, Polaroid borders
- **3D Transforms** - Perspective rotation with realistic depth
- **Shadows & Borders** - Customizable blur, spread, offset, and color
- **Text Overlays** - Multiple layers with custom fonts and shadows
- **Image Overlays** - Arrows, icons, and decorative elements
- **Aspect Ratios** - Instagram, YouTube, Twitter, LinkedIn, Open Graph
- **High-Res Export** - PNG/JPG up to 5x scale, fully in-browser
- **Undo/Redo** - Unlimited history with keyboard shortcuts

## Quick Start

```bash
# Clone and install
git clone https://github.com/KartikLabhshetwar/stage.git
cd stage
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Environment Variables

Create `.env.local` for optional features:

```env
# Cloudflare R2 (for asset storage)
R2_ACCESS_KEY_ID=your-access-key
R2_SECRET_ACCESS_KEY=your-secret-key
R2_BUCKET_NAME=your-bucket
R2_ACCOUNT_ID=your-account-id

# Database (for screenshot caching)
DATABASE_URL="postgresql://user:password@host:port/dbname"

# Screenshot API (optional, defaults to free Screen-Shot.xyz)
SCREENSHOT_API_URL=https://api.screen-shot.xyz
```

> **Note**: Core features work without any configuration. Database and R2 are only needed for website screenshots and asset optimization.

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | [Next.js 16](https://nextjs.org/) with App Router |
| UI | [React 19](https://react.dev/) with React Compiler |
| Language | [TypeScript 5](https://www.typescriptlang.org/) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com/) |
| Components | [Radix UI](https://www.radix-ui.com/) |
| State | [Zustand](https://github.com/pmndrs/zustand) + [Zundo](https://github.com/charkour/zundo) (undo/redo) |
| Animations | [Motion](https://motion.dev/) |
| Data Fetching | [TanStack Query](https://tanstack.com/query) |
| Canvas Export | [modern-screenshot](https://github.com/nichenqin/modern-screenshot) |
| Image Processing | [Sharp](https://sharp.pixelplumbing.com/) |
| Storage | [Cloudflare R2](https://www.cloudflare.com/r2/) |
| Database | [Prisma](https://www.prisma.io/) + PostgreSQL |
| Icons | [Hugeicons](https://hugeicons.com/) |

## Project Structure

```
screenshot-studio/
├── app/                 # Next.js pages and API routes
├── components/
│   ├── canvas/         # Canvas rendering (HTML/CSS based)
│   ├── editor/         # Editor panels and controls
│   ├── landing/        # Landing page components
│   └── ui/             # Shared UI components
├── lib/
│   ├── store/          # Zustand state management
│   ├── export/         # Export pipeline
│   └── constants/      # Backgrounds, presets, fonts
├── hooks/              # Custom React hooks
└── types/              # TypeScript definitions
```

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed documentation.

## Scripts

```bash
npm run dev        # Development server
npm run build      # Production build
npm start          # Production server
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## Contributors

<a href="https://github.com/KartikLabhshetwar/stage/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=KartikLabhshetwar/stage" />
</a>

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=KartikLabhshetwar/stage&type=Date)](https://star-history.com/#KartikLabhshetwar/stage&Date)

## License

[Apache License 2.0](./LICENSE)

## Support

- [GitHub Issues](https://github.com/KartikLabhshetwar/stage/issues)
- [GitHub Discussions](https://github.com/KartikLabhshetwar/stage/discussions)
