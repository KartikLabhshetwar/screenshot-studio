export function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": "https://screenshot-studio.com/#application",
        name: "Screenshot Studio",
        description:
          "Free browser-based image editor for creating professional graphics. Transform screenshots into stunning social media images with backgrounds, text overlays, and one-click export.",
        url: "https://screenshot-studio.com",
        applicationCategory: "DesignApplication",
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
          "High-resolution export",
          "No signup required",
          "Browser-based editing",
        ],
      },
      {
        "@type": "Organization",
        "@id": "https://screenshot-studio.com/#organization",
        name: "Screenshot Studio",
        url: "https://screenshot-studio.com",
        logo: {
          "@type": "ImageObject",
          url: "https://screenshot-studio.com/logo.svg",
          width: 512,
          height: 512,
        },
        sameAs: [
          "https://github.com/KartikLabhshetwar/stage",
          "https://x.com/code_kartik",
        ],
      },
      {
        "@type": "WebSite",
        "@id": "https://screenshot-studio.com/#website",
        url: "https://screenshot-studio.com",
        name: "Screenshot Studio - Free Online Image Editor",
        description:
          "Turn screenshots into stunning social media graphics in seconds. Free, no signup required.",
        publisher: {
          "@id": "https://screenshot-studio.com/#organization",
        },
      },
      {
        "@type": "FAQPage",
        "@id": "https://screenshot-studio.com/#faq",
        mainEntity: [
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
              text: "Export your designs as PNG (with full transparency support) or JPG. Choose from quality presets or scale your export up to 5x the original size for high-resolution output.",
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
