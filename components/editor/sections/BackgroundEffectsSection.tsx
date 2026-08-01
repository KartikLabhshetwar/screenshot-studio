"use client";

import * as React from "react";
import { SectionWrapper } from "./SectionWrapper";
import { Slider } from "@/components/ui/slider";
import { useImageStore, useEditorStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const meshGradients = [
  { id: "warm-sunset", colors: ["#ff6b6b", "#ffa502", "#ff6348"], label: "Sunset" },
  { id: "ocean-deep", colors: ["#0c0c3a", "#1a1a6e", "#2d6bcf"], label: "Ocean" },
  { id: "aurora", colors: ["#0f0c29", "#302b63", "#24243e"], label: "Aurora" },
  { id: "cotton-candy", colors: ["#ff9a9e", "#fad0c4", "#fbc2eb"], label: "Candy" },
  { id: "forest", colors: ["#134e5e", "#71b280", "#2c7744"], label: "Forest" },
  { id: "lavender", colors: ["#667eea", "#764ba2", "#a18cd1"], label: "Lavender" },
];

export function BackgroundEffectsSection() {
  const { setBackgroundConfig } = useImageStore();
  const { noise, setNoise, pattern, setPattern } = useEditorStore();

  return (
    <SectionWrapper title="Background Effects" defaultOpen={false}>
      <div className="space-y-3">
        {/* Mesh Gradients */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
            Mesh Gradients
          </p>
          <div className="grid grid-cols-3 gap-1.5">
            {meshGradients.map((mesh) => (
              <button
                key={mesh.id}
                onClick={() =>
                  setBackgroundConfig({
                    type: "gradient",
                    value: mesh.id,
                    opacity: 1,
                  })
                }
                className={cn(
                  "h-10 rounded-lg border transition-all duration-200 active:scale-[0.97]",
                  "border-border/30 hover:border-border/60 hover:ring-1 hover:ring-primary/30"
                )}
                style={{
                  background: `linear-gradient(135deg, ${mesh.colors[0]}, ${mesh.colors[1]}, ${mesh.colors[2]})`,
                }}
                title={mesh.label}
              />
            ))}
          </div>
          <div className="flex flex-wrap gap-1 mt-1.5">
            {meshGradients.map((mesh) => (
              <span
                key={mesh.id}
                className="text-[9px] text-muted-foreground px-1"
              >
                {mesh.label}
              </span>
            ))}
          </div>
        </div>

        {/* Noise Overlay */}
        <div className="space-y-2">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Noise
          </p>
          <div className="flex gap-1">
            {[
              { id: "none", label: "Off" },
              { id: "grain", label: "Grain" },
              { id: "film", label: "Film" },
            ].map((n) => (
              <button
                key={n.id}
                onClick={() =>
                  setNoise({
                    enabled: n.id !== "none",
                    type: n.id,
                    opacity: noise.enabled ? noise.opacity : 0.3,
                  })
                }
                className={cn(
                  "flex-1 py-1.5 rounded-md text-[10px] font-medium transition-all border",
                  (n.id === "none" && !noise.enabled) ||
                    (n.id === noise.type && noise.enabled)
                    ? "bg-primary/10 border-primary/30 text-primary"
                    : "bg-muted/50 border-border/30 text-muted-foreground hover:bg-accent"
                )}
              >
                {n.label}
              </button>
            ))}
          </div>
          {noise.enabled && (
            <Slider
              value={[Math.round(noise.opacity * 100)]}
              onValueChange={(v) => setNoise({ opacity: v[0] / 100 })}
              min={5}
              max={100}
              step={1}
              label="Intensity"
              valueDisplay={`${Math.round(noise.opacity * 100)}%`}
            />
          )}
        </div>

        {/* Pattern Overlay */}
        <div className="space-y-2">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Pattern
          </p>
          <div className="flex gap-1">
            {[
              { id: "none", label: "Off" },
              { id: "grid", label: "Grid" },
              { id: "dots", label: "Dots" },
              { id: "lines", label: "Lines" },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() =>
                  setPattern({
                    enabled: p.id !== "none",
                    type: p.id,
                    scale: pattern.scale,
                    spacing: pattern.spacing,
                    color: pattern.color,
                    rotation: pattern.rotation,
                    blur: pattern.blur,
                    opacity: pattern.opacity,
                  })
                }
                className={cn(
                  "flex-1 py-1.5 rounded-md text-[10px] font-medium transition-all border",
                  (p.id === "none" && !pattern.enabled) ||
                    (p.id === pattern.type && pattern.enabled)
                    ? "bg-primary/10 border-primary/30 text-primary"
                    : "bg-muted/50 border-border/30 text-muted-foreground hover:bg-accent"
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
          {pattern.enabled && (
            <>
              <Slider
                value={[pattern.spacing]}
                onValueChange={(v) => setPattern({ spacing: v[0] })}
                min={5}
                max={60}
                step={1}
                label="Spacing"
                valueDisplay={`${pattern.spacing}px`}
              />
              <Slider
                value={[Math.round(pattern.opacity * 100)]}
                onValueChange={(v) => setPattern({ opacity: v[0] / 100 })}
                min={5}
                max={100}
                step={1}
                label="Pattern Opacity"
                valueDisplay={`${Math.round(pattern.opacity * 100)}%`}
              />
            </>
          )}
        </div>
      </div>
    </SectionWrapper>
  );
}
