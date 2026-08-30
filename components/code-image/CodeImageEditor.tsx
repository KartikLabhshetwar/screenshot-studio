'use client';

import * as React from 'react';
import Link from 'next/link';
import { domToBlob } from 'modern-screenshot';
import { toast } from 'sonner';
import {
  ArrowLeft01Icon,
  Copy01Icon,
  Link01Icon,
  Download04Icon,
  Moon02Icon,
  Sun03Icon,
} from 'hugeicons-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { CodeFrame } from './CodeFrame';
import {
  CODE_THEMES,
  BACKGROUNDS,
  LANGUAGES,
  FONTS,
  GOOGLE_FONTS_URL,
  PADDING_OPTIONS,
  DEFAULT_STATE,
  type CodeImageState,
} from './code-themes';

const GOOGLE_FONTS_LINK_ID = 'code-image-google-fonts';
const HASH_WRITE_DELAY = 400;
const SCALE_OPTIONS = [1, 2, 3] as const;

function decodeState(hash: string): Partial<CodeImageState> | null {
  try {
    return JSON.parse(decodeURIComponent(atob(hash)));
  } catch (error) {
    console.warn('Could not parse code image state from URL', error);
    return null;
  }
}

function encodeState(state: CodeImageState): string {
  return btoa(encodeURIComponent(JSON.stringify(state)));
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label
        htmlFor={htmlFor}
        className="mb-1.5 text-xs font-medium text-muted-foreground"
      >
        {label}
      </Label>
      {children}
    </div>
  );
}

