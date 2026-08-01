"use client";

import * as React from "react";
import { useImageStore } from "@/lib/store";
import { toast } from "sonner";

const predefinedPresets = [
  {
    id: "social-instagram",
    name: "Instagram Story",
    apply: () => {
      const store = useImageStore.getState();
      store.setAspectRatio("9_16");
      store.setImageBorder({ enabled: true, type: "border-light", width: 2, color: "#ffffff", padding: 2 });
      store.setImageShadow({ enabled: true, blur: 25, offsetX: 0, offsetY: 10, spread: 4, color: "rgba(0,0,0,0.5)", opacity: 0.4 });
      store.setBorderRadius(16);
      store.setBackgroundConfig({ type: "gradient", value: "vibrant_orange_pink", opacity: 1 });
    },
  },
  {
    id: "social-twitter",
    name: "Twitter/X Post",
    apply: () => {
      const store = useImageStore.getState();
      store.setAspectRatio("16_9");
      store.setImageBorder({ enabled: true, type: "outline-light", width: 1, color: "#ffffff", padding: 0.5, opacity: 0.3 });
      store.setImageShadow({ enabled: true, blur: 20, offsetX: 0, offsetY: 6, spread: 2, color: "rgba(0,0,0,0.35)", opacity: 0.3 });
      store.setBorderRadius(8);
      store.setImageStylePreset("glass-light");
    },
  },
  {
    id: "product-showcase",
    name: "Product Showcase",
    apply: () => {
      const store = useImageStore.getState();
      store.setAspectRatio("4_3");
      store.setImageBorder({ enabled: true, type: "border-dark", width: 3, color: "#1a1a2e", padding: 3 });
      store.setImageShadow({ enabled: true, blur: 40, offsetX: 0, offsetY: 15, spread: 6, color: "rgba(0,0,0,0.6)", opacity: 0.5 });
      store.setBorderRadius(12);
      store.setBackgroundConfig({ type: "solid", value: "#0f0f1a", opacity: 1 });
      store.setImageStylePreset("glass-dark");
    },
  },
  {
    id: "minimal-clean",
    name: "Minimal Clean",
    apply: () => {
      const store = useImageStore.getState();
      store.setAspectRatio("3_2");
      store.setImageBorder({ enabled: true, type: "outline-light", width: 1, color: "#e5e7eb", padding: 1, opacity: 0.4 });
      store.setImageShadow({ enabled: false, blur: 0, offsetX: 0, offsetY: 0, spread: 0, color: "rgba(0,0,0,0)", opacity: 0 });
      store.setBorderRadius(6);
      store.setBackgroundConfig({ type: "solid", value: "#f9fafb", opacity: 1 });
    },
  },
  {
    id: "dark-premium",
    name: "Dark Premium",
    apply: () => {
      const store = useImageStore.getState();
      store.setAspectRatio("16_9");
      store.setImageBorder({ enabled: true, type: "border-dark", width: 1, color: "#2d2d3d", padding: 2 });
      store.setImageShadow({ enabled: true, blur: 50, offsetX: 0, offsetY: 20, spread: 8, color: "rgba(0,0,0,0.8)", opacity: 0.6 });
      store.setBorderRadius(10);
      store.setBackgroundConfig({ type: "solid", value: "#0a0a0f", opacity: 1 });
      store.setImageStylePreset("border-dark");
    },
  },
  {
    id: "vibrant-gradient",
    name: "Vibrant Gradient",
    apply: () => {
      const store = useImageStore.getState();
      store.setAspectRatio("4_5");
      store.setImageBorder({ enabled: true, type: "glass-light", width: 1, padding: 1, opacity: 0.2 });
      store.setImageShadow({ enabled: true, blur: 30, offsetX: 0, offsetY: 12, spread: 5, color: "rgba(0,0,0,0.5)", opacity: 0.4 });
      store.setBorderRadius(18);
      store.setBackgroundConfig({ type: "gradient", value: "vibrant_fuchsia_cyan", opacity: 1 });
      store.setImageStylePreset("glass-light");
    },
  },
];

function randomPreset() {
  const preset = predefinedPresets[Math.floor(Math.random() * predefinedPresets.length)];
  preset.apply();
  return preset;
}

export function QuickTemplatesSection() {
  const handleRandom = () => {
    const applied = randomPreset();
    toast.success(`Applied: ${applied.name}`, { duration: 2000 });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Quick Presets
        </span>
        <button
          onClick={handleRandom}
          className="flex items-center gap-1 px-2 h-6 rounded-md bg-muted/60 hover:bg-accent text-[10px] text-muted-foreground hover:text-foreground transition-all"
        >
          <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2h2v4M14 2l-4.5 4.5M14 14h2v-4M16 14l-5.5-5.5M2 4h2v4M4 4L1 8M2 12h2v-4M4 12L1 9" />
          </svg>
          Random
        </button>
      </div>

      <div className="grid grid-cols-2 gap-1.5">
        {predefinedPresets.map((preset) => (
          <button
            key={preset.id}
            onClick={preset.apply}
            className="px-2.5 py-2 rounded-lg border border-border/30 hover:border-border/60 hover:bg-accent/50 transition-all text-left active:scale-[0.98]"
          >
            <p className="text-[11px] font-medium text-foreground">{preset.name}</p>
            <p className="text-[9px] text-muted-foreground mt-0.5">Click to apply</p>
          </button>
        ))}
      </div>
    </div>
  );
}
