"use client";

import * as React from "react";
import { PresetGallery } from "@/components/presets/PresetGallery";
import {
  SlidersHorizontalIcon,
  ColorsIcon,
  MagicWand01Icon,
  Cancel01Icon,
  LayersLogoIcon,
  Image01Icon,
  Globe02Icon,
} from "hugeicons-react";
import {
  StyleSection,
  BorderSection,
  ShadowSection,
  BackgroundSection,
  DepthSection,
  TweetImportSection,
  CodeSnippetSection,
  ImageOverlaySection,
  AnnotateSection,
  TextSection,
  SettingsSection,
  BrowserMockupSection,
} from "./sections";
import { cn } from "@/lib/utils";
import { useImageStore } from "@/lib/store";
import { SegmentedControl } from "@/components/ui/segmented-control";

type LeftTabType = "edit" | "background" | "depth";

const leftTabs: { id: LeftTabType; icon: React.ReactNode; label: string }[] = [
  { id: "edit", icon: <SlidersHorizontalIcon size={14} />, label: "Design" },
  { id: "background", icon: <ColorsIcon size={14} />, label: "BG" },
  { id: "depth", icon: <LayersLogoIcon size={14} />, label: "Layers" },
];

function ModeSegmentedControl(): React.JSX.Element {
  const editorMode = useImageStore((s) => s.editorMode);
  const setEditorMode = useImageStore((s) => s.setEditorMode);

  return (
    <SegmentedControl
      value={editorMode}
      onChange={(id) => setEditorMode(id as "screenshot" | "browser")}
      options={[
        {
          id: "screenshot",
          label: "Screenshot",
          icon: <Image01Icon size={14} />,
          ariaLabel: "Screenshot",
        },
        {
          id: "browser",
          label: "Browser",
          icon: <Globe02Icon size={14} />,
          ariaLabel: "Browser",
        },
      ]}
    />
  );
}

export function LeftEditPanel() {
  const templatesOpen = useImageStore((s) => s.showTemplates);
  const setTemplatesOpen = useImageStore((s) => s.setShowTemplates);
  const editorMode = useImageStore((s) => s.editorMode);
  const [activeTab, setActiveTab] = React.useState<LeftTabType>("edit");

  const [contentKey, setContentKey] = React.useState<LeftTabType>(activeTab);
  const [transitioning, setTransitioning] = React.useState(false);

  React.useEffect(() => {
    if (activeTab !== contentKey) {
      setTransitioning(true);
      const timeout = setTimeout(() => {
        setContentKey(activeTab);
        setTransitioning(false);
      }, 150);
      return () => clearTimeout(timeout);
    }
  }, [activeTab, contentKey]);

  React.useEffect(() => {
    if (!templatesOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setTemplatesOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [templatesOpen, setTemplatesOpen]);

  return (
    <div className="w-[260px] h-full bg-background flex flex-col overflow-hidden border-r border-foreground/10 relative shrink-0">
      <div className="px-3 pt-2.5 pb-1 shrink-0">
        <ModeSegmentedControl />
      </div>

      <div className="px-3 py-2.5 border-b border-foreground/10 shrink-0">
        <SegmentedControl
          value={activeTab}
          onChange={(id) => setActiveTab(id as LeftTabType)}
          options={leftTabs.map((tab) => ({
            id: tab.id,
            label: tab.label,
            icon: tab.icon,
            ariaLabel: tab.label,
          }))}
        />
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div
          className="p-4 transition-all duration-150 ease-out"
          style={{
            opacity: transitioning ? 0 : 1,
            transform: transitioning ? "translateY(4px)" : "translateY(0)",
          }}
        >
          {contentKey === "edit" && (
            <div className="space-y-1">
              {editorMode === "browser" ? (
                <BrowserMockupSection />
              ) : (
                <>
                  <StyleSection />
                  <BorderSection />
                </>
              )}
              <ShadowSection />
              <TweetImportSection />
              <CodeSnippetSection />
              <ImageOverlaySection />
              <AnnotateSection />
              <TextSection />
              <SettingsSection />
            </div>
          )}

          {contentKey === "background" && (
            <div className="space-y-1">
              <BackgroundSection />
            </div>
          )}

          {contentKey === "depth" && <DepthSection />}
        </div>
      </div>

      <div
        className={cn(
          "absolute inset-0 z-50 bg-background flex flex-col transition-all duration-300 ease-out",
          templatesOpen
            ? "translate-x-0 opacity-100"
            : "-translate-x-full opacity-0 pointer-events-none",
        )}
      >
        <div className="flex items-center justify-between px-3 py-3 border-b border-foreground/10 shrink-0">
          <div className="flex items-center gap-2">
            <MagicWand01Icon size={16} className="text-foreground" />
            <h2 className="text-sm font-semibold text-foreground">Templates</h2>
          </div>
          <button
            onClick={() => setTemplatesOpen(false)}
            className="flex items-center justify-center w-7 h-7 rounded-md hover:bg-foreground/[0.06] transition-colors duration-150 text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <Cancel01Icon size={16} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="p-3">
            <PresetGallery />
          </div>
        </div>
      </div>
    </div>
  );
}
