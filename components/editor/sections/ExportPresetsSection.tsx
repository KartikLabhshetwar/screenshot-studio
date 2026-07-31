"use client";

import * as React from "react";
import { SectionWrapper } from "./SectionWrapper";
import { useImageStore } from "@/lib/store";
import { toast } from "sonner";

interface ExportPreset {
  id: string;
  name: string;
  platform: string;
  dimensions: string;
  apply: () => void;
}

const exportPresets: ExportPreset[] = [
  {
    id: "twitter-post",
    name: "Twitter/X",
    platform: "Social",
    dimensions: "1200×675",
    apply: () => {
      useImageStore.getState().setAspectRatio("16_9");
      toast.success("Twitter/X preset applied: 16:9 (1200×675)");
    },
  },
  {
    id: "instagram-square",
    name: "Instagram Square",
    platform: "Social",
    dimensions: "1080×1080",
    apply: () => {
      useImageStore.getState().setAspectRatio("1_1");
      toast.success("Instagram Square preset applied: 1:1 (1080×1080)");
    },
  },
  {
    id: "instagram-story",
    name: "Instagram Story",
    platform: "Social",
    dimensions: "1080×1920",
    apply: () => {
      useImageStore.getState().setAspectRatio("9_16");
      toast.success("Instagram Story preset applied: 9:16 (1080×1920)");
    },
  },
  {
    id: "facebook-post",
    name: "Facebook",
    platform: "Social",
    dimensions: "1200×630",
    apply: () => {
      useImageStore.getState().setAspectRatio("1_91_1");
      toast.success("Facebook preset applied: 1.91:1 (1200×630)");
    },
  },
  {
    id: "linkedin-post",
    name: "LinkedIn",
    platform: "Social",
    dimensions: "1200×627",
    apply: () => {
      useImageStore.getState().setAspectRatio("16_9");
      toast.success("LinkedIn preset applied: 16:9 (1200×627)");
    },
  },
  {
    id: "youtube-thumbnail",
    name: "YouTube",
    platform: "Video",
    dimensions: "1280×720",
    apply: () => {
      useImageStore.getState().setAspectRatio("16_9");
      toast.success("YouTube thumbnail preset applied: 16:9 (1280×720)");
    },
  },
  {
    id: "pinterest-pin",
    name: "Pinterest",
    platform: "Social",
    dimensions: "1000×1500",
    apply: () => {
      useImageStore.getState().setAspectRatio("2_3");
      toast.success("Pinterest preset applied: 2:3 (1000×1500)");
    },
  },
  {
    id: "devices-ipad",
    name: "iPad Pro",
    platform: "Device",
    dimensions: "2048×2732",
    apply: () => {
      useImageStore.getState().setAspectRatio("3_4");
      toast.success("iPad Pro preset applied: 3:4 (2048×2732)");
    },
  },
];

export function ExportPresetsSection() {
  return (
    <SectionWrapper title="Export Presets" defaultOpen={false}>
      <div className="grid grid-cols-2 gap-1.5">
        {exportPresets.map((preset) => (
          <button
            key={preset.id}
            onClick={preset.apply}
            className="px-2.5 py-2 rounded-lg border border-border/30 hover:border-border/60 hover:bg-accent/50 transition-all text-left active:scale-[0.98]"
          >
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                {preset.platform}
              </span>
            </div>
            <p className="text-[11px] font-semibold text-foreground mt-0.5">
              {preset.name}
            </p>
            <p className="text-[9px] text-muted-foreground">{preset.dimensions}</p>
          </button>
        ))}
      </div>
    </SectionWrapper>
  );
}
