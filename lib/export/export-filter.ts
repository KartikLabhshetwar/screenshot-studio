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

export function cleanExportClone(node: Node): void {
  if (typeof (node as Element).getAttribute !== 'function') return;

  const root = node as HTMLElement;
  const deviceScreens = typeof root.querySelectorAll === 'function'
    ? Array.from(root.querySelectorAll<HTMLElement>('[data-export-clean-device-screen="true"]'))
    : [];
  const selectedElements = typeof root.querySelectorAll === 'function'
    ? Array.from(root.querySelectorAll<HTMLElement>('[data-export-clean-outline="true"]'))
    : [];

  if (root.getAttribute('data-export-clean-device-screen') === 'true') {
    deviceScreens.unshift(root);
  }

  if (root.getAttribute('data-export-clean-outline') === 'true') {
    selectedElements.unshift(root);
  }

  for (const element of deviceScreens) {
    element.classList.remove('ring-2', 'ring-primary', 'ring-offset-1', 'ring-offset-foreground/20');
    element.style.setProperty('box-shadow', 'none');
  }

  for (const element of selectedElements) {
    element.style.removeProperty('outline');
    element.style.removeProperty('outline-offset');
  }

  if (root.getAttribute('data-html-canvas') === 'true') {
    root.style.overflow = 'visible';
  }
}
