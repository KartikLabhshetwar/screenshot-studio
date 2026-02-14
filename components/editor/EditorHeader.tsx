'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaXTwitter, FaGithub } from 'react-icons/fa6';
import { Button } from '@/components/ui/button';
import {
  Download04Icon,
  Copy01Icon,
  AspectRatioIcon,
} from 'hugeicons-react';
import { useEditorStore, useImageStore } from '@/lib/store';
import { useExport } from '@/hooks/useExport';
import { aspectRatios } from '@/lib/constants/aspect-ratios';
import { AspectRatioPicker } from '@/components/aspect-ratio/aspect-ratio-picker';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { ExportDialog } from '@/components/canvas/dialogs/ExportDialog';

export function EditorHeader() {
  const { screenshot } = useEditorStore();
  const { uploadedImageUrl, selectedAspectRatio } = useImageStore();
  const [aspectRatioOpen, setAspectRatioOpen] = React.useState(false);
  const [exportDialogOpen, setExportDialogOpen] = React.useState(false);

  const currentAspectRatio = aspectRatios.find((ar) => ar.id === selectedAspectRatio);
  const hasImage = !!screenshot.src;

  const {
    copyImage,
    isExporting,
    settings: exportSettings,
    exportImage,
    updateScale,
    updateFormat,
    updateQualityPreset,
  } = useExport(selectedAspectRatio);

  return (
    <>
      <header className="h-14 bg-surface-2 border-b border-border/40 flex items-center justify-between px-4 shrink-0">
        {/* Left - Logo */}
        <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
          <Image
            src="/logo.png"
            alt="Stage"
            width={28}
            height={28}
            className="h-7 w-7"
          />
          <span className="text-sm font-semibold text-foreground/90 hidden sm:block">Stage</span>
        </Link>

        {/* Center - Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setExportDialogOpen(true)}
            disabled={!hasImage}
            variant="outline"
            className="h-9 justify-center gap-2 rounded-lg font-medium px-4"
          >
            <Download04Icon size={16} />
            <span>Save</span>
          </Button>

          <Button
            onClick={() => copyImage()}
            disabled={!hasImage || isExporting}
            variant="outline"
            className="h-9 justify-center gap-2 rounded-lg font-medium px-4"
          >
            <Copy01Icon size={16} />
            <span>Copy</span>
          </Button>

          <Popover open={aspectRatioOpen} onOpenChange={setAspectRatioOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="h-9 justify-center gap-2 rounded-lg font-medium px-4 bg-muted/50"
              >
                <AspectRatioIcon size={16} />
                <span>{currentAspectRatio ? `${currentAspectRatio.width}:${currentAspectRatio.height}` : 'auto'}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-[420px] max-h-[600px]" align="center">
              <AspectRatioPicker onSelect={() => setAspectRatioOpen(false)} />
            </PopoverContent>
          </Popover>
        </div>

        {/* Right - Social Links */}
        <div className="flex items-center gap-1">
          <a
            href="https://github.com/KartikLabhshetwar/stage"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"
          >
            <FaGithub className="h-4 w-4" />
          </a>
          <a
            href="https://x.com/code_kartik"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"
          >
            <FaXTwitter className="h-4 w-4" />
          </a>
        </div>
      </header>

      <ExportDialog
        open={exportDialogOpen}
        onOpenChange={setExportDialogOpen}
        onExport={() => exportImage().then(() => {})}
        scale={exportSettings.scale}
        format={exportSettings.format}
        qualityPreset={exportSettings.qualityPreset}
        isExporting={isExporting}
        onScaleChange={updateScale}
        onFormatChange={updateFormat}
        onQualityPresetChange={updateQualityPreset}
      />
    </>
  );
}
