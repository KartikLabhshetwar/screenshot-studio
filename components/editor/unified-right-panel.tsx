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
} from 'hugeicons-react';
import {
  SettingsSection,
  EditSection,
  FramesSection,
  ShadowSection,
  BackgroundSection,
  TextSection,
  TransformsGallery,
} from './sections';
import { cn } from '@/lib/utils';
import { useImageStore } from '@/lib/store';
import { Clock01Icon } from 'hugeicons-react';
import { trackTabChange } from '@/lib/analytics';

type TabType = 'settings' | 'edit' | 'background' | 'transforms' | 'animate' | 'presets';

const tabs: { id: TabType; icon: React.ReactNode; label: string }[] = [
  { id: 'settings', icon: <Settings02Icon size={20} />, label: 'Settings' },
  { id: 'edit', icon: <SlidersHorizontalIcon size={20} />, label: 'Edit' },
  { id: 'background', icon: <ColorsIcon size={20} />, label: 'BG' },
  { id: 'transforms', icon: <RotateSquareIcon size={20} />, label: '3D' },
  { id: 'animate', icon: <VideoReplayIcon size={20} />, label: 'Animate' },
  { id: 'presets', icon: <MagicWand01Icon size={20} />, label: 'Presets' },
];

export function UnifiedRightPanel() {
  const { activeRightPanelTab, setActiveRightPanelTab } = useImageStore();
  const activeTab = activeRightPanelTab;
  const setActiveTab = setActiveRightPanelTab;
  const activeIndex = tabs.findIndex((t) => t.id === activeTab);

  return (
    <div className="w-full h-full bg-surface-2 flex flex-col overflow-hidden md:w-[460px] border-l border-border/40">
      {/* Tab Navigation */}
      <div className="px-3 py-3 border-b border-border/30 shrink-0">
        <div className="relative flex p-1 bg-surface-1/80 dark:bg-surface-1/50 rounded-xl border border-border/20">
          {/* Sliding background indicator */}
          <div
            className="absolute top-1 bottom-1 bg-white dark:bg-surface-4 rounded-lg shadow-sm transition-all duration-250 ease-out"
            style={{
              left: `calc(${activeIndex * (100 / tabs.length)}% + 4px)`,
              width: `calc(${100 / tabs.length}% - 8px)`,
            }}
          />
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                trackTabChange(tab.id);
                setActiveTab(tab.id);
              }}
              className={cn(
                'relative z-10 flex-1 flex flex-col items-center gap-1 py-2.5 px-2 rounded-lg transition-colors duration-150',
                activeTab === tab.id
                  ? 'text-foreground'
                  : 'text-text-tertiary hover:text-text-secondary'
              )}
            >
              {tab.icon}
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="p-5">
          {activeTab === 'settings' && (
            <div className="space-y-2">
              <SettingsSection />
            </div>
          )}

          {activeTab === 'edit' && (
            <div className="space-y-2">
              <EditSection />
              <FramesSection />
              <ShadowSection />
              <TextSection />
            </div>
          )}

          {activeTab === 'background' && (
            <div className="space-y-2">
              <BackgroundSection />
            </div>
          )}

          {activeTab === 'transforms' && <TransformsGallery />}

          {activeTab === 'animate' && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand/10">
                <Clock01Icon className="h-8 w-8 text-brand" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Animation Coming Soon
              </h3>
              <p className="text-sm text-muted-foreground max-w-[280px]">
                Create stunning animations with keyframes, transitions, and effects. We&apos;re working hard to bring you this feature!
              </p>
            </div>
          )}

          {activeTab === 'presets' && <PresetGallery />}
        </div>
      </div>
    </div>
  );
}
