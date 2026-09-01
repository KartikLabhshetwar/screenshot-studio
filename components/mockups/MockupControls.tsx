"use client";

import { useRef } from "react";
import {
  Add01Icon,
  ArrowDown01Icon,
  ArrowUp01Icon,
  Copy01Icon,
  Delete02Icon,
  Image01Icon,
  RotateClockwiseIcon,
  ViewIcon,
  ViewOffSlashIcon,
} from "hugeicons-react";
import { Button } from "@/components/ui/button";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Slider } from "@/components/ui/slider";
import { DEVICE_LAYOUTS, getMockupDefinition, MAX_DEVICE_MOCKUPS } from "@/lib/constants/mockups";
import { blobToDataUrl } from "@/lib/image-storage";
import { useImageStore } from "@/lib/store";
import { useDeviceUIStore } from "@/lib/store/device-ui";
import { cn } from "@/lib/utils";

export function MockupControls(): React.JSX.Element {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const mockups = useImageStore((state) => state.mockups);
  const activeLayoutId = useImageStore((state) => state.activeDeviceLayoutId);
  const updateMockup = useImageStore((state) => state.updateMockup);
  const removeMockup = useImageStore((state) => state.removeMockup);
  const duplicateMockup = useImageStore((state) => state.duplicateMockup);
  const reorderMockup = useImageStore((state) => state.reorderMockup);
  const clearDeviceLayout = useImageStore((state) => state.clearDeviceLayout);
  const applyDeviceLayout = useImageStore((state) => state.applyDeviceLayout);
  const selectedDeviceId = useDeviceUIStore((state) => state.selectedDeviceId);
  const editingScreenDeviceId = useDeviceUIStore((state) => state.editingScreenDeviceId);
  const setSelectedDeviceId = useDeviceUIStore((state) => state.setSelectedDeviceId);
  const setEditingScreenDeviceId = useDeviceUIStore((state) => state.setEditingScreenDeviceId);
  const openGallery = useDeviceUIStore((state) => state.openGallery);
  const selected = mockups.find((mockup) => mockup.id === selectedDeviceId);

  const replaceScreen = async (file: File): Promise<void> => {
    if (!selected) return;
    const src = await blobToDataUrl(file);
    updateMockup(selected.id, {
      screen: {
        ...selected.screen,
        src,
        name: file.name,
        isCustom: true,
        scale: 1,
        offset: { x: 0, y: 0 },
      },
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          {mockups.length} of {MAX_DEVICE_MOCKUPS} devices
        </p>
        <Button
          variant="outline"
          size="sm"
          className="text-xs leading-none max-[768px]:min-h-11"
          disabled={mockups.length >= MAX_DEVICE_MOCKUPS}
          onClick={() => openGallery("add")}
        >
          <Add01Icon size={14} />
          Add
        </Button>
      </div>

      <div className="space-y-1">
        {mockups.map((mockup, index) => {
          const definition = getMockupDefinition(mockup.definitionId);
          const isSelected = mockup.id === selected?.id;
          return (
            <div
              key={mockup.id}
              className={cn(
                "flex w-full items-center gap-2 rounded-md border px-2 py-2 text-left transition-colors",
                isSelected
                  ? "border-foreground/20 bg-foreground/[0.06]"
                  : "border-transparent hover:bg-foreground/[0.04]",
              )}
            >
              <button
                type="button"
                onClick={() => setSelectedDeviceId(mockup.id)}
              className="flex min-h-6 min-w-0 flex-1 items-center gap-2 text-left max-[768px]:min-h-11"
                aria-pressed={isSelected}
              >
                <span className="flex size-6 items-center justify-center rounded bg-foreground/[0.06] text-[10px] tabular-nums text-muted-foreground">
                  {index + 1}
                </span>
                <span className="min-w-0 flex-1 truncate text-xs font-medium text-foreground">{definition?.name ?? "Device"}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  updateMockup(mockup.id, { isVisible: !mockup.isVisible });
                }}
                className="flex size-7 items-center justify-center rounded text-muted-foreground max-[768px]:size-11 hover:bg-foreground/[0.06] hover:text-foreground"
                aria-label={mockup.isVisible ? "Hide device" : "Show device"}
              >
                {mockup.isVisible ? <ViewIcon size={13} /> : <ViewOffSlashIcon size={13} />}
              </button>
            </div>
          );
        })}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-foreground">Layouts</span>
          {activeLayoutId ? (
            <button
              type="button"
              onClick={() => applyDeviceLayout(activeLayoutId)}
              className="flex min-h-6 items-center gap-1 text-xs text-muted-foreground max-[768px]:min-h-11 hover:text-foreground"
            >
              <RotateClockwiseIcon size={12} /> Reset
            </button>
          ) : null}
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {DEVICE_LAYOUTS.map((layout) => (
            <button
              key={layout.id}
              type="button"
              disabled={mockups.length > layout.slots.length}
              onClick={() => {
                if (activeLayoutId === layout.id) {
                  clearDeviceLayout();
                  const restored = useImageStore.getState().mockups;
                  if (!restored.some((mockup) => mockup.id === selectedDeviceId)) {
                    setSelectedDeviceId(restored[0]?.id ?? null);
                  }
                  return;
                }
                applyDeviceLayout(layout.id);
              }}
              title={layout.description}
              aria-pressed={activeLayoutId === layout.id}
              className={cn(
                "min-h-8 rounded-md border px-2 py-1.5 text-left text-xs leading-tight transition-colors max-[768px]:min-h-11",
                activeLayoutId === layout.id
                  ? "border-foreground/25 bg-foreground/[0.07] font-medium text-foreground"
                  : "border-foreground/10 text-muted-foreground hover:bg-foreground/[0.04] hover:text-foreground",
                "disabled:cursor-not-allowed disabled:opacity-35",
              )}
            >
              {layout.name}
            </button>
          ))}
        </div>
      </div>

      {selected ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-foreground">Selected device</span>
            <button type="button" onClick={() => openGallery("change")} className="min-h-6 text-xs text-muted-foreground max-[768px]:min-h-11 hover:text-foreground">
              Change
            </button>
          </div>

          <p className="rounded-md bg-foreground/[0.05] px-2.5 py-2 text-xs leading-relaxed text-muted-foreground">
            Click an empty device screen to upload. Double-click a filled screen to replace its image.
          </p>

          <div className={cn("grid gap-1.5", editingScreenDeviceId === selected.id ? "grid-cols-3" : "grid-cols-2")}>
            <Button
              variant="outline"
              size="sm"
              className="min-w-0 text-xs leading-none max-[768px]:min-h-11"
              onClick={() => fileInputRef.current?.click()}
            >
              <Image01Icon className="size-[13px]" /> {selected.screen.src ? "Replace" : "Upload"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="min-w-0 text-xs leading-none max-[768px]:min-h-11"
              onClick={() => setEditingScreenDeviceId(editingScreenDeviceId === selected.id ? null : selected.id)}
              aria-pressed={editingScreenDeviceId === selected.id}
            >
              {editingScreenDeviceId === selected.id ? "Done" : "Crop"}
            </Button>
            {editingScreenDeviceId === selected.id ? (
              <Button
                variant="outline"
                size="sm"
                className="min-w-0 text-xs leading-none max-[768px]:min-h-11"
                onClick={() => updateMockup(selected.id, {
                  screen: { ...selected.screen, scale: 1, offset: { x: 0, y: 0 } },
                })}
              >
                Reset
              </Button>
            ) : null}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) replaceScreen(file);
              event.currentTarget.value = "";
            }}
          />

          <SegmentedControl
            size="sm"
            ariaLabel="Screen fit"
            value={selected.screen.fit}
            onChange={(fit) => updateMockup(selected.id, {
              screen: { ...selected.screen, fit: fit as "cover" | "contain" },
            })}
            options={[
              { id: "cover", label: "Fill" },
              { id: "contain", label: "Fit" },
            ]}
          />

          <Slider
            min={1}
            max={3}
            step={0.05}
            value={[selected.screen.scale]}
            onValueChange={([scale]) => updateMockup(selected.id, { screen: { ...selected.screen, scale } })}
            label="Screen zoom"
            valueDisplay={`${Math.round(selected.screen.scale * 100)}%`}
          />
          <Slider
            min={-180}
            max={180}
            step={1}
            value={[selected.rotation]}
            onValueChange={([rotation]) => updateMockup(selected.id, { rotation })}
            label="Rotation"
            valueDisplay={`${selected.rotation}°`}
          />
          <Slider
            min={0.08}
            max={0.9}
            step={0.01}
            value={[selected.size]}
            onValueChange={([size]) => updateMockup(selected.id, { size })}
            label="Size"
            valueDisplay={`${Math.round(selected.size * 100)}%`}
          />
          <Slider
            min={0}
            max={1}
            step={0.01}
            value={[selected.opacity]}
            onValueChange={([opacity]) => updateMockup(selected.id, { opacity })}
            label="Opacity"
            valueDisplay={`${Math.round(selected.opacity * 100)}%`}
          />

          <div className="grid grid-cols-4 gap-1">
            <button type="button" onClick={() => reorderMockup(selected.id, "down")} className="flex h-8 items-center justify-center rounded-md text-muted-foreground max-[768px]:h-11 hover:bg-foreground/[0.05] hover:text-foreground" aria-label="Move layer down"><ArrowDown01Icon size={14} /></button>
            <button type="button" onClick={() => reorderMockup(selected.id, "up")} className="flex h-8 items-center justify-center rounded-md text-muted-foreground max-[768px]:h-11 hover:bg-foreground/[0.05] hover:text-foreground" aria-label="Move layer up"><ArrowUp01Icon size={14} /></button>
            <button type="button" disabled={mockups.length >= MAX_DEVICE_MOCKUPS} onClick={() => { const id = duplicateMockup(selected.id); if (id) setSelectedDeviceId(id); }} className="flex h-8 items-center justify-center rounded-md text-muted-foreground max-[768px]:h-11 hover:bg-foreground/[0.05] hover:text-foreground disabled:opacity-35" aria-label="Duplicate device"><Copy01Icon size={14} /></button>
            <button type="button" onClick={() => { removeMockup(selected.id); setSelectedDeviceId(null); }} className="flex h-8 items-center justify-center rounded-md text-muted-foreground max-[768px]:h-11 hover:bg-destructive/10 hover:text-destructive" aria-label="Delete device"><Delete02Icon size={14} /></button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
