"use client";

import * as React from "react";
import { SectionWrapper } from "./SectionWrapper";
import { cn } from "@/lib/utils";
import { useImageStore } from "@/lib/store";

interface DesignTheme {
  id: string;
  name: string;
  description: string;
  preview: string;
  apply: () => void;
}

export function ScreenshotDesignSection() {
  const themes: DesignTheme[] = [
    {
      id: "glass",
      name: "Glass",
      description: "Frosted glass with blur",
      preview: "bg-white/10 backdrop-blur-xl",
      apply: () => {
        const store = useImageStore.getState();
        store.setImageBorder({ enabled: true, type: "glass-light", width: 1, padding: 1, opacity: 0.25 });
        store.setImageShadow({ enabled: true, blur: 30, offsetX: 0, offsetY: 12, spread: 5, color: "rgba(0,0,0,0.6)", opacity: 0.4 });
        store.setBorderRadius(16);
        store.setImageStylePreset("glass-light");
      },
    },
    {
      id: "neon",
      name: "Neon",
      description: "Vibrant glow with neon border",
      preview: "bg-gradient-to-br from-fuchsia-500/20 to-cyan-500/20",
      apply: () => {
        const store = useImageStore.getState();
        store.setImageBorder({ enabled: true, type: "border-light", width: 3, color: "#c084fc", padding: 2 });
        store.setImageShadow({ enabled: true, blur: 40, offsetX: 0, offsetY: 8, spread: 10, color: "rgba(192,132,252,0.4)", opacity: 0.8 });
        store.setBorderRadius(12);
        store.setBackgroundConfig({ type: "gradient", value: "vibrant_fuchsia_cyan", opacity: 1 });
      },
    },
    {
      id: "minimal",
      name: "Minimal",
      description: "Clean, thin border with soft shadow",
      preview: "bg-white/5 border border-white/10",
      apply: () => {
        const store = useImageStore.getState();
        store.setImageBorder({ enabled: true, type: "outline-light", width: 1, color: "#ffffff", padding: 0.5, opacity: 0.35 });
        store.setImageShadow({ enabled: true, blur: 20, offsetX: 0, offsetY: 6, spread: 2, color: "rgba(0,0,0,0.4)", opacity: 0.3 });
        store.setBorderRadius(8);
        store.setImageStylePreset("outline");
      },
    },
    {
      id: "vintage",
      name: "Vintage",
      description: "Warm tones with sepia and photograph frame",
      preview: "bg-amber-900/20 sepia",
      apply: () => {
        const store = useImageStore.getState();
        store.setImageBorder({ enabled: true, type: "photograph", width: 12, color: "#ffffff", padding: 3 });
        store.setImageShadow({ enabled: true, blur: 25, offsetX: 3, offsetY: 8, spread: 4, color: "rgba(0,0,0,0.5)", opacity: 0.45 });
        store.setBorderRadius(4);
        store.setImageFilter("sepia", 40);
        store.setImageFilter("saturate", 80);
        store.setBackgroundConfig({ type: "solid", value: "#faf6f0", opacity: 1 });
      },
    },
    {
      id: "dark-elegant",
      name: "Dark Elegant",
      description: "Dark mode with subtle glow",
      preview: "bg-zinc-900 border border-zinc-700",
      apply: () => {
        const store = useImageStore.getState();
        store.setImageBorder({ enabled: true, type: "border-dark", width: 2, color: "#3f3f46", padding: 1.5 });
        store.setImageShadow({ enabled: true, blur: 50, offsetX: 0, offsetY: 16, spread: 8, color: "rgba(0,0,0,0.8)", opacity: 0.6 });
        store.setBorderRadius(10);
        store.setImageStylePreset("border-dark");
        store.setBackgroundConfig({ type: "solid", value: "#18181b", opacity: 1 });
      },
    },
    {
      id: "polaroid",
      name: "Polaroid",
      description: "Classic instant photo with white border",
      preview: "bg-white p-2 shadow-xl",
      apply: () => {
        const store = useImageStore.getState();
        store.setImageBorder({ enabled: true, type: "photograph", width: 20, color: "#ffffff", padding: 4, title: "polaroid moment" });
        store.setImageShadow({ enabled: true, blur: 30, offsetX: 2, offsetY: 10, spread: 4, color: "rgba(0,0,0,0.4)", opacity: 0.5 });
        store.setBorderRadius(2);
        store.setImageFilter("contrast", 110);
        store.setImageFilter("saturate", 105);
      },
    },
  ];

  return (
    <SectionWrapper
      title="Design Themes"
      defaultOpen={false}
      className="space-y-2"
    >
      <div className="grid grid-cols-2 gap-2">
        {themes.map((theme) => (
          <button
            key={theme.id}
            onClick={theme.apply}
            className="group relative overflow-hidden rounded-xl border border-border/30 hover:border-border/60 transition-all duration-200 active:scale-[0.98]"
          >
            <div className="aspect-[4/3] flex items-center justify-center bg-card p-3">
              <div
                className={cn(
                  "w-full h-full rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-105",
                  theme.preview
                )}
              >
                <div className="w-3/4 h-3/4 rounded shadow-sm bg-gradient-to-br from-muted-foreground/20 to-muted-foreground/5" />
              </div>
            </div>
            <div className="px-2.5 py-2 text-left">
              <p className="text-[11px] font-semibold text-foreground">{theme.name}</p>
              <p className="text-[9px] text-muted-foreground truncate">{theme.description}</p>
            </div>
          </button>
        ))}
      </div>
    </SectionWrapper>
  );
}
