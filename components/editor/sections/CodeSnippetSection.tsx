'use client';

import * as React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import {
  dracula,
  monokai,
  monokaiSublime,
  darcula,
  androidstudio,
  atomOneDark,
  githubGist,
  github,
  nord,
  tomorrowNightBlue,
  vs2015,
  gruvboxDark,
  xcode,
  vs,
  tomorrowNight,
  a11yDark,
  nnfxDark,
  stackoverflowDark,
  stackoverflowLight,
} from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { useImageStore } from '@/lib/store';
import { getAspectRatioPreset } from '@/lib/aspect-ratio-utils';
import { SectionWrapper } from './SectionWrapper';
import { cn } from '@/lib/utils';
import { domToCanvas } from 'modern-screenshot';
import { Loading03Icon } from 'hugeicons-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Max width of the off-screen render (px). Code wraps at this width.
const MAX_RENDER_WIDTH = 1200;

// Width at which the preview card renders before being scaled to fit the panel.
const PREVIEW_WIDTH = 500;

// ── Theme definitions ────────────────────────────────────────────────────────

interface ThemeOption {
  id: string;
  label: string;
  style: Record<string, React.CSSProperties>;
  dark: boolean;
}

const CODE_THEMES: ThemeOption[] = [
  { id: 'dracula', label: 'Dracula', style: dracula, dark: true },
  { id: 'monokai', label: 'Monokai', style: monokai, dark: true },
  { id: 'okaidia', label: 'Okaidia', style: monokaiSublime, dark: true },
  { id: 'darcula', label: 'Darcula', style: darcula, dark: true },
  { id: 'androidstudio', label: 'Android Studio', style: androidstudio, dark: true },
  { id: 'atomone', label: 'Atom One', style: atomOneDark, dark: true },
  { id: 'githubDark', label: 'GitHub Dark', style: githubGist, dark: true },
  { id: 'githubLight', label: 'GitHub Light', style: github, dark: false },
  { id: 'a11yDark', label: 'A11y Dark', style: a11yDark, dark: true },
  { id: 'nord', label: 'Nord', style: nord, dark: true },
  { id: 'tomorrowNightBlue', label: 'Tomorrow Blue', style: tomorrowNightBlue, dark: true },
  { id: 'vscodeDark', label: 'VS Code Dark', style: vs2015, dark: true },
  { id: 'gruvboxDark', label: 'Gruvbox Dark', style: gruvboxDark, dark: true },
  { id: 'consoleDark', label: 'Console Dark', style: nnfxDark, dark: true },
  { id: 'consoleLight', label: 'Console Light', style: vs, dark: false },
  { id: 'xcodeDark', label: 'Xcode Dark', style: xcode, dark: true },
  { id: 'xcodeLight', label: 'Xcode Light', style: xcode, dark: false },
  { id: 'stackDark', label: 'Stack Dark', style: stackoverflowDark, dark: true },
  { id: 'stackLight', label: 'Stack Light', style: stackoverflowLight, dark: false },
  { id: 'tomorrowNight', label: 'Tomorrow Night', style: tomorrowNight, dark: true },
];

const LANGUAGES = [
  { id: 'javascript', label: 'JavaScript' },
  { id: 'typescript', label: 'TypeScript' },
  { id: 'python', label: 'Python' },
  { id: 'html', label: 'HTML' },
  { id: 'css', label: 'CSS' },
  { id: 'java', label: 'Java' },
  { id: 'cpp', label: 'C++' },
  { id: 'csharp', label: 'C#' },
  { id: 'rust', label: 'Rust' },
  { id: 'go', label: 'Go' },
  { id: 'sql', label: 'SQL' },
  { id: 'json', label: 'JSON' },
  { id: 'xml', label: 'XML' },
  { id: 'markdown', label: 'Markdown' },
  { id: 'php', label: 'PHP' },
  { id: 'yaml', label: 'YAML' },
  { id: 'swift', label: 'Swift' },
  { id: 'kotlin', label: 'Kotlin' },
  { id: 'ruby', label: 'Ruby' },
  { id: 'bash', label: 'Bash' },
];

