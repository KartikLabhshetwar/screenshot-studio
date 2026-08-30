import type { CSSProperties } from 'react';
import type { SyntaxPalette } from './code-themes-data';

function resolved(tokens: SyntaxPalette) {
  const fg = tokens.foreground;
  return {
    foreground: fg,
    constant: tokens.constant ?? fg,
    string: tokens.string ?? fg,
    comment: tokens.comment ?? fg,
    keyword: tokens.keyword ?? fg,
    parameter: tokens.parameter ?? fg,
    function: tokens.function ?? fg,
    stringExpression: tokens.stringExpression ?? tokens.string ?? fg,
    punctuation: tokens.punctuation ?? fg,
    link: tokens.link ?? tokens.constant ?? fg,
    number: tokens.number ?? fg,
    property: tokens.property ?? fg,
  };
}

export function buildHljsStyle(
  tokens: SyntaxPalette,
  background: string,
): Record<string, CSSProperties> {
  const t = resolved(tokens);

  return {
    hljs: { color: t.foreground, background },
    'hljs-comment': { color: t.comment, fontStyle: 'italic' },
    'hljs-quote': { color: t.comment, fontStyle: 'italic' },
    'hljs-doctag': { color: t.keyword, fontWeight: 'bold' },
    'hljs-keyword': { color: t.keyword },
    'hljs-formula': { color: t.keyword },
    'hljs-section': { color: t.function, fontWeight: 'bold' },
    'hljs-name': { color: t.function },
    'hljs-selector-tag': { color: t.keyword },
    'hljs-deletion': { color: '#f87171' },
    'hljs-subst': { color: t.stringExpression },
    'hljs-literal': { color: t.keyword },
    'hljs-string': { color: t.string },
    'hljs-regexp': { color: t.string },
    'hljs-addition': { color: t.string },
    'hljs-attribute': { color: t.property },
    'hljs-meta-string': { color: t.string },
    'hljs-built_in': { color: t.keyword },
    'hljs-class .hljs-title': { color: t.function },
    'hljs-attr': { color: t.property },
    'hljs-variable': { color: t.property },
    'hljs-template-variable': { color: t.property },
    'hljs-type': { color: t.keyword },
    'hljs-selector-class': { color: t.function },
    'hljs-selector-attr': { color: t.property },
    'hljs-selector-pseudo': { color: t.keyword },
    'hljs-number': { color: t.number },
    'hljs-symbol': { color: t.constant },
    'hljs-bullet': { color: t.constant },
    'hljs-link': { color: t.link, textDecoration: 'underline' },
    'hljs-meta': { color: t.constant },
    'hljs-selector-id': { color: t.function },
    'hljs-title': { color: t.function, fontWeight: 'bold' },
    'hljs-emphasis': { fontStyle: 'italic' },
    'hljs-strong': { fontWeight: 'bold' },
    'hljs-punctuation': { color: t.punctuation },
    'hljs-tag': { color: t.foreground },
  };
}
