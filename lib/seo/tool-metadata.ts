/**
 * Metadata and structured data for the image tool pages.
 *
 * Every tool route builds its Metadata and its JSON-LD from the same
 * ToolDefinition, so the title, description, canonical, and schema can never
 * drift apart.
 */

import type { Metadata } from "next";
import { OG_DEFAULTS, SITE_URL } from "./metadata";
import { TOOLS_HUB_PATH, getRelatedTools, type ToolDefinition } from "./tools";

export function buildToolMetadata(tool: ToolDefinition): Metadata {
  return {
    title: tool.title,
    description: tool.description,
    keywords: tool.keywords,
    openGraph: {
      ...OG_DEFAULTS,
      title: tool.title,
      description: tool.description,
      url: tool.slug,
    },
    alternates: {
      canonical: tool.slug,
    },
  };
}

/**
 * SoftwareApplication + FAQPage + BreadcrumbList for one tool.
 *
 * The FAQ entries are the same ones rendered on the page, which is what makes
 * them eligible for rich results rather than a mismatch penalty.
 */
export function buildToolJsonLd(tool: ToolDefinition) {
  const url = `${SITE_URL}${tool.slug}`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "@id": `${url}#application`,
        name: `Screenshot Studio: ${tool.name}`,
        url,
        applicationCategory: "MultimediaApplication",
        applicationSubCategory: "Image Editor",
        operatingSystem: "Any (Web Browser)",
        description: tool.description,
        isAccessibleForFree: true,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        featureList: tool.features,
        publisher: {
          "@id": `${SITE_URL}/#organization`,
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: tool.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumbs`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: SITE_URL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Image Tools",
            item: `${SITE_URL}${TOOLS_HUB_PATH}`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: tool.name,
            item: url,
          },
        ],
      },
    ],
  };
}

/** ItemList schema for the /tools hub, so the suite is legible as a set. */
export function buildToolsHubJsonLd(tools: ToolDefinition[]) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${SITE_URL}${TOOLS_HUB_PATH}#page`,
        url: `${SITE_URL}${TOOLS_HUB_PATH}`,
        name: "Free Online Image Tools",
        description:
          "Compress, convert, resize, crop, and rotate images in your browser. Free, no signup, nothing uploaded.",
        isPartOf: { "@id": `${SITE_URL}/#website` },
      },
      {
        "@type": "ItemList",
        "@id": `${SITE_URL}${TOOLS_HUB_PATH}#tools`,
        itemListElement: tools.map((tool, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: tool.name,
          url: `${SITE_URL}${tool.slug}`,
        })),
      },
    ],
  };
}

export { getRelatedTools };
