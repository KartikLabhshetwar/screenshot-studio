'use client';

import * as React from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Camera01Icon,
  CommandIcon,
  Globe02Icon,
  Loading03Icon,
} from 'hugeicons-react';
import { Moon, Sun } from 'lucide-react';
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE } from '@/lib/constants';
import { useEditorStore, useImageStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { getBackgroundCSS } from '@/lib/constants/backgrounds';

const TRANSITION_DURATION = 400; // ms
type ColorScheme = 'light' | 'dark';

function extractImageUrl(style: React.CSSProperties): string | null {
  const bg = style.backgroundImage;
  if (!bg || typeof bg !== 'string') return null;
  const match = bg.match(/url\(([^)]+)\)/);
  if (!match) return null;
  return match[1].replace(/['"]/g, '');
}

function preloadImage(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve(url);
    img.onerror = () => reject(new Error(`Failed to load: ${url}`));
    img.src = url;
  });
}

export function CleanUploadState() {
  const [isDragActive, setIsDragActive] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [screenshotUrl, setScreenshotUrl] = React.useState('');
  const [colorScheme, setColorScheme] = React.useState<ColorScheme>('light');
  const [isCapturing, setIsCapturing] = React.useState(false);

  const { setScreenshot } = useEditorStore();
  const { addImages, setImage, backgroundConfig } = useImageStore();
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Crossfade state
  const backgroundStyle = React.useMemo(
    () => getBackgroundCSS(backgroundConfig),
    [backgroundConfig]
  );
  const [activeLayer, setActiveLayer] = React.useState<'a' | 'b'>('a');
  const [layerAStyle, setLayerAStyle] = React.useState<React.CSSProperties>(backgroundStyle);
  const [layerBStyle, setLayerBStyle] = React.useState<React.CSSProperties>(backgroundStyle);
  const [showTransition, setShowTransition] = React.useState(false);
  const prevConfigRef = React.useRef(backgroundConfig);
  const isFirstRender = React.useRef(true);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>(undefined);

  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      setLayerAStyle(backgroundStyle);
      setLayerBStyle(backgroundStyle);
      return;
    }

    const prev = prevConfigRef.current;
    const changed =
      prev.type !== backgroundConfig.type ||
      prev.value !== backgroundConfig.value;

    if (!changed) {
      if (activeLayer === 'a') setLayerAStyle(backgroundStyle);
      else setLayerBStyle(backgroundStyle);
      return;
    }

    prevConfigRef.current = backgroundConfig;
    let cancelled = false;

    const applyNewBackground = (style: React.CSSProperties) => {
      if (cancelled) return;
      if (activeLayer === 'a') {
        setLayerBStyle(style);
        setShowTransition(true);
        requestAnimationFrame(() => { if (!cancelled) setActiveLayer('b'); });
      } else {
        setLayerAStyle(style);
        setShowTransition(true);
        requestAnimationFrame(() => { if (!cancelled) setActiveLayer('a'); });
      }
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setShowTransition(false), TRANSITION_DURATION + 50);
    };

    if (backgroundConfig.type === 'image') {
      const url = extractImageUrl(backgroundStyle);
      if (url) {
        preloadImage(url)
          .then((loadedUrl) => {
            applyNewBackground({ ...backgroundStyle, backgroundImage: `url(${loadedUrl})` });
          })
          .catch(() => applyNewBackground(backgroundStyle));
        return () => { cancelled = true; if (timeoutRef.current) clearTimeout(timeoutRef.current); };
      }
    }

    applyNewBackground(backgroundStyle);
    return () => { cancelled = true; if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, [backgroundConfig, backgroundStyle, activeLayer]);

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

  // Auto-focus the container so paste events work immediately
  React.useEffect(() => {
    if (containerRef.current) {
      containerRef.current.focus();
    }
  }, []);

  const handlePaste = React.useCallback(
    (e: React.ClipboardEvent | ClipboardEvent) => {
      const clipboardData = 'clipboardData' in e ? e.clipboardData : null;
      const items = clipboardData?.items;
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
    },
    [addImages, handleFile]
  );

  // Listen on both document and the container for paste events
  React.useEffect(() => {
    const handler = (e: ClipboardEvent) => handlePaste(e);
    document.addEventListener('paste', handler);
    return () => document.removeEventListener('paste', handler);
  }, [handlePaste]);

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
        body: JSON.stringify({ url: finalUrl, deviceType: 'desktop', colorScheme }),
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
      const file = new File([blob], `screenshot-${colorScheme}.png`, { type: 'image/png' });
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
      tabIndex={0}
      onPaste={handlePaste}
      className="relative w-full h-full flex items-center justify-center outline-none overflow-hidden"
    >
      {/* Background Layer A */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          ...layerAStyle,
          transition: showTransition ? `opacity ${TRANSITION_DURATION}ms ease-in-out` : undefined,
          opacity: activeLayer === 'a' ? (layerAStyle.opacity ?? 1) : 0,
          zIndex: 0,
        }}
      />
      {/* Background Layer B */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          ...layerBStyle,
          transition: showTransition ? `opacity ${TRANSITION_DURATION}ms ease-in-out` : undefined,
          opacity: activeLayer === 'b' ? (layerBStyle.opacity ?? 1) : 0,
          zIndex: 0,
        }}
      />
      <input {...getInputProps()} />

      {/* Upload area with plus icon */}
      <div
        className={cn(
          'relative z-10 flex flex-col items-center justify-center cursor-pointer',
          'w-[80%] h-[80%] rounded-2xl',
          'bg-foreground/5 backdrop-blur-sm',
          'border border-foreground/10',
          'transition-all duration-300 ease-out',
          'hover:bg-foreground/8 hover:border-foreground/15',
          active && 'bg-primary/10 border-primary/30 scale-[1.01]',
        )}
        onClick={open}
      >
        {/* Plus icon */}
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          className="transition-colors duration-200 mb-4"
          style={{ color: active ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.45)', filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.3))' }}
        >
          <line x1="24" y1="8" x2="24" y2="40" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          <line x1="8" y1="24" x2="40" y2="24" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>

        {/* Placeholder text */}
        <p
          className="text-sm font-medium mb-1"
          style={{ color: 'rgba(255,255,255,0.7)', textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}
        >
          {active ? 'Drop the image here...' : 'Drag & drop, click to browse, or paste'}
        </p>

        {!active && (
          <div className="hidden sm:flex items-center gap-1.5 text-xs mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
            <kbd
              className="px-1.5 py-0.5 rounded font-medium text-xs"
              style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.7)' }}
            >
              <span className="flex items-center gap-0.5">
                <CommandIcon size={10} />V
              </span>
            </kbd>
            <span>to paste</span>
          </div>
        )}

        {/* Screenshot URL input */}
        {!active && (
          <div className="hidden lg:flex flex-col items-center gap-2 mt-4 w-full max-w-[280px]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2 w-full max-w-[140px]">
              <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.15)' }} />
              <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>or</span>
              <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.15)' }} />
            </div>
            <div className="flex gap-1.5 w-full">
              <div
                className="relative flex flex-1 items-center rounded-lg pl-2.5 pr-1 transition-shadow focus-within:ring-1 focus-within:ring-white/25"
                style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.15)' }}
              >
                <Globe02Icon size={14} className="shrink-0" style={{ color: 'rgba(255,255,255,0.45)' }} />
                <Input
                  type="url"
                  placeholder="Enter website URL..."
                  value={screenshotUrl}
                  onChange={(e) => setScreenshotUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCaptureScreenshot()}
                  disabled={isCapturing}
                  className="h-9 flex-1 border-0 bg-transparent px-2 text-xs shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-transparent"
                  style={{ color: 'rgba(255,255,255,0.9)' }}
                />
                <div className="h-4 w-px shrink-0 bg-white/10" />
                <SegmentedControl
                  size="sm"
                  value={colorScheme}
                  onChange={(value) => setColorScheme(value as ColorScheme)}
                  className={cn('ml-1 shrink-0 border-0 bg-transparent dark:bg-transparent p-[2px]', isCapturing && 'pointer-events-none opacity-60')}
                  indicatorClassName="bg-white/15 dark:bg-white/15"
                  options={[
                    { id: 'light', icon: <Sun className="h-3 w-3" />, ariaLabel: 'Light' },
                    { id: 'dark', icon: <Moon className="h-3 w-3" />, ariaLabel: 'Dark' },
                  ]}
                />
              </div>
              <Button
                onClick={handleCaptureScreenshot}
                disabled={isCapturing}
                size="sm"
                className="h-9 px-3 rounded-lg transition-all duration-200"
                style={{
                  background: 'rgba(0,0,0,0.3)',
                  borderColor: 'rgba(255,255,255,0.15)',
                  color: 'rgba(255,255,255,0.8)',
                }}
              >
                {isCapturing ? <Loading03Icon size={14} className="animate-spin" /> : <Camera01Icon size={14} />}
              </Button>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-destructive bg-background/90 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-destructive/20">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
