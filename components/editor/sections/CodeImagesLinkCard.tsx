import Link from 'next/link';
import { SourceCodeIcon, ArrowRight01Icon } from 'hugeicons-react';

export function CodeImagesLinkCard() {
  return (
    <div className="mb-1 px-2">
      <Link
        href="/code"
        className="flex items-center gap-3 rounded-md border border-foreground/10 bg-foreground/[0.04] px-3 py-3 transition-colors hover:bg-foreground/[0.08]"
      >
        <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-foreground/[0.06] text-foreground">
          <SourceCodeIcon size={18} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-medium text-foreground">
            Code Images
          </span>
          <span className="block truncate text-xs text-muted-foreground">
            Turn code into beautiful shareable images
          </span>
        </span>
        <ArrowRight01Icon
          size={16}
          className="shrink-0 text-muted-foreground"
          aria-hidden
        />
      </Link>
    </div>
  );
}
