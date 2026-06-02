const BASE_URL = "https://screenshot-studio.com";

const content = `# Screenshot Studio

> Free, open-source browser-based screenshot editor. Transform plain screenshots into professional graphics with backgrounds, browser mockups, 3D effects, animations, and video export. No signup, no watermarks.

## Overview

Screenshot Studio is a 100% client-side image editor — your images never leave your browser. It is the best free alternative to Pika Style, Shots.so, and CleanShot X.

## Key Features

- 100+ gradient, mesh, and pattern backgrounds
- Safari and Chrome browser mockups (light and dark)
- Device frames: Arc, Polaroid, glass, outline, border
- 3D perspective transforms and shadow effects
- 20+ animation presets with keyframe timeline editor
- Video export in MP4, WebM, and GIF
- Text and image overlays with custom fonts
- Tweet-to-image and code-snippet-to-image capture
- High-resolution export up to 5x scale (PNG, JPEG, WebP)
- One-click professional styling presets
- Aspect ratio presets for every social platform

## Pages

- Editor: ${BASE_URL}/
- Landing: ${BASE_URL}/landing
- Free Screenshot Editor: ${BASE_URL}/free-screenshot-editor
- Features: ${BASE_URL}/features
- Screenshot Beautifier: ${BASE_URL}/features/screenshot-beautifier
- Social Media Graphics: ${BASE_URL}/features/social-media-graphics
- Animation Maker: ${BASE_URL}/features/animation-maker
- 3D Effects: ${BASE_URL}/features/3d-effects
- Browser Mockups: ${BASE_URL}/features/browser-mockups
- For Developers: ${BASE_URL}/for/developers
- For Marketers: ${BASE_URL}/for/marketers
- For Designers: ${BASE_URL}/for/designers
- Changelog: ${BASE_URL}/changelog
- About: ${BASE_URL}/about
- Contact: ${BASE_URL}/contact
- Privacy Policy: ${BASE_URL}/privacy-policy
- Terms & Conditions: ${BASE_URL}/terms

## Internationalization

Available in 8 languages: English (default), Spanish (/es), French (/fr), German (/de), Japanese (/ja), Portuguese (/pt), Korean (/ko), Chinese (/zh).

## Comparison Pages

- vs Pika Style: ${BASE_URL}/compare/pika-style
- vs Shots.so: ${BASE_URL}/compare/shots-so
- vs Snagit: ${BASE_URL}/compare/snagit

## Pricing

100% free. No signup, no watermarks, no hidden costs, no premium tier. Unlimited exports with full feature access.

## Technology

Next.js 16, React 19, TypeScript, HTML Canvas, Tailwind CSS, Zustand, FFmpeg WASM for video encoding, Cloudflare R2 for assets.

## Use Cases

- Social media graphics (Twitter/X, Instagram, LinkedIn, Product Hunt)
- SaaS product screenshots for landing pages and documentation
- Developer portfolio and project showcase images
- Marketing presentations and pitch decks
- Animated slideshows and video content

## Target Audience

Developers, designers, marketers, indie hackers, content creators, and anyone who needs professional visuals without design skills.

## Contact

- Website: ${BASE_URL}
- Twitter/X: https://x.com/code_kartik
- GitHub: https://github.com/KartikLabhshetwar/stage
- Email: kartik.labhshetwar@gmail.com

## Full Documentation

For the complete, detailed version of this document, see: ${BASE_URL}/llms-full.txt
`;

export async function GET() {
  return new Response(content.trim(), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