const FONTS = [
  { id: 'jetbrainsMono', label: 'JetBrains Mono', css: "'JetBrains Mono', monospace" },
  { id: 'firaCode', label: 'Fira Code', css: "'Fira Code', monospace" },
  { id: 'sourceCodePro', label: 'Source Code Pro', css: "'Source Code Pro', monospace" },
  { id: 'ibmPlexMono', label: 'IBM Plex Mono', css: "'IBM Plex Mono', monospace" },
  { id: 'spaceMono', label: 'Space Mono', css: "'Space Mono', monospace" },
  { id: 'robotoMono', label: 'Roboto Mono', css: "'Roboto Mono', monospace" },
  { id: 'ubuntuMono', label: 'Ubuntu Mono', css: "'Ubuntu Mono', monospace" },
  { id: 'inconsolata', label: 'Inconsolata', css: "'Inconsolata', monospace" },
  { id: 'anonymousPro', label: 'Anonymous Pro', css: "'Anonymous Pro', monospace" },
  { id: 'cousine', label: 'Cousine', css: "'Cousine', monospace" },
];

const GOOGLE_FONTS_URL =
  'https://fonts.googleapis.com/css2?family=JetBrains+Mono&family=Fira+Code&family=Source+Code+Pro&family=IBM+Plex+Mono&family=Space+Mono&family=Roboto+Mono&family=Ubuntu+Mono&family=Inconsolata&family=Anonymous+Pro&family=Cousine&display=swap';

const DEFAULT_CODE = `function greet(name) {
  return \`Hello, \${name}!\`
}

console.log(greet('World'))`;

// ── Styled Select ─────────────────────────────────────────────────────────────