export function CodeImageEditor() {
  const [state, setState] = React.useState<CodeImageState>(DEFAULT_STATE);
  const [hydrated, setHydrated] = React.useState(false);
  const [exportScale, setExportScale] = React.useState(2);
  const [exporting, setExporting] = React.useState(false);
  const [copying, setCopying] = React.useState(false);
  const frameRef = React.useRef<HTMLDivElement>(null);

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

  const captureBlob = React.useCallback(async () => {
    if (!frameRef.current) return null;
    await document.fonts.ready;
    return domToBlob(frameRef.current, {
      scale: exportScale,
      filter: (el) => !(el instanceof HTMLTextAreaElement),
    });
  }, [exportScale]);

  const handleExport = React.useCallback(async () => {
    setExporting(true);
    try {
      const blob = await captureBlob();
      if (!blob) throw new Error('Export produced no image');
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'code-image.png';
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Image exported');
    } catch (error) {
      console.error('Code image export failed', error);
      toast.error('Could not export image');
    } finally {
      setExporting(false);
    }
  }, [captureBlob]);

  const handleCopyImage = React.useCallback(async () => {
    setCopying(true);
    try {
      const blob = await captureBlob();
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
  }, [captureBlob]);

  const handleCopyLink = React.useCallback(() => {
    navigator.clipboard.writeText(window.location.href).then(
      () => toast.success('Link copied'),
      () => toast.error('Could not copy link'),
    );
  }, []);

  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleExport();
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
  }, [handleExport, handleCopyImage]);

  return (
    <div className="flex h-screen flex-col bg-background">
      <header className="flex h-14 shrink-0 flex-wrap items-center justify-between gap-2 border-b border-border px-4">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft01Icon size={18} />
            Screenshot Studio
          </Link>
          <span className="h-4 w-px bg-border" aria-hidden />
          <span className="text-sm font-medium text-foreground">
            Code Images
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={String(exportScale)}
            onValueChange={(v) => setExportScale(Number(v))}
          >
            <SelectTrigger size="sm" aria-label="Export scale" className="w-16">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SCALE_OPTIONS.map((s) => (
                <SelectItem key={s} value={String(s)}>
                  {s}x
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCopyLink}
          >
            <Link01Icon size={16} />
            Copy link
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCopyImage}
            disabled={copying}
          >
            <Copy01Icon size={16} />
            {copying ? 'Copying…' : 'Copy image'}
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleExport}
            disabled={exporting}
          >
            <Download04Icon size={16} />
            {exporting ? 'Exporting…' : 'Export PNG'}
          </Button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <div className="min-w-0 flex-1 overflow-auto p-6 lg:p-10">
          <div className="m-auto w-fit">
            <CodeFrame
              ref={frameRef}
              editable
              code={state.code}
              onCodeChange={(code) => update({ code })}
              themeId={state.theme}
              lang={state.lang}
              bgId={state.bg}
              dark={state.dark}
              padding={state.padding}
              lineNumbers={state.lineNumbers}
              fontId={state.font}
              windowStyle={state.window}
              title={state.title}
            />
          </div>
        </div>

        <div className="w-full shrink-0 space-y-5 overflow-y-auto border-t border-border p-4 lg:w-80 lg:border-t-0 lg:border-l">
          <Field label="Theme" htmlFor="code-image-theme">
            <Select
              value={state.theme}
              onValueChange={(theme) => {
                const next = CODE_THEMES.find((t) => t.id === theme);
                update({ theme, bg: next?.background ?? state.bg });
              }}
            >
              <SelectTrigger id="code-image-theme" size="sm" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CODE_THEMES.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    <span
                      className="size-3 shrink-0 rounded-full border border-foreground/10"
                      style={{ background: t.swatch }}
                    />
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Background" htmlFor="code-image-bg">
            <Select value={state.bg} onValueChange={(bg) => update({ bg })}>
              <SelectTrigger id="code-image-bg" size="sm" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BACKGROUNDS.map((b) => (
                  <SelectItem key={b.id} value={b.id}>
                    <span
                      className="size-3 shrink-0 rounded-full border border-foreground/10"
                      style={{ background: b.css }}
                    />
                    {b.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Language" htmlFor="code-image-lang">
            <Select value={state.lang} onValueChange={(lang) => update({ lang })}>
              <SelectTrigger id="code-image-lang" size="sm" className="w-full">
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
          </Field>

          <Field label="Font" htmlFor="code-image-font">
            <Select value={state.font} onValueChange={(font) => update({ font })}>
              <SelectTrigger id="code-image-font" size="sm" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FONTS.map((f) => (
                  <SelectItem key={f.id} value={f.id}>
                    <span style={{ fontFamily: f.css }}>{f.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Appearance">
              <div role="group" aria-label="Appearance">
                <SegmentedControl
                  size="sm"
                  options={[
                    { id: 'dark', icon: <Moon02Icon size={14} />, ariaLabel: 'Dark' },
                    { id: 'light', icon: <Sun03Icon size={14} />, ariaLabel: 'Light' },
                  ]}
                  value={state.dark ? 'dark' : 'light'}
                  onChange={(v) => update({ dark: v === 'dark' })}
                />
              </div>
            </Field>

            <Field label="Line numbers">
              <div role="group" aria-label="Line numbers">
                <SegmentedControl
                  size="sm"
                  options={[
                    { id: 'on', label: 'On' },
                    { id: 'off', label: 'Off' },
                  ]}
                  value={state.lineNumbers ? 'on' : 'off'}
                  onChange={(v) => update({ lineNumbers: v === 'on' })}
                />
              </div>
            </Field>
          </div>

          <Field label="Padding">
            <div role="group" aria-label="Padding">
              <SegmentedControl
                size="sm"
                options={PADDING_OPTIONS.map((p) => ({
                  id: String(p),
                  label: String(p),
                }))}
                value={String(state.padding)}
                onChange={(v) => update({ padding: Number(v) })}
              />
            </div>
          </Field>

          <Field label="Window style">
            <div role="group" aria-label="Window style">
              <SegmentedControl
                size="sm"
                options={[
                  { id: 'none', label: 'None' },
                  { id: 'mac', label: 'macOS' },
                ]}
                value={state.window}
                onChange={(v) => update({ window: v as CodeImageState['window'] })}
              />
            </div>
          </Field>

          {state.window === 'mac' ? (
            <Field label="Window title" htmlFor="code-image-title">
              <Input
                id="code-image-title"
                value={state.title}
                onChange={(e) => update({ title: e.target.value })}
                placeholder="untitled"
                maxLength={60}
                className={cn('h-8 text-sm')}
              />
            </Field>
          ) : null}
        </div>
      </div>
    </div>
  );
}
