import { CODE_THEME_SOURCES, type SyntaxPalette } from './code-themes-data';
import type { BackgroundSelection } from './code-backgrounds';

export interface CodeTheme {
  id: string;
  label: string;
  swatch: string;
  from: string;
  to: string;
  light: SyntaxPalette;
  dark: SyntaxPalette;
}

export const CODE_THEMES: CodeTheme[] = CODE_THEME_SOURCES.map((t) => ({
  id: t.id,
  label: t.name,
  swatch: t.from,
  from: t.from,
  to: t.to,
  light: t.light,
  dark: t.dark,
}));

export const WINDOW_SURFACE_DARK = 'rgba(0, 0, 0, 0.88)';
export const WINDOW_SURFACE_LIGHT = 'rgba(255, 255, 255, 0.95)';

export const LANGUAGES = [
  { id: 'auto', label: 'Auto' },
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
] as const;

export const FONTS = [
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
] as const;

export const GOOGLE_FONTS_URL =
  'https://fonts.googleapis.com/css2?family=JetBrains+Mono&family=Fira+Code&family=Source+Code+Pro&family=IBM+Plex+Mono&family=Space+Mono&family=Roboto+Mono&family=Ubuntu+Mono&family=Inconsolata&family=Anonymous+Pro&family=Cousine&display=swap';

export const PADDING_OPTIONS = [16, 32, 64, 128] as const;

export const FRAME_WIDTH_MIN = 520;
export const FRAME_WIDTH_MAX = 1200;
export const FRAME_WIDTH_DEFAULT = 700;

export const DEFAULT_CODE = `function leftPad(str: string, len: number, ch: string = ' ') {
  let pad = ''

  if (typeof len !== 'number') throw new TypeError('Expected a number')

  while (pad.length + str.length < len) {
    pad += ch
  }

  return pad + str
}`;

export type WindowStyle = 'none' | 'mac';

export interface CodeImageState {
  code: string;
  theme: string;
  lang: string;
  dark: boolean;
  showBackground: boolean;
  background: BackgroundSelection;
  padding: number;
  lineNumbers: boolean;
  font: string;
  window: WindowStyle;
  title: string;
  width: number;
}

export const DEFAULT_STATE: CodeImageState = {
  code: DEFAULT_CODE,
  theme: 'midnight',
  lang: 'typescript',
  dark: true,
  showBackground: true,
  background: { kind: 'theme', id: '' },
  padding: 64,
  lineNumbers: true,
  font: 'jetbrainsMono',
  window: 'mac',
  title: '',
  width: FRAME_WIDTH_DEFAULT,
};
