import type { Metadata } from "next";
import { EditorLayout } from "@/components/editor/EditorLayout";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AgentSummary } from "@/components/seo/AgentSummary";
import { OG_DEFAULTS } from "@/lib/seo/metadata";

export const metadata: Metadata = {
  title: "Free Screenshot Editor & Mockup Maker",
  description:
    "Free online screenshot editor and mockup maker. Add gradient backgrounds, Safari and Chrome browser mockups, shadows, 3D effects, and animations. No signup.",
  keywords: [
    "screenshot editor online free",
    "free screenshot editor",
    "online image editor",
    "screenshot beautifier online",
    "screenshot mockup tool",
    "pika style alternative",
    "shots.so alternative",
    "browser mockup generator",
    "safari browser mockup",
    "chrome browser mockup",
    "browser frame screenshot",
    "screenshot wrapper tool",
    "add background to screenshot free",
    "tweet to screenshot",
    "code snippet screenshot",
    "code to image generator",
    "mockup screenshot",
    "mockup online",
    "mockup screen",
    "mockups ui",
    "mockup ui ux",
    "app mockup generator",
    "ui mockup generator",
    "shots app alternative",
    "shots net alternative",
    "moqups alternative",
    "previewed app alternative",
    "appshots alternative",
    "goodmockups alternative",
    "mockup me alternative",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    ...OG_DEFAULTS,
    title: "Screenshot Studio - Free Screenshot Editor & Mockup Maker",
    description:
      "Free screenshot editor online: add backgrounds, shadows, 3D effects, and animations. Export as PNG, JPG, or video.",
    url: "/",
  },
};

export default async function EditorPage() {
  return (
    <>
      <AgentSummary />
      <ErrorBoundary>
        <EditorLayout />
      </ErrorBoundary>
    </>
  );
}
