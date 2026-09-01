"use client";

import { useState } from "react";
import { DeviceShell } from "./DeviceShell";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { getMockupsByFamily, MAX_DEVICE_MOCKUPS } from "@/lib/constants/mockups";
import { createDeviceScreen } from "@/lib/device-mockups/layouts";
import { useImageStore } from "@/lib/store";
import { useDeviceUIStore } from "@/lib/store/device-ui";
import { cn } from "@/lib/utils";
import type { DeviceFamily } from "@/types/mockup";

const categories: { id: DeviceFamily; label: string }[] = [
  { id: "phone", label: "Phone" },
  { id: "watch", label: "Watch" },
  { id: "laptop", label: "Laptop" },
];

export function MockupGallery(): React.JSX.Element {
  const [family, setFamily] = useState<DeviceFamily>("phone");
  const mockups = useImageStore((state) => state.mockups);
  const uploadedImageUrl = useImageStore((state) => state.uploadedImageUrl);
  const imageName = useImageStore((state) => state.imageName);
  const addMockup = useImageStore((state) => state.addMockup);
  const updateMockup = useImageStore((state) => state.updateMockup);
  const galleryMode = useDeviceUIStore((state) => state.galleryMode);
  const selectedDeviceId = useDeviceUIStore((state) => state.selectedDeviceId);
  const setSelectedDeviceId = useDeviceUIStore((state) => state.setSelectedDeviceId);
  const closeGallery = useDeviceUIStore((state) => state.closeGallery);
  const definitions = getMockupsByFamily(family);
  const selected = mockups.find((mockup) => mockup.id === selectedDeviceId);
  const isChangingSelected = galleryMode === "change" && selected !== undefined;

  const selectDefinition = (definitionId: string): void => {
    if (isChangingSelected && selectedDeviceId) {
      updateMockup(selectedDeviceId, { definitionId });
      closeGallery();
      return;
    }
    const index = mockups.length;
    const id = addMockup({
      definitionId,
      position: { x: 0.5 + Math.min(index, 3) * 0.035, y: 0.5 + Math.min(index, 3) * 0.025 },
      size: family === "laptop" || family === "desktop"
        ? 0.5
        : family === "watch"
          ? 0.16
          : 0.22,
      rotation: 0,
      opacity: 1,
      isVisible: true,
      screen: createDeviceScreen(uploadedImageUrl, imageName),
    });
    if (id) {
      setSelectedDeviceId(id);
      closeGallery();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-foreground">
            {isChangingSelected ? "Choose a new frame" : "Choose a frame"}
          </p>
          <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
            {uploadedImageUrl ? "Your image is added automatically." : "Add its screen image on the canvas."}
          </p>
        </div>
        {mockups.length > 0 ? (
          <button
            type="button"
            onClick={closeGallery}
            className="h-7 shrink-0 rounded-md px-2 text-xs text-muted-foreground max-[768px]:h-11 transition-colors hover:bg-foreground/[0.05] hover:text-foreground"
          >
            Back
          </button>
        ) : null}
      </div>

      <SegmentedControl
        size="sm"
        ariaLabel="Device family"
        value={family}
        onChange={(value) => setFamily(value as DeviceFamily)}
        options={categories.map((category) => ({
          id: category.id,
          label: category.label,
          ariaLabel: category.label,
        }))}
      />

      <div className="grid grid-cols-2 gap-2">
        {definitions.map((definition) => {
          const isCurrent = isChangingSelected && selected?.definitionId === definition.id;
          return (
            <button
              key={definition.id}
              type="button"
              disabled={galleryMode === "add" && mockups.length >= MAX_DEVICE_MOCKUPS}
              onClick={() => selectDefinition(definition.id)}
              title={definition.name}
              aria-pressed={isChangingSelected ? isCurrent : undefined}
              className="group flex min-w-0 flex-col gap-1.5 text-left disabled:cursor-not-allowed disabled:opacity-40"
            >
              <div
                className={cn(
                  "w-full rounded-[10px] border p-1 transition-[background-color,border-color] duration-150",
                  isCurrent
                    ? "border-foreground/25 bg-foreground/[0.1]"
                    : "border-transparent hover:border-foreground/15 hover:bg-foreground/[0.05]",
                )}
              >
                <div className="flex h-24 items-center justify-center overflow-hidden rounded-md bg-foreground/[0.04] p-2">
                  <div
                    style={{
                      width: definition.family === "laptop" || definition.family === "desktop"
                        ? definition.aspectRatio < 1.2 ? 76 : 112
                        : definition.family === "watch"
                          ? 42
                          : definition.aspectRatio > 1.2 ? 92 : definition.aspectRatio > 0.65 ? 52 : 36,
                      maxHeight: 80,
                      aspectRatio: definition.aspectRatio,
                    }}
                  >
                    <DeviceShell
                      definition={definition}
                      screen={createDeviceScreen(uploadedImageUrl, imageName)}
                    />
                  </div>
                </div>
              </div>
              <span
                className={cn(
                  "w-full truncate px-1 text-[10px] leading-tight",
                  isCurrent ? "font-medium text-foreground" : "text-muted-foreground",
                )}
                title={definition.name}
              >
                {definition.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
