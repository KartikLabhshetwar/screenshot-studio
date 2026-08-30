'use client';

import * as React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter/dist/esm/light';
import bash from 'react-syntax-highlighter/dist/esm/languages/hljs/bash';
import cpp from 'react-syntax-highlighter/dist/esm/languages/hljs/cpp';
import csharp from 'react-syntax-highlighter/dist/esm/languages/hljs/csharp';
import css from 'react-syntax-highlighter/dist/esm/languages/hljs/css';
import go from 'react-syntax-highlighter/dist/esm/languages/hljs/go';
import java from 'react-syntax-highlighter/dist/esm/languages/hljs/java';
import javascript from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import json from 'react-syntax-highlighter/dist/esm/languages/hljs/json';
import kotlin from 'react-syntax-highlighter/dist/esm/languages/hljs/kotlin';
import markdown from 'react-syntax-highlighter/dist/esm/languages/hljs/markdown';
import php from 'react-syntax-highlighter/dist/esm/languages/hljs/php';
import python from 'react-syntax-highlighter/dist/esm/languages/hljs/python';
import ruby from 'react-syntax-highlighter/dist/esm/languages/hljs/ruby';
import rust from 'react-syntax-highlighter/dist/esm/languages/hljs/rust';
import sql from 'react-syntax-highlighter/dist/esm/languages/hljs/sql';
import swift from 'react-syntax-highlighter/dist/esm/languages/hljs/swift';
import typescript from 'react-syntax-highlighter/dist/esm/languages/hljs/typescript';
import xml from 'react-syntax-highlighter/dist/esm/languages/hljs/xml';
import yaml from 'react-syntax-highlighter/dist/esm/languages/hljs/yaml';
import { buildHljsStyle } from './hljs-theme';
import { resolveCodeBackground, type BackgroundSelection } from './code-backgrounds';
import {
  CODE_THEMES,
  FONTS,
  WINDOW_SURFACE_DARK,
  WINDOW_SURFACE_LIGHT,
  FRAME_WIDTH_MIN,
  FRAME_WIDTH_MAX,
  type WindowStyle,
} from './code-themes';

SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('cpp', cpp);
SyntaxHighlighter.registerLanguage('csharp', csharp);
SyntaxHighlighter.registerLanguage('css', css);
SyntaxHighlighter.registerLanguage('go', go);
SyntaxHighlighter.registerLanguage('java', java);
SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('json', json);
SyntaxHighlighter.registerLanguage('kotlin', kotlin);
SyntaxHighlighter.registerLanguage('markdown', markdown);
SyntaxHighlighter.registerLanguage('php', php);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('ruby', ruby);
SyntaxHighlighter.registerLanguage('rust', rust);
SyntaxHighlighter.registerLanguage('sql', sql);
SyntaxHighlighter.registerLanguage('swift', swift);
SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('html', xml);
SyntaxHighlighter.registerLanguage('xml', xml);
SyntaxHighlighter.registerLanguage('yaml', yaml);

const INTER = 'Inter, "Inter Fallback", Arial, Helvetica, sans-serif';
const FONT_SIZE = 14;
const LINE_HEIGHT = 1.6;

interface CodeFrameProps {
  code: string;
  onCodeChange?: (code: string) => void;
  themeId: string;
  lang: string;
  dark: boolean;
  showBackground: boolean;
  background: BackgroundSelection;
  padding: number;
  lineNumbers: boolean;
  fontId: string;
  windowStyle: WindowStyle;
  title: string;
  onTitleChange?: (title: string) => void;
  width: number;
  onWidthChange?: (width: number) => void;
  editable?: boolean;
}

function dotStyle(color: string): React.CSSProperties {
  return { width: 12, height: 12, borderRadius: '50%', backgroundColor: color };
}

function ResizeHandle({
  side,
  onResize,
}: {
  side: 'left' | 'right';
  onResize: (dx: number) => void;
}) {
  const startX = React.useRef(0);

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    startX.current = e.clientX;
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (e.buttons !== 1) return;
    const dx = e.clientX - startX.current;
    startX.current = e.clientX;
    onResize(side === 'left' ? -dx : dx);
  }

  return (
    <div
      role="slider"
      aria-label={`Resize frame from the ${side}`}
      aria-valuenow={0}
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      className="group absolute top-1/2 z-10 hidden h-10 w-4 -translate-y-1/2 cursor-ew-resize touch-none items-center justify-center outline-none lg:flex"
      style={side === 'left' ? { left: -8 } : { right: -8 }}
    >
      <span className="size-2.5 rounded-full bg-white/90 opacity-0 shadow-[0_1px_4px_rgba(0,0,0,0.4)] transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100" />
    </div>
  );
}

