"use client";

import * as React from "react";
import { SectionWrapper } from "./SectionWrapper";
import { Slider } from "@/components/ui/slider";
import { useImageStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { RefreshIcon } from "hugeicons-react";
import { cn } from "@/lib/utils";

export function ImageEnhanceSection() {
  const {
    imageFilters,
    setImageFilter,
    resetImageFilters,
    backgroundNoise,
    setBackgroundNoise,
  } = useImageStore();

  const controls = [
    { key: "brightness" as const, label: "Brightness", min: 0, max: 200, step: 1, unit: "%" },
    { key: "contrast" as const, label: "Contrast", min: 0, max: 200, step: 1, unit: "%" },
    { key: "saturate" as const, label: "Saturation", min: 0, max: 200, step: 1, unit: "%" },
    { key: "blur" as const, label: "Blur", min: 0, max: 20, step: 0.5, unit: "px" },
    { key: "hueRotate" as const, label: "Hue Rotate", min: 0, max: 360, step: 1, unit: "°" },
    { key: "grayscale" as const, label: "Grayscale", min: 0, max: 100, step: 1, unit: "%" },
    { key: "sepia" as const, label: "Sepia", min: 0, max: 100, step: 1, unit: "%" },
    { key: "invert" as const, label: "Invert", min: 0, max: 100, step: 1, unit: "%" },
    { key: "sharpen" as const, label: "Sharpen", min: 0, max: 100, step: 1, unit: "%" },
    { key: "vignette" as const, label: "Vignette", min: 0, max: 100, step: 1, unit: "%" },
  ];

  const hasChanges = Object.entries(imageFilters).some(
    ([key, val]) =>
      (key === "brightness" && val !== 100) ||
      (key === "contrast" && val !== 100) ||
      (key === "saturate" && val !== 100) ||
      (key === "blur" && val !== 0) ||
      (key === "hueRotate" && val !== 0) ||
      (key === "grayscale" && val !== 0) ||
      (key === "sepia" && val !== 0) ||
      (key === "invert" && val !== 0) ||
      (key === "sharpen" && val !== 0) ||
      (key === "vignette" && val !== 0)
  );

  return (
    <SectionWrapper title="Enhance" defaultOpen={false}>
      <div className="space-y-2">
        {controls.map(({ key, label, min, max, step, unit }) => (
          <Slider
            key={key}
            value={[imageFilters[key]]}
            onValueChange={(v) => setImageFilter(key, v[0])}
            min={min}
            max={max}
            step={step}
            label={label}
            valueDisplay={`${imageFilters[key]}${unit}`}
          />
        ))}

        <Slider
          value={[backgroundNoise]}
          onValueChange={(v) => setBackgroundNoise(v[0])}
          min={0}
          max={100}
          step={1}
          label="Film Grain"
          valueDisplay={`${backgroundNoise}%`}
        />

        {hasChanges && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetImageFilters}
            className="w-full h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <RefreshIcon size={12} />
            Reset Filters
          </Button>
        )}
      </div>
    </SectionWrapper>
  );
}
