import type { CSSProperties } from 'react';
import {
  dracula,
  monokai,
  nord,
  gruvboxDark,
  atomOneDark,
  tomorrowNightBlue,
  androidstudio,
  nnfxDark,
  vs2015,
  vs,
  github,
  xcode,
  stackoverflowDark,
  stackoverflowLight,
} from 'react-syntax-highlighter/dist/esm/styles/hljs';

export interface CodeTheme {
  id: string;
  label: string;
  swatch: string;
  style: Record<string, CSSProperties>;
  altStyle?: Record<string, CSSProperties>;
  dark: boolean;
  background: string;
}

export const CODE_THEMES: CodeTheme[] = [
  { id: 'dracula', label: 'Dracula', swatch: '#282a36', style: dracula, dark: true, background: 'candy' },
  { id: 'monokai', label: 'Monokai', swatch: '#272822', style: monokai, dark: true, background: 'sunset' },
  { id: 'nord', label: 'Nord', swatch: '#2e3440', style: nord, dark: true, background: 'breeze' },
  { id: 'gruvbox', label: 'Gruvbox', swatch: '#282828', style: gruvboxDark, dark: true, background: 'forest' },
  { id: 'atomOne', label: 'Atom One Dark', swatch: '#282c34', style: atomOneDark, dark: true, background: 'midnight' },
  { id: 'tomorrowBlue', label: 'Tomorrow Night Blue', swatch: '#002451', style: tomorrowNightBlue, dark: true, background: 'aurora' },
  { id: 'androidStudio', label: 'Android Studio', swatch: '#282b2e', style: androidstudio, dark: true, background: 'rose' },
  { id: 'console', label: 'Console', swatch: '#333333', style: nnfxDark, dark: true, background: 'mono' },
  { id: 'vscode', label: 'VS Code', swatch: '#1e1e1e', style: vs2015, altStyle: vs, dark: true, background: 'vercel' },
  { id: 'github', label: 'GitHub', swatch: '#f8f8f8', style: github, dark: false, background: 'dawn' },
  { id: 'xcode', label: 'Xcode', swatch: '#ffffff', style: xcode, dark: false, background: 'dawn' },
  { id: 'stackoverflow', label: 'Stack Overflow', swatch: '#1c1b1b', style: stackoverflowDark, altStyle: stackoverflowLight, dark: true, background: 'midnight' },
];

export interface BackgroundPreset {
  id: string;
  label: string;
  swatch: string;
  css: string;
}

export const BACKGROUNDS: BackgroundPreset[] = [
  { id: 'none', label: 'Transparent', swatch: 'transparent', css: 'transparent' },
  { id: 'vercel', label: 'Vercel', swatch: '#3f3f46', css: 'linear-gradient(135deg, #18181b 0%, #3f3f46 100%)' },
  { id: 'candy', label: 'Candy', swatch: '#c084fc', css: 'linear-gradient(135deg, #f472b6 0%, #a855f7 100%)' },
  { id: 'breeze', label: 'Breeze', swatch: '#38bdf8', css: 'linear-gradient(135deg, #38bdf8 0%, #22d3ee 100%)' },
  { id: 'midnight', label: 'Midnight', swatch: '#1e3a8a', css: 'linear-gradient(160deg, #0f172a 0%, #1e3a8a 100%)' },
  { id: 'sunset', label: 'Sunset', swatch: '#fb923c', css: 'linear-gradient(135deg, #fb923c 0%, #ef4444 100%)' },
  { id: 'forest', label: 'Forest', swatch: '#4ade80', css: 'linear-gradient(135deg, #15803d 0%, #4ade80 100%)' },
  { id: 'mono', label: 'Mono', swatch: '#71717a', css: 'linear-gradient(135deg, #3f3f46 0%, #a1a1aa 100%)' },
  { id: 'dawn', label: 'Dawn', swatch: '#fca5a5', css: 'linear-gradient(135deg, #fde68a 0%, #fca5a5 100%)' },
  { id: 'aurora', label: 'Aurora', swatch: '#6366f1', css: 'linear-gradient(135deg, #2dd4bf 0%, #6366f1 100%)' },
  { id: 'rose', label: 'Rose', swatch: '#9f1239', css: 'linear-gradient(135deg, #be123c 0%, #581c87 100%)' },
];

export const LANGUAGES = [
  { id: 'auto', label: 'Auto-detect' },
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
];

export const GOOGLE_FONTS_URL =
  'https://fonts.googleapis.com/css2?family=JetBrains+Mono&family=Fira+Code&family=Source+Code+Pro&family=IBM+Plex+Mono&family=Space+Mono&family=Roboto+Mono&family=Ubuntu+Mono&family=Inconsolata&family=Anonymous+Pro&family=Cousine&display=swap';

export const PADDING_OPTIONS = [16, 32, 64, 128] as const;

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
  bg: string;
  dark: boolean;
  padding: number;
  lineNumbers: boolean;
  font: string;
  window: WindowStyle;
  title: string;
}

export const DEFAULT_STATE: CodeImageState = {
  code: DEFAULT_CODE,
  theme: 'vscode',
  lang: 'typescript',
  bg: 'vercel',
  dark: true,
  padding: 64,
  lineNumbers: true,
  font: 'jetbrainsMono',
  window: 'mac',
  title: '',
};
