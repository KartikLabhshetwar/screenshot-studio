import type { Metadata } from "next";
import { EditorLayout } from "@/components/editor/EditorLayout";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export const metadata: Metadata = {
  title: "Image Editor - Screenshot Studio",
  description:
    "Free browser-based image editor. Add backgrounds, shadows, 3D effects, and animations to your screenshots. Export as PNG, JPG, or video.",
  alternates: {
    canonical: "/home",
  },
  openGraph: {
    title: "Image Editor - Screenshot Studio",
    description:
      "Free browser-based image editor with backgrounds, shadows, 3D effects, and animations.",
    url: "/home",
  },
};

/**
 * Editor Page - Public Access
 *
 * This page is now publicly accessible without authentication.
 */
export default async function EditorPage() {
  return (
    <ErrorBoundary>
      <EditorLayout />
    </ErrorBoundary>
  );
}
