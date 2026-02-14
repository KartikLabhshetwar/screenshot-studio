export function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": "https://stagee.art/#application",
        name: "Stage",
        description:
          "Free browser-based image editor for creating professional graphics. Transform screenshots into stunning social media images with backgrounds, text overlays, and one-click export.",
        url: "https://stagee.art",
        applicationCategory: "DesignApplication",
        operatingSystem: "Any (Web Browser)",
        browserRequirements: "Requires JavaScript. Works in Chrome, Firefox, Safari, Edge.",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.9",
          ratingCount: "50",
          bestRating: "5",
          worstRating: "1",
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
        "@id": "https://stagee.art/#organization",
        name: "Stage",
        url: "https://stagee.art",
        logo: {
          "@type": "ImageObject",
          url: "https://stagee.art/logo.png",
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
        "@id": "https://stagee.art/#website",
        url: "https://stagee.art",
        name: "Stage - Free Online Image Editor",
        description:
          "Turn screenshots into stunning social media graphics in seconds. Free, no signup required.",
        publisher: {
          "@id": "https://stagee.art/#organization",
        },
      },
      {
        "@type": "FAQPage",
        "@id": "https://stagee.art/#faq",
        mainEntity: [
          {
            "@type": "Question",
            name: "Is Stage free to use?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes, Stage is 100% free with no hidden costs or premium tiers. You get unlimited exports, full feature access, and no watermarks on your images.",
            },
          },
          {
            "@type": "Question",
            name: "Do I need to create an account?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No account required. Stage works entirely in your browser with zero signup. Simply open the editor and start designing immediately.",
            },
          },
          {
            "@type": "Question",
            name: "What export formats does Stage support?",
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