function StyledSelect({
  value,
  onChange,
  options,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { id: string; label: string }[];
  className?: string;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        size="sm"
        className={cn(
          'w-full h-8 px-2.5 text-[11px] font-medium cursor-pointer',
          'border-foreground/10 bg-foreground/[0.04] text-foreground shadow-none',
          'hover:bg-foreground/[0.06] hover:border-foreground/20',
          'focus-visible:border-foreground/25 focus-visible:ring-1 focus-visible:ring-foreground/15',
          '[&_svg]:size-3.5 [&_svg]:opacity-60',
          className
        )}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent
        position="popper"
        align="start"
        className="max-h-56 border-foreground/10 bg-card"
      >
        {options.map((opt) => (
          <SelectItem
            key={opt.id}
            value={opt.id}
            className="text-xs rounded-md cursor-pointer focus:bg-foreground/[0.08] focus:text-foreground data-[highlighted]:bg-foreground/[0.08] data-[highlighted]:text-foreground"
          >
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

// ── Component ────────────────────────────────────────────────────────────────

type Status = 'idle' | 'capturing';

export function CodeSnippetSection() {
  const { setUploadedImageUrl, setImageOpacity, setImageScale, setBorderRadius: setCanvasBorderRadius, selectedAspectRatio } = useImageStore();

  const [code, setCode] = React.useState(DEFAULT_CODE);
  const [language, setLanguage] = React.useState('javascript');
  const [themeId, setThemeId] = React.useState('dracula');
  const [fontId, setFontId] = React.useState('jetbrainsMono');
  const [showLineNumbers, setShowLineNumbers] = React.useState(true);
  const [showTitleBar, setShowTitleBar] = React.useState(true);
  const [status, setStatus] = React.useState<Status>('idle');
  const [showSettings, setShowSettings] = React.useState(false);

  const hiddenCaptureRef = React.useRef<HTMLDivElement>(null);
  const previewRef = React.useRef<HTMLDivElement>(null);
  const previewWrapperRef = React.useRef<HTMLDivElement>(null);
  const [previewScale, setPreviewScale] = React.useState(1);
  const [cardHeight, setCardHeight] = React.useState(0);

  const currentTheme = CODE_THEMES.find((t) => t.id === themeId) ?? CODE_THEMES[0];
  const currentFont = FONTS.find((f) => f.id === fontId) ?? FONTS[0];
  const themeBg =
    (currentTheme.style.hljs?.background as string) || '#282a36';

  const fontSize = 14;
  const borderRadius = 12;

  // Load Google Fonts
  React.useEffect(() => {
    if (document.querySelector('link[data-code-fonts]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = GOOGLE_FONTS_URL;
    link.setAttribute('data-code-fonts', 'true');
    document.head.appendChild(link);
  }, []);

  // Scale preview to fit panel width
  React.useEffect(() => {
    if (!previewWrapperRef.current) return;
    const el = previewWrapperRef.current;
    const update = () => setPreviewScale(el.clientWidth / PREVIEW_WIDTH);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Measure card height for proper container sizing
  React.useEffect(() => {
    if (!previewRef.current) return;
    const el = previewRef.current;
    const update = () => setCardHeight(el.scrollHeight);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [code, themeId, language, showLineNumbers, showTitleBar, fontId]);

  const handleAddToCanvas = React.useCallback(async () => {
    if (!hiddenCaptureRef.current || status === 'capturing') return;
    setStatus('capturing');

    try {
      const preset = getAspectRatioPreset(selectedAspectRatio);
      const targetWidth = preset?.width || 1920;

      // Measure actual content width of the fit-content code window
      const actualWidth = hiddenCaptureRef.current.offsetWidth;
      // Scale so the captured image is high-res (at least targetWidth pixels)
      const captureScale = Math.max(2, targetWidth / actualWidth);

      const canvas = await domToCanvas(hiddenCaptureRef.current, {
        scale: captureScale,
        backgroundColor: themeBg,
      });

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, 'image/png')
      );

      if (blob) {
        const url = URL.createObjectURL(blob);
        setUploadedImageUrl(url, 'code-snippet.png');
        setImageOpacity(1);
        setImageScale(100);
        setCanvasBorderRadius(0); // Border radius is baked into the capture
        setStatus('idle');
      } else {
        setStatus('idle');
      }
    } catch (e) {
      console.error('Code capture failed:', e);
      setStatus('idle');
    }
  }, [setUploadedImageUrl, setImageOpacity, setImageScale, setCanvasBorderRadius, status, themeBg, selectedAspectRatio]);

  return (
    <>
    <SectionWrapper title="Add Code" defaultOpen={false}>
      <div className="space-y-2.5">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          rows={4}
          spellCheck={false}
          placeholder="Paste your code here..."
          className="w-full px-3 py-2.5 rounded-md border border-foreground/10 bg-foreground/[0.04] text-[11px] text-foreground font-mono placeholder:text-muted-foreground/50 resize-y focus:outline-none focus:border-foreground/25 leading-relaxed transition-colors"
        />

        <div className="grid grid-cols-2 gap-1.5 p-1">
          <StyledSelect
            value={themeId}
            onChange={setThemeId}
            options={CODE_THEMES}
          />
          <StyledSelect
            value={language}
            onChange={setLanguage}
            options={LANGUAGES}
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowLineNumbers(!showLineNumbers)}
            className={cn(
              'flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[10px] font-medium border transition-colors cursor-pointer',
              showLineNumbers
                ? 'bg-foreground/[0.1] border-foreground/25 text-foreground'
                : 'bg-foreground/[0.04] border-foreground/10 text-muted-foreground hover:text-foreground hover:bg-foreground/[0.06]'
            )}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 3h1M2 6h1M2 9h1M5 3h5M5 6h5M5 9h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>
            Lines
          </button>
          <button
            type="button"
            onClick={() => setShowTitleBar(!showTitleBar)}
            className={cn(
              'flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[10px] font-medium border transition-colors cursor-pointer',
              showTitleBar
                ? 'bg-foreground/[0.1] border-foreground/25 text-foreground'
                : 'bg-foreground/[0.04] border-foreground/10 text-muted-foreground hover:text-foreground hover:bg-foreground/[0.06]'
            )}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="3" cy="6" r="1" fill="currentColor"/><circle cx="6" cy="6" r="1" fill="currentColor"/><circle cx="9" cy="6" r="1" fill="currentColor"/></svg>
            Window
          </button>

          <div className="flex-1" />

          <button
            type="button"
            onClick={() => setShowSettings(!showSettings)}
            className={cn(
              'text-[10px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer',
              showSettings && 'text-foreground'
            )}
          >
            {showSettings ? 'Less' : 'Font'}
          </button>
        </div>

        {showSettings && (
          <StyledSelect
            value={fontId}
            onChange={setFontId}
            options={FONTS}
          />
        )}

        <div
          ref={previewWrapperRef}
          className="overflow-hidden rounded-md border border-foreground/10"
          style={{ height: cardHeight > 0 ? `${cardHeight * previewScale}px` : undefined }}
        >
          <div
            ref={previewRef}
            style={{
              width: `${PREVIEW_WIDTH}px`,
              transform: `scale(${previewScale})`,
              transformOrigin: 'top left',
              borderRadius: `${borderRadius}px`,
              overflow: 'hidden',
              backgroundColor: themeBg,
            }}
          >
            {showTitleBar && (
              <div
                style={{
                  backgroundColor: themeBg,
                  padding: '10px 14px 0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#ff5f57' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#febc2e' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#28c840' }} />
              </div>
            )}

            <SyntaxHighlighter
              language={language}
              style={currentTheme.style}
              showLineNumbers={showLineNumbers}
              wrapLines
              wrapLongLines
              customStyle={{
                margin: 0,
                padding: showTitleBar ? '12px 16px 16px' : '16px',
                fontSize: `${fontSize}px`,
                fontFamily: currentFont.css,
                lineHeight: '1.6',
                borderRadius: 0,
              }}
              lineNumberStyle={{
                minWidth: '2em',
                paddingRight: '0.8em',
                opacity: 0.4,
                fontFamily: currentFont.css,
              }}
            >
              {code || ' '}
            </SyntaxHighlighter>
          </div>
        </div>

        <button
          onClick={handleAddToCanvas}
          disabled={status === 'capturing' || !code.trim()}
          className="w-full h-8 rounded-md text-xs font-medium border border-foreground/15 bg-foreground/[0.04] text-foreground hover:bg-foreground/[0.08] hover:border-foreground/25 disabled:opacity-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          {status === 'capturing' ? (
            <>
              <Loading03Icon size={12} className="animate-spin" />
              Adding...
            </>
          ) : (
            'Add to Canvas'
          )}
        </button>
      </div>
    </SectionWrapper>

    <div
      aria-hidden
      style={{
        position: 'fixed',
        left: '-99999px',
        top: 0,
        pointerEvents: 'none',
        zIndex: -1,
      }}
    >
      <div
        ref={hiddenCaptureRef}
        style={{
          width: 'fit-content',
          maxWidth: `${MAX_RENDER_WIDTH}px`,
          borderRadius: `${borderRadius}px`,
          overflow: 'hidden',
          backgroundColor: themeBg,
        }}
      >
        {showTitleBar && (
          <div
            style={{
              backgroundColor: themeBg,
              padding: '16px 24px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <div style={{ width: 14, height: 14, borderRadius: '50%', backgroundColor: '#ff5f57' }} />
            <div style={{ width: 14, height: 14, borderRadius: '50%', backgroundColor: '#febc2e' }} />
            <div style={{ width: 14, height: 14, borderRadius: '50%', backgroundColor: '#28c840' }} />
          </div>
        )}

        <SyntaxHighlighter
          language={language}
          style={currentTheme.style}
          showLineNumbers={showLineNumbers}
          wrapLines
          wrapLongLines
          customStyle={{
            margin: 0,
            padding: showTitleBar ? '16px 28px 28px' : '28px',
            fontSize: `${fontSize}px`,
            fontFamily: currentFont.css,
            lineHeight: '1.6',
            borderRadius: 0,
          }}
          lineNumberStyle={{
            minWidth: '2em',
            paddingRight: '0.8em',
            opacity: 0.4,
            fontFamily: currentFont.css,
          }}
        >
          {code || ' '}
        </SyntaxHighlighter>
      </div>
    </div>
    </>
  );
}
