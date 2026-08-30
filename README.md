<a href="https://vercel.com/oss"><img alt="Vercel OSS Program" src="https://vercel.com/oss/program-badge.svg" /></a>
<a href="https://peerlist.io/code_kartik/project/screenshot-studio"><img alt="Peerlist Project Spotlight, Rank 1" src="https://dqy38fnwh4fqs.cloudfront.net/website/project-spotlight/project-week-rank-one-dark.svg" height="40" /></a>

# Screenshot Studio

Free, open-source screenshot editor and mockup maker that runs in the browser. No signup, no watermarks.

**Live:** [screenshot-studio.com](https://www.screenshot-studio.com) · **Code to image:** [screenshot-studio.com/code](https://www.screenshot-studio.com/code)

## Features

- 100+ backgrounds: gradients, mesh, images, blur, noise
- Browser mockups: Safari, Chrome, Arc, macOS window, Polaroid, glass frames
- 3D perspective transforms with configurable shadows
- Annotations: arrows, shapes, blur regions, text and image overlays
- Code to image with 32 syntax themes; tweet to image
- Animation timeline with 20+ presets and keyframe control
- Export PNG, JPEG, WebP up to 5x, and MP4, WebM, GIF encoded in the browser

## Quick Start

```bash
git clone https://github.com/opennookorg/screenshot-studio.git
cd screenshot-studio
npm install
npm run dev
```

Open [localhost:3000](http://localhost:3000). Core features need no environment variables; see `.env.example` for optional R2, database, and analytics config.

## Tech Stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · Zustand · Radix UI · Motion · FFmpeg WASM · WebCodecs · Prisma

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

[Apache License 2.0](./LICENSE)
