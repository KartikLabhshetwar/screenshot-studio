'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { domToBlob } from 'modern-screenshot';
import { toast } from 'sonner';
import {
  Copy01Icon,
  Link01Icon,
  Download04Icon,
  ArrowDown01Icon,
  InformationCircleIcon,
  CheckmarkCircle02Icon,
  Share01Icon,
  Settings02Icon,
} from 'hugeicons-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Drawer } from 'vaul';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { CodeFrame } from './CodeFrame';
import { BackgroundPicker } from './BackgroundPicker';
import type { BackgroundSelection } from './code-backgrounds';
import {
  CODE_THEMES,
  LANGUAGES,
  GOOGLE_FONTS_URL,
  PADDING_OPTIONS,
  FRAME_WIDTH_MIN,
  FRAME_WIDTH_MAX,
  DEFAULT_STATE,
  type CodeImageState,
  type WindowStyle,
} from './code-themes';

const GOOGLE_FONTS_LINK_ID = 'code-image-google-fonts';
const HASH_WRITE_DELAY = 400;
const SCALE_OPTIONS = [2, 4] as const;

function decodeState(hash: string): Partial<CodeImageState> | null {
  try {
    const parsed = JSON.parse(decodeURIComponent(atob(hash)));
    if (parsed.width) {
      parsed.width = Math.min(FRAME_WIDTH_MAX, Math.max(FRAME_WIDTH_MIN, parsed.width));
    }
    if (parsed.theme && !CODE_THEMES.some((t) => t.id === parsed.theme)) {
      parsed.theme = DEFAULT_STATE.theme;
    }
    return parsed;
  } catch (error) {
    console.warn('Could not parse code image state from URL', error);
    return null;
  }
}

function encodeState(state: CodeImageState): string {
  return btoa(encodeURIComponent(JSON.stringify(state)));
}

function ThemeSwatch({ color }: { color: string }) {
  return (
    <span
      className="size-3 shrink-0 rounded-full border border-white/10"
      style={{ background: color }}
    />
  );
}

interface TopBarProps {
  exportScale: number;
  onExportScaleChange: (scale: number) => void;
  exporting: boolean;
  justExported: boolean;
  copying: boolean;
  onExportPng: () => void;
  onCopyImage: () => void;
  onCopyUrl: () => void;
}

