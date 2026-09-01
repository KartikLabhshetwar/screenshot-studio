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
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-valuetext": ariaValueText,
  ...props
}: SliderProps) {
  const labelId = React.useId()
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
          ? defaultValue
          : [min, max],
    [value, defaultValue, min, max]
  )

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
            <span id={labelId} className="text-xs text-muted-foreground">{label}</span>
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
          "relative flex h-4 w-full touch-none cursor-grab select-none items-center active:cursor-grabbing max-[768px]:h-11",
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
              "relative block size-3.5 shrink-0 rounded-full bg-primary after:absolute after:-inset-[5px] after:content-['']",
              "border border-foreground/20 shadow-sm",
              "transition-[box-shadow,transform] duration-150",
              "hover:scale-110",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              "active:scale-95",
              "disabled:pointer-events-none disabled:opacity-50"
            )}
            aria-label={label ? undefined : ariaLabel}
            aria-labelledby={label ? labelId : ariaLabelledBy}
            aria-valuetext={ariaValueText ?? (showMeta ? String(displayValue) : undefined)}
          />
        ))}
      </SliderPrimitive.Root>
    </div>
  )
}

export { Slider }
