'use client';

import * as React from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Image01Icon,
  Camera01Icon,
  CommandIcon,
  Globe02Icon,
  Loading03Icon,
} from 'hugeicons-react';
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE } from '@/lib/constants';
import { useEditorStore, useImageStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { gradientColors, type GradientKey } from '@/lib/constants/gradient-colors';
import { solidColors, type SolidColorKey } from '@/lib/constants/solid-colors';
import { getCldImageUrl } from '@/lib/cloudinary';
import { cloudinaryPublicIds } from '@/lib/cloudinary-backgrounds';

export function CleanUploadState() {
  const [isDragActive, setIsDragActive] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [screenshotUrl, setScreenshotUrl] = React.useState('');
  const [isCapturing, setIsCapturing] = React.useState(false);

  const { setScreenshot } = useEditorStore();
  const { addImages, setImage, backgroundConfig } = useImageStore();
  const containerRef = React.useRef<HTMLDivElement>(null);

  const getBackgroundStyle = (): React.CSSProperties => {
    const { type, value } = backgroundConfig;

    if (type === 'gradient' && value && gradientColors[value as GradientKey]) {
      return { background: gradientColors[value as GradientKey] };
    }

    if (type === 'solid' && value && solidColors[value as SolidColorKey]) {
      return { backgroundColor: solidColors[value as SolidColorKey] };
    }

    if (type === 'image' && value) {
      const isCloudinary = cloudinaryPublicIds.includes(value);
      const imageUrl = isCloudinary
        ? getCldImageUrl({ src: value, width: 1920, height: 1080, quality: 'auto', format: 'auto', crop: 'fill', gravity: 'auto' })
        : value;
      return { backgroundImage: `url(${imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' };
    }

    return { background: gradientColors.vibrant_orange_pink };
  };

  const validateFile = React.useCallback((file: File): string | null => {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return `File type not supported. Please use: PNG, JPG, WEBP`;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      return `File size too large. Maximum size is ${MAX_IMAGE_SIZE / 1024 / 1024}MB`;
    }
    return null;
  }, []);

  const handleFile = React.useCallback(
    (file: File) => {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }
      setError(null);
      const imageUrl = URL.createObjectURL(file);
      setScreenshot({ src: imageUrl });
    },
    [validateFile, setScreenshot]
  );

  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      if (!acceptedFiles.length) return;
      addImages(acceptedFiles);
      handleFile(acceptedFiles[0]);
    },
    [addImages, handleFile]
  );

  const {
    getRootProps,
    getInputProps,
    isDragActive: dropzoneActive,
    open,
  } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    },
    maxSize: MAX_IMAGE_SIZE,
    multiple: true,
    noClick: true,
    onDragEnter: () => { setIsDragActive(true); setError(null); },
    onDragLeave: () => setIsDragActive(false),
    onDropRejected: (rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0];
        if (rejection.errors.some((e) => e.code === 'file-too-large')) {
          setError(`File size too large. Maximum size is ${MAX_IMAGE_SIZE / 1024 / 1024}MB`);
        } else if (rejection.errors.some((e) => e.code === 'file-invalid-type')) {
          setError('File type not supported. Please use: PNG, JPG, WEBP');
        } else {
          setError('Failed to upload file. Please try again.');
        }
      }
    },
  });

  React.useEffect(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      if (!containerRef.current) return;
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.startsWith('image/')) {
          e.preventDefault();
          const file = item.getAsFile();
          if (file) {
            addImages([file]);
            handleFile(file);
          }
          break;
        }
      }
    };
    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [addImages, handleFile]);

  const handleCaptureScreenshot = async () => {
    if (!screenshotUrl.trim()) {
      setError('Please enter a URL');
      return;
    }
    let finalUrl = screenshotUrl.trim();
    if (!finalUrl.match(/^https?:\/\//i)) {
      finalUrl = `https://${finalUrl}`;
    }
    setIsCapturing(true);
    setError(null);
    try {
      const response = await fetch('/api/screenshot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: finalUrl, deviceType: 'desktop' }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to capture screenshot');
      let base64Data = data.screenshot.trim();
      if (base64Data.includes(',')) base64Data = base64Data.split(',')[1];
      base64Data = base64Data.replace(/\s/g, '');
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/png' });
      const blobUrl = URL.createObjectURL(blob);
      const file = new File([blob], 'screenshot.png', { type: 'image/png' });
      setScreenshot({ src: blobUrl });
      setImage(file);
      setScreenshotUrl('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to capture screenshot');
    } finally {
      setIsCapturing(false);
    }
  };

  const active = isDragActive || dropzoneActive;

  return (
    <div
      ref={containerRef}
      {...getRootProps()}
      className="relative w-full h-full flex items-center justify-center"
      style={getBackgroundStyle()}
    >
      <input {...getInputProps()} />

      {/* Upload Card with Shadow */}
      <div
        className={cn(
          'relative rounded-2xl p-10 md:p-12',
          'flex flex-col items-center justify-center text-center',
          'bg-surface-3/95 backdrop-blur-md',
          'border border-border/50',
          'cursor-pointer transition-all duration-300 ease-out',
          'hover:scale-[1.01] hover:border-border',
          'min-w-[320px] md:min-w-[400px]',
          active && 'scale-[1.02] border-foreground/30',
          // Shadow with depth
          'shadow-[0_8px_32px_rgba(0,0,0,0.6),0_16px_64px_rgba(0,0,0,0.5)]'
        )}
        onClick={open}
      >
        {/* Icon */}
        <div className="mb-6 p-5 rounded-2xl bg-surface-4/60 border border-border/50">
          <Image01Icon size={40} className="text-text-secondary" />
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-foreground mb-2">
          {active ? 'Drop the image here...' : 'Add Your Image'}
        </h2>

        {/* Subtitle */}
        {!active && (
          <p className="text-sm text-text-tertiary mb-6">
            Drag & drop, click to browse, or paste
          </p>
        )}

        {/* Paste Hint */}
        {!active && (
          <div className="flex flex-col gap-5 items-center">
            <div className="hidden sm:flex items-center gap-2 text-sm text-text-secondary">
              <kbd className="bg-surface-2/80 border border-border/60 px-2.5 py-1.5 rounded-lg font-medium text-foreground/80 text-xs">
                <span className="flex items-center gap-1">
                  <CommandIcon size={14} />V
                </span>
              </kbd>
              <span>to Paste</span>
            </div>

            <span className="sm:hidden text-sm font-medium text-text-secondary">
              Tap to browse
            </span>

            <div className="flex items-center gap-3 w-full max-w-[180px]">
              <div className="flex-1 h-px bg-border/50" />
              <span className="text-xs text-text-muted">or</span>
              <div className="flex-1 h-px bg-border/50" />
            </div>

            {/* Screenshot URL Input - shown directly */}
            <div className="hidden lg:block w-full max-w-[280px]" onClick={(e) => e.stopPropagation()}>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Globe02Icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
                  <Input
                    type="url"
                    placeholder="Enter URL to capture..."
                    value={screenshotUrl}
                    onChange={(e) => setScreenshotUrl(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCaptureScreenshot()}
                    disabled={isCapturing}
                    className="pl-9 h-10 bg-surface-2/60 border-border/60 text-foreground placeholder:text-text-muted text-sm"
                  />
                </div>
                <Button
                  onClick={handleCaptureScreenshot}
                  disabled={isCapturing || !screenshotUrl.trim()}
                  className="h-10 bg-foreground text-background hover:bg-foreground/90 px-4 transition-all duration-200"
                >
                  {isCapturing ? <Loading03Icon size={16} className="animate-spin" /> : <Camera01Icon size={16} />}
                </Button>
              </div>
            </div>
          </div>
        )}

        {error && <div className="mt-4 text-sm text-destructive">{error}</div>}
      </div>
    </div>
  );
}
