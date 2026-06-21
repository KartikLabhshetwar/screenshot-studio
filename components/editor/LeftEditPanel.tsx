'use client';

import * as React from 'react';
import { PresetGallery } from '@/components/presets/PresetGallery';
import {
  SlidersHorizontalIcon,
  ColorsIcon,
  MagicWand01Icon,
  Cancel01Icon,
  LayersLogoIcon,
  Image01Icon,
  Globe02Icon,
  ArrowDown01Icon,
} from 'hugeicons-react';
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
} from './sections';
import { cn } from '@/lib/utils';
import { useImageStore } from '@/lib/store';

type LeftTabType = 'edit' | 'background' | 'depth';

const leftTabs: { id: LeftTabType; icon: React.ReactNode; label: string }[] = [
  { id: 'edit', icon: <SlidersHorizontalIcon size={18} />, label: 'Design' },
  { id: 'background', icon: <ColorsIcon size={18} />, label: 'BG' },
  { id: 'depth', icon: <LayersLogoIcon size={18} />, label: 'Layers' },
];

function ModeDropdown() {
  const editorMode = useImageStore((s) => s.editorMode);
  const setEditorMode = useImageStore((s) => s.setEditorMode);
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const modes = [
    { id: 'screenshot' as const, label: 'Screenshot', icon: <Image01Icon size={14} /> },
    { id: 'browser' as const, label: 'Browser', icon: <Globe02Icon size={14} /> },
  ];

  const current = modes.find(m => m.id === editorMode) || modes[0];

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2.5 px-3 h-10 rounded-lg bg-muted/80 dark:bg-muted/50 border border-border/20 hover:bg-accent transition-colors"
      >
        <span className="text-muted-foreground">{current.icon}</span>
        <span className="flex-1 text-left text-sm text-foreground">{current.label}</span>
        <ArrowDown01Icon size={14} className={cn('text-muted-foreground transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-popover border border-border rounded-lg shadow-lg overflow-hidden">
          {modes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => { setEditorMode(mode.id); setOpen(false); }}
              className={cn(
                'w-full flex items-center gap-2.5 px-3 py-2.5 text-sm transition-colors',
                editorMode === mode.id
                  ? 'bg-accent text-foreground'
                  : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
              )}
            >
              {mode.icon}
              <span>{mode.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function LeftEditPanel() {
  const templatesOpen = useImageStore((s) => s.showTemplates);
  const setTemplatesOpen = useImageStore((s) => s.setShowTemplates);
  const editorMode = useImageStore((s) => s.editorMode);
  const [activeTab, setActiveTab] = React.useState<LeftTabType>('edit');

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
      if (e.key === 'Escape') setTemplatesOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [templatesOpen, setTemplatesOpen]);

  return (
    <div className="w-[240px] h-full bg-card flex flex-col overflow-hidden border-r border-border/40 relative shrink-0">
      {/* Mode Dropdown */}
      <div className="px-2.5 pt-2.5 pb-1 shrink-0">
        <ModeDropdown />
      </div>

      {/* Tab Navigation */}
      <div className="px-2.5 py-2.5 border-b border-border/30 shrink-0">
        <div className="flex gap-1 p-0.5 bg-muted/80 dark:bg-muted/50 rounded-lg border border-border/20">
          {leftTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center justify-center py-2 px-2 rounded-md',
                  'transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]',
                  isActive
                    ? 'bg-background dark:bg-accent text-foreground flex-[1.8] shadow-sm'
                    : 'text-muted-foreground hover:text-foreground flex-1'
                )}
              >
                <span className="shrink-0">{tab.icon}</span>
                <span
                  className={cn(
                    'text-[11px] font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]',
                    isActive
                      ? 'max-w-[60px] opacity-100 ml-1.5'
                      : 'max-w-0 opacity-0 ml-0'
                  )}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div
          className="p-3 transition-all duration-150 ease-out"
          style={{
            opacity: transitioning ? 0 : 1,
            transform: transitioning ? 'translateY(4px)' : 'translateY(0)',
          }}
        >
          {contentKey === 'edit' && (
            <div className="space-y-1">
              {editorMode === 'browser' ? (
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

          {contentKey === 'background' && (
            <div className="space-y-1">
              <BackgroundSection />
            </div>
          )}

          {contentKey === 'depth' && <DepthSection />}
        </div>
      </div>

      {/* Templates Overlay */}
      <div
        className={cn(
          'absolute inset-0 z-50 bg-card flex flex-col transition-all duration-300 ease-out',
          templatesOpen
            ? 'translate-x-0 opacity-100'
            : '-translate-x-full opacity-0 pointer-events-none'
        )}
      >
        <div className="flex items-center justify-between px-3 py-3 border-b border-border/30 shrink-0">
          <div className="flex items-center gap-2">
            <MagicWand01Icon size={16} className="text-primary" />
            <h2 className="text-sm font-semibold text-foreground">Templates</h2>
          </div>
          <button
            onClick={() => setTemplatesOpen(false)}
            className="flex items-center justify-center w-7 h-7 rounded-md hover:bg-muted transition-colors duration-150 text-muted-foreground hover:text-foreground"
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
