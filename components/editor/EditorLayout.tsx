"use client";

import { useEffect } from "react";
import { CanvasProvider, useCanvasContext } from "@/components/canvas/CanvasContext";
import { CanvasEditor } from "@/components/canvas/CanvasEditor";
import { CanvasToolbar } from "@/components/canvas/CanvasToolbar";
import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";

function EditorContent() {
  const { loadDesign, stage, layer } = useCanvasContext();

  // Load design from sessionStorage if available
  useEffect(() => {
    if (!stage || !layer) return;

    const loadDesignData = sessionStorage.getItem("loadDesign");
    if (loadDesignData) {
      try {
        const design = JSON.parse(loadDesignData);
        if (design.canvasData) {
          loadDesign(design.canvasData).catch((error) => {
            console.error("Failed to load design:", error);
          });
        }
        // Clear the sessionStorage after loading
        sessionStorage.removeItem("loadDesign");
      } catch (error) {
        console.error("Failed to parse design data:", error);
        sessionStorage.removeItem("loadDesign");
      }
    }
  }, [stage, layer, loadDesign]);

  return (
    <div className="min-h-screen flex flex-col relative bg-gray-50">
      <Navigation ctaLabel="Home" ctaHref="/" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="shrink-0 pt-3 pb-2 md:pt-6 md:pb-4">
          <CanvasToolbar />
        </div>
        <div className="flex-1 w-full flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12 xl:p-20">
          <CanvasEditor className="w-full h-full max-w-full max-h-full" />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export function EditorLayout() {
  return (
    <CanvasProvider>
      <EditorContent />
    </CanvasProvider>
  );
}