const TopBar = React.memo(function TopBar({
  exportScale,
  onExportScaleChange,
  exporting,
  justExported,
  copying,
  onExportPng,
  onCopyImage,
  onCopyUrl,
}: TopBarProps) {
  return (
    <header className="flex h-[50px] shrink-0 items-center justify-between gap-3 border-b border-white/[0.06] px-4">
      <div className="flex items-center gap-2">
        <Link
          href="/"
          aria-label="Open Screenshot Studio editor"
          className="shrink-0 transition-opacity hover:opacity-80"
        >
          <Image
            src="/logo-mark.png"
            alt="Screenshot Studio"
            width={28}
            height={28}
            className="h-7 w-7"
            priority
          />
        </Link>
        <span className="text-sm font-medium text-white/90">Code Images</span>
        <span className="hidden text-xs text-white/40 sm:inline">
          by Screenshot Studio
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button type="button" variant="ghost" size="sm" className="text-white/70 hover:bg-white/10 hover:text-white">
              <InformationCircleIcon size={16} />
              About
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Code Images</DialogTitle>
              <DialogDescription>
                Turn a code snippet into a beautiful, shareable image. Pick a
                theme, background, and window style, then export a crisp PNG.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-1.5 text-sm text-muted-foreground">
              <div className="flex items-center justify-between">
                <span>Export image</span>
                <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 text-xs">Cmd/Ctrl+S</kbd>
              </div>
              <div className="flex items-center justify-between">
                <span>Copy image</span>
                <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 text-xs">Cmd/Ctrl+Shift+C</kbd>
              </div>
              <div className="flex items-center justify-between">
                <span>Indent / dedent line</span>
                <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 text-xs">Tab / Shift+Tab</kbd>
              </div>
              <div className="flex items-center justify-between">
                <span>Exit editing</span>
                <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 text-xs">Esc</kbd>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <div className="hidden items-center lg:flex">
          <Button
            type="button"
            size="sm"
            onClick={onExportPng}
            disabled={exporting}
            className="rounded-r-none"
          >
            {justExported ? (
              <CheckmarkCircle02Icon size={16} />
            ) : (
              <Download04Icon size={16} />
            )}
            {justExported ? 'Exported' : exporting ? 'Exporting…' : `Export Image`}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                size="sm"
                aria-label="More export options"
                className="rounded-l-none border-l border-l-black/15 px-2"
              >
                <ArrowDown01Icon size={14} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onSelect={onExportPng}>
                <Download04Icon size={15} />
                Export PNG
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={onCopyImage} disabled={copying}>
                <Copy01Icon size={15} />
                {copying ? 'Copying…' : 'Copy Image'}
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={onCopyUrl}>
                <Link01Icon size={15} />
                Copy URL
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {SCALE_OPTIONS.map((scale) => (
                <DropdownMenuItem
                  key={scale}
                  onSelect={() => onExportScaleChange(scale)}
                >
                  <span
                    className={
                      exportScale === scale ? 'font-medium text-foreground' : ''
                    }
                  >
                    Export at {scale}x
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
});

interface BottomControlsProps {
  theme: string;
  onThemeChange: (theme: string) => void;
  dark: boolean;
  onDarkChange: (dark: boolean) => void;
  showBackground: boolean;
  onShowBackgroundChange: (show: boolean) => void;
  background: BackgroundSelection;
  onBackgroundChange: (background: BackgroundSelection) => void;
  lineNumbers: boolean;
  onLineNumbersChange: (on: boolean) => void;
  padding: number;
  onPaddingChange: (padding: number) => void;
  lang: string;
  onLangChange: (lang: string) => void;
  windowStyle: WindowStyle;
  onWindowStyleChange: (style: WindowStyle) => void;
}

const BottomControls = React.memo(function BottomControls({
  theme,
  onThemeChange,
  dark,
  onDarkChange,
  showBackground,
  onShowBackgroundChange,
  background,
  onBackgroundChange,
  lineNumbers,
  onLineNumbersChange,
  padding,
  onPaddingChange,
  lang,
  onLangChange,
  windowStyle,
  onWindowStyleChange,
  visible,
}: BottomControlsProps & { visible: boolean }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  const activeTheme = CODE_THEMES.find((t) => t.id === theme) ?? CODE_THEMES[0];

  return (
    <div
      className={`fixed bottom-6 left-1/2 z-20 w-max max-w-[calc(100vw-32px)] -translate-x-1/2 rounded-xl bg-[#1f1f1f]/95 shadow-2xl ring-1 ring-white/10 backdrop-blur transition-all duration-300 ease-out motion-reduce:transition-none ${
        mounted && visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
      }`}
    >
      <div className="scrollbar-none flex items-end gap-5 overflow-x-auto sm:overflow-visible px-4 py-3">
        <ControlField label="Theme">
          <Select value={theme} onValueChange={onThemeChange}>
            <SelectTrigger size="sm" className="w-[150px] border-white/10 bg-white/[0.04] text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CODE_THEMES.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  <ThemeSwatch color={t.swatch} />
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </ControlField>

        <Divider />

        <ControlField label="Background">
          <div className="flex items-center gap-2">
            <Switch checked={showBackground} onCheckedChange={onShowBackgroundChange} aria-label="Background" />
            <BackgroundPicker
              theme={activeTheme}
              dark={dark}
              background={background}
              onBackgroundChange={onBackgroundChange}
              disabled={!showBackground}
            />
          </div>
        </ControlField>

        <ControlField label="Dark mode">
          <Switch checked={dark} onCheckedChange={onDarkChange} aria-label="Dark mode" />
        </ControlField>

        <ControlField label="Line numbers">
          <Switch checked={lineNumbers} onCheckedChange={onLineNumbersChange} aria-label="Line numbers" />
        </ControlField>

        <Divider />

        <ControlField label="Padding">
          <SegmentedControl
            size="sm"
            className="w-[168px] bg-white/[0.04]"
            options={PADDING_OPTIONS.map((p) => ({ id: String(p), label: String(p) }))}
            value={String(padding)}
            onChange={(v) => onPaddingChange(Number(v))}
          />
        </ControlField>

        <ControlField label="Window">
          <SegmentedControl
            size="sm"
            className="w-20 bg-white/[0.04]"
            options={[
              { id: 'none', label: 'None' },
              { id: 'mac', label: 'Mac' },
            ]}
            value={windowStyle}
            onChange={(v) => onWindowStyleChange(v as WindowStyle)}
          />
        </ControlField>

        <Divider />

        <ControlField label="Language">
          <Select value={lang} onValueChange={onLangChange}>
            <SelectTrigger size="sm" className="w-[150px] border-white/10 bg-white/[0.04] text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((l) => (
                <SelectItem key={l.id} value={l.id}>
                  {l.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </ControlField>
      </div>
      <div className="mx-auto h-1 w-10 rounded-full bg-white/10" aria-hidden />
    </div>
  );
});

function Divider() {
  return <span className="mb-1.5 h-8 w-px shrink-0 bg-white/10" aria-hidden />;
}

function ControlField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex shrink-0 flex-col items-start gap-1.5">
      <span className="text-[10px] font-medium uppercase tracking-wide text-white/40">
        {label}
      </span>
      {children}
    </div>
  );
}

function MobileControlRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex min-h-[48px] items-center justify-between gap-4">
      <span className="text-base text-white/80">{label}</span>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

interface MobileActionBarProps {
  onCustomize: () => void;
  onShare: () => void;
  onExport: () => void;
  exporting: boolean;
  justExported: boolean;
}

const MobileActionBar = React.memo(function MobileActionBar({
  onCustomize,
  onShare,
  onExport,
  exporting,
  justExported,
}: MobileActionBarProps) {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-30 border-t border-white/[0.06] bg-[#1f1f1f]/95 backdrop-blur-lg"
      style={{ paddingBottom: 'max(8px, env(safe-area-inset-bottom, 0px))' }}
    >
      <div className="flex items-center gap-2 px-4 py-2.5">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onCustomize}
          className="text-white/70 hover:bg-white/10 hover:text-white"
        >
          <Settings02Icon size={18} />
          Customize
        </Button>
        <div className="flex-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onShare}
          className="text-white/70 hover:bg-white/10 hover:text-white"
        >
          <Share01Icon size={18} />
          Share
        </Button>
        <Button
          type="button"
          size="sm"
          onClick={onExport}
          disabled={exporting}
        >
          {justExported ? <CheckmarkCircle02Icon size={16} /> : <Download04Icon size={16} />}
          {justExported ? 'Exported' : exporting ? 'Exporting…' : 'Export'}
        </Button>
      </div>
    </div>
  );
});

interface MobileControlsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  theme: string;
  onThemeChange: (theme: string) => void;
  dark: boolean;
  onDarkChange: (dark: boolean) => void;
  showBackground: boolean;
  onShowBackgroundChange: (show: boolean) => void;
  background: BackgroundSelection;
  onBackgroundChange: (background: BackgroundSelection) => void;
  lineNumbers: boolean;
  onLineNumbersChange: (on: boolean) => void;
  padding: number;
  onPaddingChange: (padding: number) => void;
  lang: string;
  onLangChange: (lang: string) => void;
  windowStyle: WindowStyle;
  onWindowStyleChange: (style: WindowStyle) => void;
}

const MobileControlsDrawer = React.memo(function MobileControlsDrawer({
  open,
  onOpenChange,
  theme,
  onThemeChange,
  dark,
  onDarkChange,
  showBackground,
  onShowBackgroundChange,
  background,
  onBackgroundChange,
  lineNumbers,
  onLineNumbersChange,
  padding,
  onPaddingChange,
  lang,
  onLangChange,
  windowStyle,
  onWindowStyleChange,
}: MobileControlsDrawerProps) {
  const activeTheme = CODE_THEMES.find((t) => t.id === theme) ?? CODE_THEMES[0];

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-40 bg-black/40" />
        <Drawer.Content className="fixed inset-x-0 bottom-0 z-50 max-h-[80dvh] rounded-t-2xl bg-[#1f1f1f] text-white outline-none">
          <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-white/30" />
          <Drawer.Title className="sr-only">Customize</Drawer.Title>
          <div
            className="space-y-1 overflow-y-auto px-5 pt-4"
            style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom, 0px))' }}
          >
            <MobileControlRow label="Theme">
              <Select value={theme} onValueChange={onThemeChange}>
                <SelectTrigger size="sm" className="w-[160px] border-white/10 bg-white/[0.04] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CODE_THEMES.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      <ThemeSwatch color={t.swatch} />
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </MobileControlRow>

            <MobileControlRow label="Language">
              <Select value={lang} onValueChange={onLangChange}>
                <SelectTrigger size="sm" className="w-[160px] border-white/10 bg-white/[0.04] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((l) => (
                    <SelectItem key={l.id} value={l.id}>
                      {l.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </MobileControlRow>

            <div className="h-px bg-white/10" />

            <MobileControlRow label="Background">
              <div className="flex items-center gap-3">
                <BackgroundPicker
                  theme={activeTheme}
                  dark={dark}
                  background={background}
                  onBackgroundChange={onBackgroundChange}
                  disabled={!showBackground}
                />
                <Switch checked={showBackground} onCheckedChange={onShowBackgroundChange} />
              </div>
            </MobileControlRow>

            <MobileControlRow label="Dark mode">
              <Switch checked={dark} onCheckedChange={onDarkChange} />
            </MobileControlRow>

            <MobileControlRow label="Line numbers">
              <Switch checked={lineNumbers} onCheckedChange={onLineNumbersChange} />
            </MobileControlRow>

            <div className="h-px bg-white/10" />

            <MobileControlRow label="Padding">
              <SegmentedControl
                size="sm"
                className="w-[180px] bg-white/[0.04]"
                options={PADDING_OPTIONS.map((p) => ({ id: String(p), label: String(p) }))}
                value={String(padding)}
                onChange={(v) => onPaddingChange(Number(v))}
              />
            </MobileControlRow>

            <MobileControlRow label="Window">
              <SegmentedControl
                size="sm"
                className="w-[110px] bg-white/[0.04]"
                options={[
                  { id: 'none', label: 'None' },
                  { id: 'mac', label: 'Mac' },
                ]}
                value={windowStyle}
                onChange={(v) => onWindowStyleChange(v as WindowStyle)}
              />
            </MobileControlRow>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
});

