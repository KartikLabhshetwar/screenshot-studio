"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

interface SliderProps extends React.ComponentProps<typeof SliderPrimitive.Root> {
  label?: string
  valueDisplay?: string | number
}

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  label,
  valueDisplay,
  ...props
}: SliderProps) {
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
          ? defaultValue
          : [min, max],
    [value, defaultValue, min, max]
  )

  // Only show the value readout when a label is set, or valueDisplay is passed explicitly.
  // Compact uses (e.g. timeline duration) pass neither, so the track stays clean.
  const showMeta = Boolean(label) || valueDisplay !== undefined
  const displayValue =
    valueDisplay ??
    (Array.isArray(value)
      ? value[0]
      : (value ?? (Array.isArray(defaultValue) ? defaultValue[0] : (defaultValue ?? min))))

  return (
    <div className={cn("relative w-full", showMeta ? "space-y-2" : null, className)}>
      {showMeta ? (
        <div className="flex items-center justify-between gap-3 select-none">
          {label ? (
            <span className="text-xs text-muted-foreground">{label}</span>
          ) : (
            <span />
          )}
          <span className="text-xs text-muted-foreground tabular-nums shrink-0">
            {displayValue}
          </span>
        </div>
      ) : null}

      <SliderPrimitive.Root
        data-slot="slider"
        defaultValue={defaultValue}
        value={value}
        min={min}
        max={max}
        className={cn(
          "relative flex touch-none select-none items-center cursor-grab active:cursor-grabbing w-full h-4",
          "data-disabled:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col"
        )}
        {...props}
      >
        <SliderPrimitive.Track
          data-slot="slider-track"
          className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-foreground/[0.08]"
        >
          <SliderPrimitive.Range
            data-slot="slider-range"
            className="absolute h-full bg-foreground/40 data-[orientation=vertical]:w-full"
          />
        </SliderPrimitive.Track>
        {Array.from({ length: _values.length }, (_, index) => (
          <SliderPrimitive.Thumb
            data-slot="slider-thumb"
            key={index}
            className={cn(
              "block size-3.5 shrink-0 rounded-full bg-primary",
              "border border-foreground/20 shadow-sm",
              "transition-[box-shadow,transform] duration-150",
              "hover:scale-110",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              "active:scale-95",
              "disabled:pointer-events-none disabled:opacity-50"
            )}
          />
        ))}
      </SliderPrimitive.Root>
    </div>
  )
}

export { Slider }
