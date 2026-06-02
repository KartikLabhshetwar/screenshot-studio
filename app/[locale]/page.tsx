import type { Metadata } from "next";
import { EditorLayout } from "@/components/editor/EditorLayout";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export const metadata: Metadata = {
  title: "Screenshot Studio - Free Screenshot Editor & Mockup Maker",
  description:
    "Free screenshot editor and mockup maker online — add gradient backgrounds, Safari and Chrome browser mockups, shadows, 3D effects, and animations to your screenshots. Import tweets and generate code snippets as images. Better free alternative to Pika Style and Shots.so. Export as PNG, JPG, or video. No signup needed.",
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
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Screenshot Studio - Free Screenshot Editor & Mockup Maker",
    description:
      "Free screenshot editor online — add backgrounds, shadows, 3D effects, and animations. Export as PNG, JPG, or video.",
    url: "/",
  },
};

export default async function EditorPage() {
  return (
    <ErrorBoundary>
      <EditorLayout />
    </ErrorBoundary>
  );
}
