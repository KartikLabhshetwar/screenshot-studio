'use client';

import * as React from 'react';
import { PresetGallery } from '@/components/presets/PresetGallery';
import {
  Settings02Icon,
  SlidersHorizontalIcon,
  ColorsIcon,
  MagicWand01Icon,
  RotateSquareIcon,
  VideoReplayIcon,
  Cancel01Icon,
  LayersLogoIcon,
  Image01Icon,
  Globe02Icon,
} from 'hugeicons-react';
import {
  SettingsSection,
  StyleSection,
  BrowserMockupSection,
  BorderSection,
  ShadowSection,
  BackgroundSection,
  TextSection,
  TransformsGallery,
  AnnotateSection,
  ImageOverlaySection,
  DepthSection,
  TweetImportSection,
  CodeImagesLinkCard,
  ImagePositionSection,
} from './sections';
import { cn } from '@/lib/utils';
import { useImageStore } from '@/lib/store';
import { AnimationPresetGallery } from '@/components/timeline/AnimationPresetGallery';
import { SegmentedControl } from '@/components/ui/segmented-control';

type EditorMode = 'screenshot' | 'browser';
type TabType = 'settings' | 'edit' | 'background' | 'transforms' | 'animate' | 'depth';

const modeTabs: { id: EditorMode; icon: React.ReactNode; label: string }[] = [
  { id: 'screenshot', icon: <Image01Icon size={14} />, label: 'Screenshot' },
  { id: 'browser', icon: <Globe02Icon size={14} />, label: 'Browser' },
];

const tabs: { id: TabType; icon: React.ReactNode; label: string }[] = [
  { id: 'edit', icon: <SlidersHorizontalIcon size={14} />, label: 'Design' },
  { id: 'depth', icon: <LayersLogoIcon size={14} />, label: 'Layers' },
  { id: 'background', icon: <ColorsIcon size={14} />, label: 'BG' },
  { id: 'settings', icon: <Settings02Icon size={14} />, label: 'Adjust' },
  { id: 'transforms', icon: <RotateSquareIcon size={14} />, label: '3D' },
  { id: 'animate', icon: <VideoReplayIcon size={14} />, label: 'Motion' },
];

export function UnifiedRightPanel({
  onClose,
}: {
  onClose?: () => void;
} = {}) {
  const {
    activeRightPanelTab,
    setActiveRightPanelTab,
    showTemplates: templatesOpen,
    setShowTemplates: setTemplatesOpen,
    editorMode,
    setEditorMode,
  } = useImageStore();
  const activeTab = activeRightPanelTab;
  const setActiveTab = setActiveRightPanelTab;

  const [contentKey, setContentKey] = React.useState(activeTab);
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
      if (e.key === 'Escape') setTemplatesOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [templatesOpen, setTemplatesOpen]);

  return (
    <div className="relative flex h-full min-h-0 w-full flex-col overflow-hidden bg-background">
      <div className="relative z-20 shrink-0 space-y-2.5 border-b border-foreground/10 px-3 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3">
        <div className="flex min-w-0 items-center gap-2">
          <div className="min-w-0 flex-1 overflow-hidden">
            <SegmentedControl
              value={editorMode}
              onChange={(id) => setEditorMode(id as EditorMode)}
              options={modeTabs.map((tab) => ({
                id: tab.id,
                label: tab.label,
                icon: tab.icon,
                ariaLabel: tab.label,
              }))}
            />
          </div>
          {onClose ? (
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-foreground/[0.06] hover:text-foreground"
              aria-label="Close"
            >
              <Cancel01Icon size={16} />
            </button>
          ) : null}
        </div>
        <div className="min-w-0 overflow-hidden">
          <SegmentedControl
            value={activeTab}
            onChange={(id) => setActiveTab(id as TabType)}
            size="sm"
            options={tabs.map((tab) => ({
              id: tab.id,
              icon: tab.icon,
              ariaLabel: tab.label,
            }))}
          />
        </div>
      </div>

      <div className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto scrollbar-hide">
        <div
          className="p-3 transition-all duration-150 ease-out sm:p-4"
          style={{
            opacity: transitioning ? 0 : 1,
            transform: transitioning ? 'translateY(4px)' : 'translateY(0)',
          }}
        >
          {contentKey === 'settings' && (
            <div className="space-y-2">
              <SettingsSection />
            </div>
          )}

          {contentKey === 'edit' && (
            <div className="space-y-2">
              {editorMode === 'browser' ? (
                <BrowserMockupSection />
              ) : (
                <>
                  <StyleSection />
                  <BorderSection />
                </>
              )}
              <ImagePositionSection />
              <ShadowSection />
              <TweetImportSection />
              <CodeImagesLinkCard />
              <ImageOverlaySection />
              <AnnotateSection />
              <TextSection />
            </div>
          )}

          {contentKey === 'depth' && <DepthSection />}

          {contentKey === 'background' && (
            <div className="space-y-2">
              <BackgroundSection />
            </div>
          )}

          {contentKey === 'transforms' && <TransformsGallery />}

          {contentKey === 'animate' && <AnimationPresetGallery />}
        </div>
      </div>

      <div
        className={cn(
          'absolute inset-0 z-50 flex flex-col bg-background transition-all duration-300 ease-out',
          templatesOpen
            ? 'translate-x-0 opacity-100'
            : '-translate-x-full opacity-0 pointer-events-none'
        )}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-foreground/10 px-4 py-3">
          <div className="flex items-center gap-2.5">
            <MagicWand01Icon size={18} className="text-foreground" />
            <h2 className="text-sm font-semibold text-foreground">Templates</h2>
          </div>
          <button
            type="button"
            onClick={() => setTemplatesOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors duration-150 hover:bg-foreground/[0.08] hover:text-foreground"
          >
            <Cancel01Icon size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="p-4">
            <PresetGallery />
          </div>
        </div>
      </div>
    </div>
  );
}