export const CodeFrame = React.forwardRef<HTMLDivElement, CodeFrameProps>(
  function CodeFrame(
    {
      code,
      onCodeChange,
      themeId,
      lang,
      dark,
      showBackground,
      background,
      padding,
      lineNumbers,
      fontId,
      windowStyle,
      title,
      onTitleChange,
      width,
      onWidthChange,
      editable = false,
    },
    ref,
  ) {
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);
    const [editingTitle, setEditingTitle] = React.useState(false);

    const theme = CODE_THEMES.find((t) => t.id === themeId) ?? CODE_THEMES[0];
    const tokens = dark ? theme.dark : theme.light;
    const isMonoLight = theme.id === 'mono' && !dark;

    const windowBg = dark ? WINDOW_SURFACE_DARK : WINDOW_SURFACE_LIGHT;
    const activeStyle = React.useMemo(
      () => buildHljsStyle(tokens, 'transparent'),
      [tokens],
    );

    const font = FONTS.find((f) => f.id === fontId) ?? FONTS[0];
    const ringColor = dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
    const gutterColor = dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)';
    const titleColor = dark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)';
    const caretColor = dark ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.85)';

    const resolvedBackground = React.useMemo(
      () => resolveCodeBackground(background, theme, dark),
      [background, theme, dark],
    );

    const lines = code.split('\n');

    function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
      if (e.key === 'Tab') {
        e.preventDefault();
        const el = e.currentTarget;
        const start = el.selectionStart;
        const end = el.selectionEnd;

        if (e.shiftKey) {
          const lineStart = code.lastIndexOf('\n', start - 1) + 1;
          const removable = code.slice(lineStart, lineStart + 2) === '  ' ? 2 : 0;
          if (removable) {
            const next = code.slice(0, lineStart) + code.slice(lineStart + removable);
            onCodeChange?.(next);
            requestAnimationFrame(() => {
              el.selectionStart = el.selectionEnd = Math.max(lineStart, start - removable);
            });
          }
          return;
        }

        const next = code.slice(0, start) + '  ' + code.slice(end);
        onCodeChange?.(next);
        requestAnimationFrame(() => {
          el.selectionStart = el.selectionEnd = start + 2;
        });
        return;
      }
      if (e.key === 'Escape') {
        e.currentTarget.blur();
      }
    }

    function resizeFromLeft(dx: number) {
      onWidthChange?.(Math.min(FRAME_WIDTH_MAX, Math.max(FRAME_WIDTH_MIN, width - dx)));
    }
    function resizeFromRight(dx: number) {
      onWidthChange?.(Math.min(FRAME_WIDTH_MAX, Math.max(FRAME_WIDTH_MIN, width + dx)));
    }

    return (
      <div
        ref={ref}
        className="relative transition-[background-color] duration-200 ease-out motion-reduce:transition-none"
        style={{
          backgroundImage: showBackground
            ? resolvedBackground.backgroundImage
            : dark
              ? 'linear-gradient(45deg, #222 25%, transparent 0), linear-gradient(-45deg, #222 25%, transparent 0), linear-gradient(45deg, transparent 75%, #222 0), linear-gradient(-45deg, transparent 75%, #222 0)'
              : 'linear-gradient(45deg, #eee 25%, transparent 0), linear-gradient(-45deg, #eee 25%, transparent 0), linear-gradient(45deg, transparent 75%, #eee 0), linear-gradient(-45deg, transparent 75%, #eee 0)',
          backgroundColor: showBackground ? resolvedBackground.backgroundColor : dark ? '#111' : '#fafafa',
          backgroundPosition: showBackground ? resolvedBackground.backgroundPosition : '0 0, 0 10px, 10px -10px, -10px 0',
          backgroundSize: showBackground ? resolvedBackground.backgroundSize : '20px 20px',
          backgroundRepeat: showBackground ? resolvedBackground.backgroundRepeat : undefined,
          padding: `${padding}px`,
        }}
      >
        <div
          className="relative mx-auto transition-[width,background-color] duration-200 ease-out motion-reduce:transition-none"
          style={{ width }}
        >
          {editable && onWidthChange ? (
            <>
              <ResizeHandle side="left" onResize={resizeFromLeft} />
              <ResizeHandle side="right" onResize={resizeFromRight} />
            </>
          ) : null}

          <div
            className="transition-colors duration-200 ease-out motion-reduce:transition-none"
            style={{
              position: 'relative',
              borderRadius: 12,
              overflow: 'hidden',
              backgroundColor: windowBg,
              boxShadow: `inset 0 0 0 1px ${ringColor}, 0 20px 60px -10px rgba(0,0,0,0.5), 0 8px 20px -8px rgba(0,0,0,0.4)`,
            }}
          >
            {windowStyle === 'mac' && (
              <div
                style={{
                  position: 'relative',
                  padding: '14px 18px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: `0 1px 0 ${ringColor}`,
                }}
              >
                <span style={dotStyle(isMonoLight ? '#d0d0d0' : '#ff5f57')} />
                <span style={dotStyle(isMonoLight ? '#d0d0d0' : '#febc2e')} />
                <span style={dotStyle(isMonoLight ? '#d0d0d0' : '#28c840')} />

                {editingTitle ? (
                  <input
                    autoFocus
                    value={title}
                    onChange={(e) => onTitleChange?.(e.target.value)}
                    onBlur={() => setEditingTitle(false)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === 'Escape') e.currentTarget.blur();
                    }}
                    maxLength={60}
                    placeholder="untitled"
                    className="absolute left-1/2 w-48 -translate-x-1/2 border-none bg-transparent text-center text-xs outline-none"
                    style={{ fontFamily: INTER, color: titleColor }}
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => onTitleChange && setEditingTitle(true)}
                    className="absolute left-1/2 -translate-x-1/2 truncate text-xs"
                    style={{ fontFamily: INTER, color: titleColor, cursor: onTitleChange ? 'text' : 'default' }}
                  >
                    {title || 'untitled'}
                  </button>
                )}
              </div>
            )}

            <div style={{ display: 'flex', padding: '20px 24px', overflow: 'hidden' }}>
              {lineNumbers ? (
                <div
                  aria-hidden
                  style={{
                    textAlign: 'right',
                    paddingRight: 16,
                    userSelect: 'none',
                    color: gutterColor,
                    fontFamily: font.css,
                    fontSize: FONT_SIZE,
                    lineHeight: LINE_HEIGHT,
                    flexShrink: 0,
                  }}
                >
                  {lines.map((_, i) => (
                    <div key={i}>{i + 1}</div>
                  ))}
                </div>
              ) : null}

              <div style={{ position: 'relative', overflowX: 'auto', flex: 1, minWidth: 0 }}>
                <SyntaxHighlighter
                  language={lang === 'auto' ? 'javascript' : lang}
                  style={activeStyle}
                  showLineNumbers={false}
                  wrapLines={false}
                  wrapLongLines={false}
                  customStyle={{
                    margin: 0,
                    padding: 0,
                    background: 'transparent',
                    fontSize: FONT_SIZE,
                    fontFamily: font.css,
                    lineHeight: LINE_HEIGHT,
                    whiteSpace: 'pre',
                    overflow: 'visible',
                  }}
                  codeTagProps={{
                    style: { fontFamily: font.css, background: 'transparent' },
                  }}
                >
                  {code || ' '}
                </SyntaxHighlighter>

                {editable ? (
                  <textarea
                    ref={textareaRef}
                    value={code}
                    onChange={(e) => onCodeChange?.(e.target.value)}
                    onKeyDown={handleKeyDown}
                    spellCheck={false}
                    autoCapitalize="off"
                    autoCorrect="off"
                    aria-label="Code editor"
                    className="absolute inset-0 resize-none bg-transparent outline-none"
                    style={{
                      color: 'transparent',
                      WebkitTextFillColor: 'transparent',
                      caretColor,
                      fontSize: FONT_SIZE,
                      fontFamily: font.css,
                      lineHeight: LINE_HEIGHT,
                      whiteSpace: 'pre',
                      overflow: 'hidden',
                      padding: 0,
                      border: 'none',
                      width: 'max-content',
                      minWidth: '100%',
                    }}
                  />
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
);
