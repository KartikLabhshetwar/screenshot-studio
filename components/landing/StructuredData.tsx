export function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": "https://www.screenshot-studio.com/#application",
        name: "Screenshot Studio",
        alternateName: "Free Screenshot Editor Online",
        description:
          "Free screenshot editor online — transform plain screenshots into professional graphics with 100+ backgrounds, animations, 3D effects, and video export. No signup required.",
        url: "https://www.screenshot-studio.com",
        applicationCategory: "DesignApplication",
        applicationSubCategory: "Screenshot Editor",
        operatingSystem: "Any (Web Browser)",
        browserRequirements: "Requires JavaScript. Works in Chrome, Firefox, Safari, Edge.",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        featureList: [
          "Screenshot beautification",
          "Custom backgrounds",
          "Text overlays",
          "3D perspective transforms",
          "Timeline animation editor",
          "20+ animation presets",
          "Video export (MP4, WebM, GIF)",
          "High-resolution image export",
          "Tweet to screenshot",
          "Code snippet generator",
          "Annotation tools",
          "No signup required",
          "Browser-based editing",
        ],
      },
      {
        "@type": "Organization",
        "@id": "https://www.screenshot-studio.com/#organization",
        name: "Screenshot Studio",
        url: "https://www.screenshot-studio.com",
        logo: {
          "@type": "ImageObject",
          url: "https://www.screenshot-studio.com/icon-512.png",
          width: 512,
          height: 512,
        },
        sameAs: [
          "https://github.com/KartikLabhshetwar/screenshot-studio",
          "https://x.com/screenshotstdio",
        ],
      },
      {
        "@type": "WebSite",
        "@id": "https://www.screenshot-studio.com/#website",
        url: "https://www.screenshot-studio.com",
        name: "Screenshot Studio",
        description:
          "Screenshot Studio is a free, browser-based screenshot editor that transforms plain screenshots into professional graphics with 100+ backgrounds, browser mockups, 3D effects, animations, and video export. No signup required.",
        publisher: {
          "@id": "https://www.screenshot-studio.com/#organization",
        },
      },
      {
        "@type": "FAQPage",
        "@id": "https://www.screenshot-studio.com/#faq",
        mainEntity: [
          {
            "@type": "Question",
            name: "What is Screenshot Studio?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Screenshot Studio is a free, browser-based screenshot editor that transforms plain screenshots into professional-quality graphics. It offers 100+ gradient backgrounds, Safari and Chrome browser mockups, 3D perspective effects, animation timelines with 20+ presets, and video export in MP4, WebM, and GIF formats. Built as an open-source alternative to paid tools like Pika Style and Shots.so, it requires no signup, no downloads, and adds no watermarks.",
            },
          },
          {
            "@type": "Question",
            name: "Is Screenshot Studio free to use?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes, Screenshot Studio is 100% free with no hidden costs or premium tiers. You get unlimited exports, full feature access, and no watermarks on your images.",
            },
          },
          {
            "@type": "Question",
            name: "Do I need to create an account?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No account required. Screenshot Studio works entirely in your browser with zero signup. Simply open the editor and start designing immediately.",
            },
          },
          {
            "@type": "Question",
            name: "What export formats does Screenshot Studio support?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Export images as PNG (with transparency) or JPG at up to 5x resolution. For animations, export as MP4, WebM, or GIF with quality presets ranging from 5 to 25 Mbps.",
            },
          },
          {
            "@type": "Question",
            name: "Can I create animations and videos?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. Screenshot Studio includes a timeline editor with 20+ animation presets including zoom, pan, rotate, and 3D perspective effects. You can add keyframes, preview in real-time, and export as MP4, WebM, or GIF.",
            },
          },
          {
            "@type": "Question",
            name: "Is there a free screenshot editor I can use online?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes, Screenshot Studio is a completely free screenshot editor online. It runs entirely in your browser — no downloads, no installation, no signup. Just open the editor and start beautifying your screenshots with backgrounds, shadows, 3D effects, and more.",
            },
          },
          {
            "@type": "Question",
            name: "What makes Screenshot Studio different from other screenshot editors?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Screenshot Studio is purpose-built for making screenshots look professional. Unlike generic image editors, it offers one-click design presets, 100+ gradient backgrounds, 3D perspective transforms, animation timeline with 20+ presets, and video export — all free with no watermarks or account required.",
            },
          },
          {
            "@type": "Question",
            name: "Can I create tweet screenshots or code snippet images?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. Paste any tweet URL to capture it as a high-resolution screenshot with light or dark theme support. The code snippet generator supports 20+ syntax themes, 20 programming languages, and 10 monospace fonts — ideal for sharing beautiful code on social media.",
            },
          },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
