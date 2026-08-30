'use client';

import * as React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { CODE_THEMES, BACKGROUNDS, FONTS, type WindowStyle } from './code-themes';

const INTER = 'Inter, "Inter Fallback", Arial, Helvetica, sans-serif';
const FONT_SIZE = 14;
const LINE_HEIGHT = 1.6;

interface CodeFrameProps {
  code: string;
  onCodeChange?: (code: string) => void;
  themeId: string;
  lang: string;
  bgId: string;
  dark: boolean;
  padding: number;
  lineNumbers: boolean;
  fontId: string;
  windowStyle: WindowStyle;
  title: string;
  editable?: boolean;
}

function dotStyle(color: string): React.CSSProperties {
  return { width: 12, height: 12, borderRadius: '50%', backgroundColor: color };
}

export const CodeFrame = React.forwardRef<HTMLDivElement, CodeFrameProps>(
  function CodeFrame(
    {
      code,
      onCodeChange,
      themeId,
      lang,
      bgId,
      dark,
      padding,
      lineNumbers,
      fontId,
      windowStyle,
      title,
      editable = false,
    },
    ref,
  ) {
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

    const theme = CODE_THEMES.find((t) => t.id === themeId) ?? CODE_THEMES[0];
    const activeStyle =
      dark === theme.dark || !theme.altStyle ? theme.style : theme.altStyle;
    const themeBg =
      (activeStyle.hljs?.background as string) ||
      (dark ? '#1e1e1e' : '#ffffff');
    const bg = BACKGROUNDS.find((b) => b.id === bgId) ?? BACKGROUNDS[0];
    const font = FONTS.find((f) => f.id === fontId) ?? FONTS[0];
    const ringColor = dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
    const gutterColor = dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)';
    const titleColor = dark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)';
    const caretColor = dark ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.85)';

    const lines = code.split('\n');

    function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
      if (e.key === 'Tab') {
        e.preventDefault();
        const el = e.currentTarget;
        const start = el.selectionStart;
        const end = el.selectionEnd;
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

    return (
      <div
        ref={ref}
        className="transition-[background] duration-300 motion-reduce:transition-none"
        style={{ background: bg.css, padding: `${padding}px` }}
      >
        <div
          className="transition-colors duration-300 motion-reduce:transition-none"
          style={{
            position: 'relative',
            borderRadius: 12,
            overflow: 'hidden',
            backgroundColor: themeBg,
            boxShadow: `inset 0 0 0 1px ${ringColor}, 0 30px 60px -20px rgba(0,0,0,0.5), 0 10px 20px -10px rgba(0,0,0,0.35)`,
          }}
        >
          {windowStyle === 'mac' && (
            <div
              style={{
                position: 'relative',
                backgroundColor: themeBg,
                padding: '14px 18px 0',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <span style={dotStyle('#ff5f57')} />
              <span style={dotStyle('#febc2e')} />
              <span style={dotStyle('#28c840')} />
              {title ? (
                <span
                  style={{
                    position: 'absolute',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontFamily: INTER,
                    fontSize: 12,
                    color: titleColor,
                  }}
                >
                  {title}
                </span>
              ) : null}
            </div>
          )}

          <div style={{ display: 'flex', padding: '20px 24px' }}>
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
                }}
              >
                {lines.map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>
            ) : null}

            <div style={{ position: 'relative' }}>
              <SyntaxHighlighter
                language={lang === 'auto' ? undefined : lang}
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
                  }}
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  },
);
