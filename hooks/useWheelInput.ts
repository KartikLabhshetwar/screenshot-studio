"use client";

import { useCallback, useRef, useEffect } from "react";

/**
 * Hook that enables mouse wheel input for numeric value adjustments.
 *
 * @param value - Current numeric value
 * @param onChange - Callback function when value changes
 * @param min - Minimum allowed value (default: -Infinity)
 * @param max - Maximum allowed value (default: Infinity)
 * @param step - Base increment/decrement step (default: 1)
 *
 * @returns Object with a ref to attach to the container element
 *
 * @remarks
 * Supports modifier keys:
 * - Shift: 10x step multiplier
 * - Ctrl/Cmd: 0.1x step multiplier
 */
interface UseWheelInputOptions {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

export function useWheelInput({
  value,
  onChange,
  min = -Infinity,
  max = Infinity,
  step = 1,
}: UseWheelInputOptions) {
  const ref = useRef<HTMLDivElement>(null);
  const valueRef = useRef(value);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -step : step;
      const multiplier = e.shiftKey ? 10 : e.ctrlKey || e.metaKey ? 0.1 : 1;
      const rawValue = valueRef.current + delta * multiplier;
      const precision = step < 1 ? Math.abs(step.toString().split('.')[1]?.length ?? 0) : 0;
      const newValue = Math.min(
        max,
        Math.max(min, parseFloat(rawValue.toFixed(precision))),
      );
      onChange(newValue);
    },
    [onChange, min, max, step],
  );

  useEffect(() => {
    const element = ref.current;
    if (element) {
      element.addEventListener("wheel", handleWheel, { passive: false });
      return () => element.removeEventListener("wheel", handleWheel);
    }
  }, [handleWheel]);

  return { ref };
}