export function CodeImageEditor() {
  const [state, setState] = React.useState<CodeImageState>(DEFAULT_STATE);
  const [hydrated, setHydrated] = React.useState(false);
  const [exportScale, setExportScale] = React.useState<number>(2);
  const [exporting, setExporting] = React.useState(false);
  const [justExported, setJustExported] = React.useState(false);
  const [copying, setCopying] = React.useState(false);
  const [stageVisible, setStageVisible] = React.useState(true);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [containerWidth, setContainerWidth] = React.useState(0);
  const isMobile = useIsMobile();
  const frameRef = React.useRef<HTMLDivElement>(null);
  const stageRef = React.useRef<HTMLElement>(null);

  const update = React.useCallback((patch: Partial<CodeImageState>) => {
    setState((s) => ({ ...s, ...patch }));
  }, []);

  React.useEffect(() => {
    if (!document.getElementById(GOOGLE_FONTS_LINK_ID)) {
      const link = document.createElement('link');
      link.id = GOOGLE_FONTS_LINK_ID;
      link.rel = 'stylesheet';
      link.href = GOOGLE_FONTS_URL;
      document.head.appendChild(link);
    }

    const hash = window.location.hash.slice(1);
    if (hash) {
      const decoded = decodeState(hash);
      if (decoded) {
        setState((s) => ({ ...s, ...decoded }));
      }
    }
    setHydrated(true);
  }, []);

  React.useEffect(() => {
    if (!hydrated) return;
    const timer = setTimeout(() => {
      window.history.replaceState(null, '', `#${encodeState(state)}`);
    }, HASH_WRITE_DELAY);
    return () => clearTimeout(timer);
  }, [state, hydrated]);

  const captureBlob = React.useCallback(async (scale: number) => {
    if (!frameRef.current) return null;
    await document.fonts.ready;
    return domToBlob(frameRef.current, {
      scale,
      filter: (el) => !(el instanceof HTMLTextAreaElement),
    });
  }, []);

  const handleExportPng = React.useCallback(async () => {
    setExporting(true);
    try {
      const blob = await captureBlob(exportScale);
      if (!blob) throw new Error('Export produced no image');
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${state.title || 'code-image'}.png`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Image exported');
      setJustExported(true);
      setTimeout(() => setJustExported(false), 1500);
    } catch (error) {
      console.error('Code image export failed', error);
      toast.error('Could not export image');
    } finally {
      setExporting(false);
    }
  }, [captureBlob, exportScale, state.title]);

  const handleCopyImage = React.useCallback(async () => {
    setCopying(true);
    try {
      const blob = await captureBlob(exportScale);
      if (!blob) throw new Error('Copy produced no image');
      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob }),
      ]);
      toast.success('Image copied to clipboard');
    } catch (error) {
      console.error('Code image copy failed', error);
      toast.error('Could not copy image');
    } finally {
      setCopying(false);
    }
  }, [captureBlob, exportScale]);

  const handleCopyUrl = React.useCallback(() => {
    navigator.clipboard.writeText(window.location.href).then(
      () => toast.success('URL copied'),
      () => toast.error('Could not copy URL'),
    );
  }, []);

  const handleShare = React.useCallback(async () => {
    try {
      const blob = await captureBlob(exportScale);
      if (blob) {
        const file = new File([blob], `${state.title || 'code-image'}.png`, { type: 'image/png' });
        if (navigator.canShare?.({ files: [file] })) {
          await navigator.share({ files: [file], title: state.title || 'Code Image' });
          return;
        }
      }
      if (navigator.share) {
        await navigator.share({ title: state.title || 'Code Image', url: window.location.href });
        return;
      }
      await navigator.clipboard.writeText(window.location.href);
      toast.success('URL copied to clipboard');
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        await navigator.clipboard.writeText(window.location.href).catch(() => {});
        toast.success('URL copied to clipboard');
      }
    }
  }, [captureBlob, exportScale, state.title]);

  React.useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const observer = new IntersectionObserver(
      ([entry]) => setStageVisible(entry.isIntersecting),
      { rootMargin: '0px 0px -110px 0px', threshold: 0 },
    );
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const observer = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width);
    });
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleExportPng();
      } else if (mod && e.shiftKey && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        handleCopyImage();
      } else if (e.key === 'Escape') {
        const active = document.activeElement;
        if (active instanceof HTMLElement) active.blur();
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleExportPng, handleCopyImage]);

  const frameTotal = state.width + state.padding * 2;
  const mobileScale = isMobile && containerWidth > 0 && containerWidth < frameTotal
    ? (containerWidth - 24) / frameTotal
    : 1;

  const onThemeChange = React.useCallback((theme: string) => update({ theme }), [update]);
  const onDarkChange = React.useCallback((dark: boolean) => update({ dark }), [update]);
  const onShowBackgroundChange = React.useCallback(
    (showBackground: boolean) => update({ showBackground }),
    [update],
  );
  const onBackgroundChange = React.useCallback(
    (background: BackgroundSelection) => update({ background }),
    [update],
  );
  const onLineNumbersChange = React.useCallback(
    (lineNumbers: boolean) => update({ lineNumbers }),
    [update],
  );
  const onPaddingChange = React.useCallback((padding: number) => update({ padding }), [update]);
  const onLangChange = React.useCallback((lang: string) => update({ lang }), [update]);
  const onWindowStyleChange = React.useCallback(
    (window: WindowStyle) => update({ window }),
    [update],
  );
  const onCodeChange = React.useCallback((code: string) => update({ code }), [update]);
  const onTitleChange = React.useCallback((title: string) => update({ title }), [update]);
  const onWidthChange = React.useCallback((width: number) => update({ width }), [update]);

  return (
    <div className="flex min-h-dvh flex-col bg-[#181818]">
      <TopBar
        exportScale={exportScale}
        onExportScaleChange={setExportScale}
        exporting={exporting}
        justExported={justExported}
        copying={copying}
        onExportPng={handleExportPng}
        onCopyImage={handleCopyImage}
        onCopyUrl={handleCopyUrl}
      />

      <main
        ref={stageRef}
        className="relative min-h-[calc(100dvh-50px)] flex-1 overflow-hidden lg:overflow-auto"
        style={{
          backgroundImage:
            'radial-gradient(ellipse at center, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0) 60%)',
        }}
      >
        <div className="mx-auto flex min-h-[calc(100dvh-50px)] min-w-fit items-center justify-center px-3 pb-24 pt-6 lg:px-6 lg:pb-32 lg:pt-10">
          <div
            style={mobileScale < 1 ? {
              transform: `scale(${mobileScale})`,
              transformOrigin: 'top center',
              width: frameTotal,
              height: (frameRef.current?.offsetHeight ?? 400) * mobileScale,
            } : undefined}
          >
            <CodeFrame
              ref={frameRef}
              editable
              code={state.code}
              onCodeChange={onCodeChange}
              themeId={state.theme}
              lang={state.lang}
              dark={state.dark}
              showBackground={state.showBackground}
              background={state.background}
              padding={state.padding}
              lineNumbers={state.lineNumbers}
              fontId={state.font}
              windowStyle={state.window}
              title={state.title}
              onTitleChange={onTitleChange}
              width={state.width}
              onWidthChange={isMobile ? undefined : onWidthChange}
            />
          </div>
        </div>
      </main>

      {isMobile ? (
        <>
          <MobileActionBar
            onCustomize={() => setDrawerOpen(true)}
            onShare={handleShare}
            onExport={handleExportPng}
            exporting={exporting}
            justExported={justExported}
          />
          <MobileControlsDrawer
            open={drawerOpen}
            onOpenChange={setDrawerOpen}
            theme={state.theme}
            onThemeChange={onThemeChange}
            dark={state.dark}
            onDarkChange={onDarkChange}
            showBackground={state.showBackground}
            onShowBackgroundChange={onShowBackgroundChange}
            background={state.background}
            onBackgroundChange={onBackgroundChange}
            lineNumbers={state.lineNumbers}
            onLineNumbersChange={onLineNumbersChange}
            padding={state.padding}
            onPaddingChange={onPaddingChange}
            lang={state.lang}
            onLangChange={onLangChange}
            windowStyle={state.window}
            onWindowStyleChange={onWindowStyleChange}
          />
        </>
      ) : (
        <BottomControls
          theme={state.theme}
          onThemeChange={onThemeChange}
          dark={state.dark}
          onDarkChange={onDarkChange}
          showBackground={state.showBackground}
          onShowBackgroundChange={onShowBackgroundChange}
          background={state.background}
          onBackgroundChange={onBackgroundChange}
          lineNumbers={state.lineNumbers}
          onLineNumbersChange={onLineNumbersChange}
          padding={state.padding}
          onPaddingChange={onPaddingChange}
          lang={state.lang}
          onLangChange={onLangChange}
          windowStyle={state.window}
          onWindowStyleChange={onWindowStyleChange}
          visible={stageVisible}
        />
      )}
    </div>
  );
}
