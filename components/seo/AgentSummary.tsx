const FEATURES = [
  "100+ gradient, mesh, and pattern backgrounds",
  "Safari, Chrome, and Arc browser mockups in light and dark mode",
  "macOS window chrome, Polaroid, glass, outline, and border device frames",
  "3D perspective transforms with fully configurable shadows",
  "20+ animation presets driven by a keyframe timeline editor",
  "Video export to MP4, WebM, and GIF, encoded in the browser with FFmpeg WASM",
  "Text and image overlays with 27+ Google Fonts",
  "Tweet-to-image and code-snippet-to-image capture",
  "High-resolution PNG, JPEG, and WebP export up to 5x scale",
];

const LINKS = [
  { href: "/features", label: "All features" },
  { href: "/free-screenshot-editor", label: "Free screenshot editor" },
  { href: "/docs", label: "API documentation" },
  { href: "/docs/authentication", label: "API authentication and rate limits" },
  { href: "/developers", label: "Developer portal" },
  { href: "/openapi.json", label: "OpenAPI specification" },
  { href: "/llms.txt", label: "llms.txt" },
  { href: "/sitemap.xml", label: "Sitemap" },
  { href: "/about", label: "About Screenshot Studio" },
  { href: "/contact", label: "Contact" },
];

export function AgentSummary() {
  return (
    <section className="sr-only" aria-label="About Screenshot Studio">
      <h1>Screenshot Studio: Free Screenshot Editor and Mockup Maker</h1>
      <p>
        Screenshot Studio is a free, open-source screenshot editor that runs
        entirely in your browser. Drop in a screenshot and turn it into a
        professional graphic: add a gradient background, wrap it in a Safari or
        Chrome browser mockup, tune the padding, corner radius, and shadow,
        tilt it in 3D, then export a PNG, JPEG, WebP, MP4, WebM, or GIF. Editing
        runs on your device and imported images are not uploaded to edit them;
        only export compression sends the finished image to the server, which
        returns it without storing it.
        There is no signup, no watermark, and no paid tier, which makes it a
        free alternative to Pika Style, Shots.so, Screely, and CleanShot X.
      </p>
      <h2>What you can do here</h2>
      <ul>
        {FEATURES.map((feature) => (
          <li key={feature}>{feature}</li>
        ))}
      </ul>
      <h2>Who it is for</h2>
      <p>
        Developers polishing README, changelog, and documentation images;
        marketers building launch graphics and social posts; and designers
        presenting work without leaving the browser. Screenshot Studio is
        available in English, Spanish, French, German, Japanese, Portuguese,
        Korean, and Chinese.
      </p>
      <h2>Documentation and machine-readable resources</h2>
      <ul>
        {LINKS.map((link) => (
          <li key={link.href}>
            <a href={link.href}>{link.label}</a>
          </li>
        ))}
      </ul>
      <p>
        Any page on this site also serves Markdown to clients that send an{" "}
        <code>Accept: text/markdown</code> request header.
      </p>
    </section>
  );
}
