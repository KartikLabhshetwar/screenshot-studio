/**
 * Returns whether a DOM node belongs in a rendered export.
 *
 * Export-only controls are explicitly marked so the live editor can keep its
 * interaction affordances without rasterizing them into downloaded output.
 */
export function shouldIncludeInExport(node: Node): boolean {
  if (typeof (node as Element).getAttribute !== 'function') return true;

  const element = node as Element;

  return (
    element.getAttribute('data-resize-handle') !== 'true' &&
    element.getAttribute('data-blur-region') !== 'true' &&
    element.getAttribute('data-export-exclude') !== 'true' &&
    !element.classList?.contains('moveable-control-box')
  );
}

/** Remove editor-only styles from cloned content without changing live UI. */
export function cleanExportClone(node: Node): void {
  if (typeof (node as Element).getAttribute !== 'function') return;

  const root = node as HTMLElement;
  const selectedElements = typeof root.querySelectorAll === 'function'
    ? Array.from(root.querySelectorAll<HTMLElement>('[data-export-clean-outline="true"]'))
    : [];

  if (root.getAttribute('data-export-clean-outline') === 'true') {
    selectedElements.unshift(root);
  }

  for (const element of selectedElements) {
    element.style.removeProperty('outline');
    element.style.removeProperty('outline-offset');
  }

  if (root.getAttribute('data-html-canvas') === 'true') {
    root.style.overflow = 'visible';
  }
}
