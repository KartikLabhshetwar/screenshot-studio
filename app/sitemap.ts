import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/metadata";
import { getAllComparisonSlugs } from "@/lib/seo/comparisons";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_URL;
  const now = new Date();

  const comparisonSlugs = getAllComparisonSlugs();

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

    // Developer pages
    { path: "/docs", changeFrequency: "monthly", priority: 0.8 },
    {
      path: "/docs/authentication",
      changeFrequency: "monthly",
      priority: 0.7,
    },
    { path: "/developers", changeFrequency: "monthly", priority: 0.8 },

    // Company pages
    { path: "/about", changeFrequency: "monthly", priority: 0.5 },
    { path: "/contact", changeFrequency: "monthly", priority: 0.5 },
    { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.3 },
    { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const page of staticPages) {
    entries.push({
      url: `${baseUrl}${page.path}`,
      lastModified: now,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    });
  }

  for (const slug of comparisonSlugs) {
    entries.push({
      url: `${baseUrl}/compare/${slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  return entries;
}
