/**
 * Root-level JSON-LD structured data for the entire site.
 * Added to the root layout so every page inherits Organization and WebSite schema.
 */

const BASE_URL = "https://www.screenshot-studio.com";

export function getOrganizationSchema() {
  return {
    "@type": "Organization",
    "@id": `${BASE_URL}/#organization`,
    name: "Screenshot Studio",
    url: BASE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${BASE_URL}/icon-512.png`,
      width: 512,
      height: 512,
    },
    sameAs: [
      "https://github.com/opennookorg/screenshot-studio",
      "https://x.com/screenshotstdio",
    ],
    email: "kartik.labhshetwar@gmail.com",
    address: {
      "@type": "PostalAddress",
      addressCountry: "IN",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: "kartik.labhshetwar@gmail.com",
        url: `${BASE_URL}/contact`,
        availableLanguage: [
          "English",
          "Spanish",
          "French",
          "German",
          "Japanese",
          "Portuguese",
          "Korean",
          "Chinese",
        ],
      },
      {
        "@type": "ContactPoint",
        contactType: "technical support",
        url: "https://github.com/opennookorg/screenshot-studio/issues",
        email: "kartik.labhshetwar@gmail.com",
      },
    ],
    description:
      "Free, open-source screenshot editor with backgrounds, browser mockups, 3D effects, animations, and video export.",
  };
}

export function getWebSiteSchema() {
  return {
    "@type": "WebSite",
    "@id": `${BASE_URL}/#website`,
    url: BASE_URL,
    name: "Screenshot Studio",
    publisher: {
      "@id": `${BASE_URL}/#organization`,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BASE_URL}/features?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function getSoftwareApplicationSchema() {
  return {
    "@type": "SoftwareApplication",
    "@id": `${BASE_URL}/#application`,
    name: "Screenshot Studio",
    url: BASE_URL,
    applicationCategory: "DesignApplication",
    applicationSubCategory: "Screenshot Editor",
    operatingSystem: "Any (Web Browser)",
    softwareHelp: {
      "@type": "CreativeWork",
      name: "Screenshot Studio API Documentation",
      url: `${BASE_URL}/docs`,
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "150",
      bestRating: "5",
    },
    featureList: [
      "100+ gradient backgrounds",
      "Safari and Chrome browser mockups (light & dark)",
      "Device frames (Arc, Polaroid, glass, outline, border)",
      "3D perspective transforms",
      "20+ animation presets with keyframe editor",
      "Video export (MP4, WebM, GIF)",
      "Text and image overlays",
      "High-res export up to 5x scale",
      "No signup required",
      "No watermarks",
      "Open source (Apache 2.0)",
    ],
  };
}

export function getRootJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      getOrganizationSchema(),
      getWebSiteSchema(),
      getSoftwareApplicationSchema(),
    ],
  };
}
