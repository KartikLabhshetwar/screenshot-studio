import type { Metadata } from "next";

export const SITE_URL = "https://www.screenshot-studio.com";

export const OG_IMAGE = {
  url: `${SITE_URL}/og.jpg`,
  width: 1200,
  height: 630,
  alt: "Screenshot Studio - Transform Screenshots into Professional Graphics",
};

export const OG_DEFAULTS = {
  type: "website",
  locale: "en_US",
  siteName: "Screenshot Studio",
  images: [OG_IMAGE],
} satisfies Metadata["openGraph"];
