'use client';

import * as React from 'react';
import { PresetGallery } from '@/components/presets/PresetGallery';
import {
  SlidersHorizontalIcon,
  TextCreationIcon,
  Layers01Icon,
  ColorsIcon,
  MagicWand01Icon,
} from 'hugeicons-react';
import {
  EditSection,
  FramesSection,
  TransformsSection,
  ShadowSection,
  BackgroundSection,
  TextSection,
  OverlaysSection,
} from './sections';
import { cn } from '@/lib/utils';

type TabType = 'edit' | 'text' | 'overlays' | 'background' | 'presets';

const tabs: { id: TabType; icon: React.ReactNode; label: string }[] = [
  { id: 'edit', icon: <SlidersHorizontalIcon size={20} />, label: 'Edit' },
  { id: 'text', icon: <TextCreationIcon size={20} />, label: 'Text' },
  { id: 'overlays', icon: <Layers01Icon size={20} />, label: 'Layers' },
  { id: 'background', icon: <ColorsIcon size={20} />, label: 'BG' },
  { id: 'presets', icon: <MagicWand01Icon size={20} />, label: 'Presets' },
];

export function UnifiedRightPanel() {
  const [activeTab, setActiveTab] = React.useState<TabType>('edit');

  return (
    <div className="w-full h-full bg-surface-2 flex flex-col overflow-hidden md:w-[460px] border-l border-border/40">
      {/* Tab Navigation */}
      <div className="px-3 py-3 border-b border-border/30 shrink-0">
        <div className="flex gap-1 bg-surface-1/50 p-1 rounded-xl">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex-1 flex flex-col items-center gap-1 py-2.5 px-2 rounded-lg transition-all duration-200',
                activeTab === tab.id
                  ? 'bg-surface-4 text-foreground shadow-sm'
                  : 'text-text-tertiary hover:text-text-secondary hover:bg-surface-3/50'
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
          {activeTab === 'edit' && (
            <div className="space-y-2">
              <EditSection />
              <FramesSection />
              <TransformsSection />
              <ShadowSection />
            </div>
          )}

          {activeTab === 'text' && (
            <div className="space-y-2">
              <TextSection />
            </div>
          )}

          {activeTab === 'overlays' && (
            <div className="space-y-2">
              <OverlaysSection />
            </div>
          )}

          {activeTab === 'background' && (
            <div className="space-y-2">
              <BackgroundSection />
            </div>
          )}

          {activeTab === 'presets' && <PresetGallery />}
        </div>
      </div>
    </div>
  );
}
