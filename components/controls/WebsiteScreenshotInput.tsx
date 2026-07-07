'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SegmentedControl } from '@/components/ui/segmented-control'
import { useEditorStore, useImageStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { Loading03Icon, Globe02Icon, ComputerIcon, SmartPhone01Icon } from 'hugeicons-react'
import { Moon, Sun } from 'lucide-react'

type DeviceType = 'desktop' | 'mobile'
type ColorScheme = 'light' | 'dark'

const DEVICE_OPTIONS = [
  { id: 'desktop', label: 'Desktop', Icon: ComputerIcon },
  { id: 'mobile', label: 'Mobile', Icon: SmartPhone01Icon },
] as const

export function WebsiteScreenshotInput() {
  const [url, setUrl] = React.useState('')
  const [deviceType, setDeviceType] = React.useState<DeviceType>('desktop')
  const [colorScheme, setColorScheme] = React.useState<ColorScheme>('light')
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const { setScreenshot } = useEditorStore()
  const { setImage } = useImageStore()

  const normalizeUrl = (urlString: string): string => {
    let normalized = urlString.trim()
    
    // Remove leading/trailing whitespace
    normalized = normalized.trim()
    
    // If URL doesn't start with http:// or https://, add https://
    if (!normalized.match(/^https?:\/\//i)) {
      normalized = `https://${normalized}`
    }
    
    return normalized
  }

  const validateUrl = (urlString: string): { valid: boolean; normalized?: string; error?: string } => {
    try {
      const normalized = normalizeUrl(urlString)
      const urlObj = new URL(normalized)
      
      // Ensure URL has http or https protocol
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        return { valid: false, error: 'URL must use http or https protocol' }
      }
      
      // Basic validation - must have a hostname
      if (!urlObj.hostname || urlObj.hostname.length === 0) {
        return { valid: false, error: 'Please enter a valid URL with a domain name' }
      }
      
      return { valid: true, normalized }
    } catch {
      return { valid: false, error: 'Please enter a valid URL (e.g., example.com or https://example.com)' }
    }
  }

  const handleCapture = async () => {
    if (!url.trim()) {
      setError('Please enter a URL')
      return
    }

    // Validate and normalize URL
    const validation = validateUrl(url)
    if (!validation.valid) {
      setError(validation.error || 'Please enter a valid URL')
      return
    }

    const finalUrl = validation.normalized!

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/screenshot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: finalUrl, deviceType, colorScheme }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to capture screenshot')
      }

      if (!data.screenshot || typeof data.screenshot !== 'string') {
        throw new Error('Invalid screenshot data received from server')
      }

      // Convert base64 to blob URL
      let base64Data = data.screenshot.trim()
      
      // Remove data URL prefix if present (e.g., "data:image/png;base64,")
      if (base64Data.includes(',')) {
        base64Data = base64Data.split(',')[1]
      }
      
      // Clean base64 string (remove whitespace and newlines)
      base64Data = base64Data.replace(/\s/g, '')
      
      if (!base64Data) {
        throw new Error('Empty screenshot data received')
      }

      let byteCharacters: string
      try {
        byteCharacters = atob(base64Data)
      } catch (decodeError) {
        console.error('Base64 decode error:', decodeError)
        throw new Error('Failed to decode screenshot data. The image may be corrupted.')
      }

      const byteNumbers = new Array(byteCharacters.length)
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }
      const byteArray = new Uint8Array(byteNumbers)
      const blob = new Blob([byteArray], { type: 'image/png' })
      const blobUrl = URL.createObjectURL(blob)

      // Create a File object from the blob
      const file = new File([blob], `screenshot-${colorScheme}.png`, { type: 'image/png' })

      // Update stores immediately
      setScreenshot({ src: blobUrl })
      setImage(file)

      // Clear form
      setUrl('')
    } catch (error) {
      console.error('Screenshot error:', error)
      setError(
        error instanceof Error
          ? error.message
          : 'Failed to capture screenshot. Please try again.'
      )
    } finally {
      setIsLoading(false)
    }
  }


  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading) {
      handleCapture()
    }
  }

  return (
    <div className="w-full space-y-4">
      <div className="space-y-2">
        <Label htmlFor="website-url" className="text-sm font-medium">
          Website URL
        </Label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Globe02Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              id="website-url"
              type="url"
              placeholder="example.com or https://example.com"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value)
                setError(null)
              }}
              onBlur={(e) => {
                const value = e.target.value.trim()
                if (value) {
                  const validation = validateUrl(value)
                  if (validation.valid && validation.normalized && validation.normalized !== value) {
                    setUrl(validation.normalized)
                  }
                }
              }}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              className="pl-9"
            />
          </div>
          <Button
            onClick={handleCapture}
            disabled={isLoading || !url.trim()}
            className="shrink-0"
          >
            {isLoading ? (
              <>
                <Loading03Icon className="h-4 w-4 mr-2 animate-spin" />
                Capturing...
              </>
            ) : (
              'Capture'
            )}
          </Button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex items-center gap-3">
            <Label htmlFor="device-type" className="text-sm font-medium whitespace-nowrap">
              Device:
            </Label>
            <Select value={deviceType} onValueChange={(value) => setDeviceType(value as DeviceType)} disabled={isLoading}>
              <SelectTrigger id="device-type" className="w-[140px]">
                <SelectValue>
                  {DEVICE_OPTIONS.filter((o) => o.id === deviceType).map(({ id, label, Icon }) => (
                    <span key={id} className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      {label}
                    </span>
                  ))}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {DEVICE_OPTIONS.map(({ id, label, Icon }) => (
                  <SelectItem key={id} value={id}>
                    <span className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      {label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-3 sm:justify-end">
            <Label className="text-sm font-medium whitespace-nowrap">
              Theme:
            </Label>
            <SegmentedControl
              size="sm"
              value={colorScheme}
              onChange={(value) => setColorScheme(value as ColorScheme)}
              className={cn("w-[72px]", isLoading && "pointer-events-none opacity-60")}
              options={[
                { id: 'light', icon: <Sun className="h-3.5 w-3.5" />, ariaLabel: 'Light' },
                { id: 'dark', icon: <Moon className="h-3.5 w-3.5" />, ariaLabel: 'Dark' },
              ]}
            />
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Enter a website URL to capture a viewport screenshot. Dark theme uses the site&apos;s prefers-color-scheme support.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3">
          <p className="text-xs sm:text-sm text-destructive">{error}</p>
        </div>
      )}

      {isLoading && (
        <div className="rounded-lg border border-border bg-muted p-8 flex flex-col items-center justify-center min-h-[200px]">
          <Loading03Icon className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-sm text-muted-foreground">
            Capturing screenshot...
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            This may take a few seconds
          </p>
        </div>
      )}
    </div>
  )
}
