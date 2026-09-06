"use client";

import * as React from "react";
import Image from "next/image";
import {
  Cancel01Icon,
  CheckmarkCircle02Icon,
  Alert02Icon,
  Loading03Icon,
} from "hugeicons-react";
import { cn } from "@/lib/utils";
import { formatBytes, savingsPercent } from "@/lib/image-tools";
import type { QueueItem } from "./useToolQueue";

interface FileQueueProps {
  items: QueueItem[];
  onRemove: (id: string) => void;
  disabled?: boolean;
}

function StatusBadge({ item }: { item: QueueItem }) {
  if (item.status === "processing") {
    return (
      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Loading03Icon size={14} className="animate-spin" aria-hidden="true" />
        Processing
      </span>
    );
  }

  if (item.status === "error") {
    return (
      <span className="flex items-center gap-1.5 text-xs text-destructive">
        <Alert02Icon size={14} aria-hidden="true" />
        {item.error ?? "Failed"}
      </span>
    );
  }

  if (item.status === "done" && item.result) {
    const saved = savingsPercent(item.bytes, item.result.bytes);

    if (item.keptOriginal) {
      return (
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <CheckmarkCircle02Icon
            size={14}
            className="text-emerald-600 dark:text-emerald-500"
            aria-hidden="true"
          />
          Already optimised, original kept ({formatBytes(item.bytes)})
        </span>
      );
    }

    return (
      <span className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs">
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <CheckmarkCircle02Icon
            size={14}
            className="text-emerald-600 dark:text-emerald-500"
            aria-hidden="true"
          />
          {formatBytes(item.bytes)} → {formatBytes(item.result.bytes)}
        </span>
        <span
          className={cn(
            "font-medium",
            saved > 0
              ? "text-emerald-600 dark:text-emerald-500"
              : "text-muted-foreground"
          )}
        >
          {saved > 0 ? `-${saved}%` : saved < 0 ? `+${Math.abs(saved)}%` : "same size"}
        </span>
        <span className="text-muted-foreground">
          {item.result.width} × {item.result.height}
        </span>
      </span>
    );
  }

  return (
    <span className="text-xs text-muted-foreground">
      {formatBytes(item.bytes)}
      {item.source ? ` · ${item.source.width} × ${item.source.height}` : ""}
    </span>
  );
}

export function FileQueue({ items, onRemove, disabled = false }: FileQueueProps) {
  if (items.length === 0) return null;

  return (
    <ul className="flex flex-col gap-2" aria-label="Images to process">
      {items.map((item) => (
        <li
          key={item.id}
          className="flex items-center gap-3 rounded-lg border border-border bg-card p-2.5"
        >
          <div className="relative size-11 shrink-0 overflow-hidden rounded-md bg-muted">
            {/* Object URLs are local blobs; next/image cannot optimise them. */}
            <Image
              src={item.previewUrl}
              alt=""
              fill
              unoptimized
              className="object-cover"
              sizes="44px"
            />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground" title={item.name}>
              {item.name}
            </p>
            <StatusBadge item={item} />
          </div>

          <button
            type="button"
            onClick={() => onRemove(item.id)}
            disabled={disabled}
            aria-label={`Remove ${item.name}`}
            className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
          >
            <Cancel01Icon size={15} aria-hidden="true" />
          </button>
        </li>
      ))}
    </ul>
  );
}
