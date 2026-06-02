import { MetadataRoute } from "next";
import { locales } from "@/i18n/routing";
import { getAllComparisonSlugs } from "@/lib/seo/comparisons";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.BETTER_AUTH_URL || "https://screenshot-studio.com";
  const now = new Date();

  const comparisonSlugs = getAllComparisonSlugs();

  function buildAlternates(path: string) {
    const languages: Record<string, string> = {};
    for (const locale of locales) {
      if (locale === "en") {
        languages[locale] = `${baseUrl}${path}`;
      } else {
        languages[locale] = `${baseUrl}/${locale}${path}`;
      }
    }
    languages["x-default"] = `${baseUrl}${path}`;
    return { languages };
  }

  const staticPages: {
    path: string;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
    priority: number;
  }[] = [
    // Core pages
    { path: "/", changeFrequency: "weekly", priority: 1.0 },
    { path: "/landing", changeFrequency: "weekly", priority: 0.9 },
    {
      path: "/free-screenshot-editor",
      changeFrequency: "weekly",
      priority: 0.9,
    },

    // Features
    { path: "/features", changeFrequency: "monthly", priority: 0.8 },
    {
      path: "/features/screenshot-beautifier",
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      path: "/features/social-media-graphics",
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      path: "/features/animation-maker",
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      path: "/features/3d-effects",
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      path: "/features/browser-mockups",
      changeFrequency: "monthly",
      priority: 0.8,
    },

    // Persona pages
    { path: "/for/developers", changeFrequency: "monthly", priority: 0.7 },
    { path: "/for/marketers", changeFrequency: "monthly", priority: 0.7 },
    { path: "/for/designers", changeFrequency: "monthly", priority: 0.7 },

    // Changelog
    { path: "/changelog", changeFrequency: "weekly", priority: 0.6 },

    // Company pages
    { path: "/about", changeFrequency: "monthly", priority: 0.5 },
    { path: "/contact", changeFrequency: "monthly", priority: 0.5 },
    { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.3 },
    { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
  ];

  const entries: MetadataRoute.Sitemap = [];

  // Static pages — default locale (en) URLs + alternates for all locales
  for (const page of staticPages) {
    entries.push({
      url: `${baseUrl}${page.path}`,
      lastModified: now,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
      alternates: buildAlternates(page.path),
    });
  }

  // Non-default locale versions of static pages
  for (const locale of locales) {
    if (locale === "en") continue;
    for (const page of staticPages) {
      entries.push({
        url: `${baseUrl}/${locale}${page.path}`,
        lastModified: now,
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        alternates: buildAlternates(page.path),
      });
    }
  }

  // Comparison pages (dynamic, same pattern)
  for (const slug of comparisonSlugs) {
    const path = `/compare/${slug}`;
    entries.push({
      url: `${baseUrl}${path}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: buildAlternates(path),
    });

    for (const locale of locales) {
      if (locale === "en") continue;
      entries.push({
        url: `${baseUrl}/${locale}${path}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.8,
        alternates: buildAlternates(path),
      });
    }
  }

  return entries;
}
