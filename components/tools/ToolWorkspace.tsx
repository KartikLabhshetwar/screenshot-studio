"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Download04Icon,
  MagicWand01Icon,
  Delete02Icon,
  Loading03Icon,
} from "hugeicons-react";
import {
  buildOutputName,
  buildProcessOptions,
  detectEncodeSupport,
  formatBytes,
  formatFromMime,
  resolveOutputFormat,
  savingsPercent,
  DEFAULT_TOOL_SETTINGS,
  type BatchToolEngine,
  type RasterFormat,
  type ToolSettings,
} from "@/lib/image-tools";
import type { ToolDefinition, ToolEngine } from "@/lib/seo/tools";
import { ToolDropzone } from "./ToolDropzone";
import { FileQueue } from "./FileQueue";
import { useToolQueue } from "./useToolQueue";
import {
  CompressOptions,
  ConvertOptions,
  ResizeOptions,
  RotateOptions,
  type PanelProps,
} from "./ToolOptions";

const ACTION_LABEL: Record<ToolEngine, string> = {
  compress: "Compress",
  convert: "Convert",
  resize: "Resize",
  crop: "Crop",
  rotate: "Apply",
};

const PANELS: Record<BatchToolEngine, React.ComponentType<PanelProps>> = {
  compress: CompressOptions,
  convert: ConvertOptions,
  resize: ResizeOptions,
  rotate: RotateOptions,
};

interface ToolWorkspaceProps {
  tool: ToolDefinition;
}

function initialSettings(tool: ToolDefinition): ToolSettings {
  return {
    ...DEFAULT_TOOL_SETTINGS,
    // Converter landing pages arrive with their target already chosen; the
    // generic converter starts on WebP as the most useful default.
    format:
      tool.preset?.targetFormat ??
      (tool.engine === "convert" ? "webp" : "auto"),
  };
}

export function ToolWorkspace({ tool }: ToolWorkspaceProps) {
  const engine = tool.engine as BatchToolEngine;
  const queue = useToolQueue(tool.slug.replace(/^\//, ""));
  const [settings, setSettings] = React.useState<ToolSettings>(() =>
    initialSettings(tool)
  );
  const [encodable, setEncodable] = React.useState<RasterFormat[]>([
    "png",
    "jpeg",
  ]);

  // Canvas encoders lie about unsupported formats, so the real list is probed
  // once and drives which options are offered at all.
  React.useEffect(() => {
    let active = true;
    detectEncodeSupport().then((supported) => {
      if (!active) return;
      const order: RasterFormat[] = ["png", "jpeg", "webp"];
      setEncodable(order.filter((format) => supported.has(format)));
      setSettings((previous) =>
        previous.format !== "auto" && !supported.has(previous.format)
          ? { ...previous, format: "png" }
          : previous
      );
    });
    return () => {
      active = false;
    };
  }, []);

  const { resetResults } = queue;
  const updateSettings = React.useCallback(
    (updates: Partial<ToolSettings>) => {
      setSettings((previous) => ({ ...previous, ...updates }));
      // Results produced under the old settings would download as stale files.
      resetResults();
    },
    [resetResults]
  );

  const handleRun = React.useCallback(() => {
    void queue.run((item) => {
      const format = resolveOutputFormat(settings.format, item.file.type);
      return {
        options: buildProcessOptions(engine, settings, item.file.type),
        outputName: buildOutputName(engine, item.name, format),
        // Compressing to the same format should never return a bigger file.
        // A deliberate conversion or resize is delivered whatever its size.
        preferSmaller:
          engine === "compress" && format === formatFromMime(item.file.type),
      };
    });
  }, [engine, queue, settings]);

  const Panel = PANELS[engine];
  const reference = queue.items.find((item) => item.source)?.source ?? null;
  const hasItems = queue.items.length > 0;
  const totalSaved = savingsPercent(
    queue.totalInputBytes,
    queue.totalOutputBytes
  );

  if (!hasItems) {
    return (
      <div className="mx-auto w-full max-w-3xl">
        <ToolDropzone
          onFiles={queue.addFiles}
          sourceLabel={tool.preset?.sourceLabel}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto grid w-full max-w-5xl gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="flex flex-col gap-3">
        <FileQueue
          items={queue.items}
          onRemove={queue.removeItem}
          disabled={queue.isRunning}
        />
        <ToolDropzone
          onFiles={queue.addFiles}
          sourceLabel={tool.preset?.sourceLabel}
          compact
        />
      </div>

      <aside className="flex h-fit flex-col gap-5 rounded-xl border border-border bg-card p-5 lg:sticky lg:top-24">
        <Panel
          settings={settings}
          onChange={updateSettings}
          encodable={encodable}
          reference={reference}
        />

        <div className="flex flex-col gap-2 border-t border-border pt-4">
          {queue.isRunning ? (
            <>
              <Button disabled className="w-full">
                <Loading03Icon size={16} className="animate-spin" aria-hidden="true" />
                {queue.completed} of {queue.items.length}
              </Button>
              <Button variant="ghost" onClick={queue.cancel} className="w-full">
                Stop
              </Button>
            </>
          ) : (
            <Button onClick={handleRun} className="w-full">
              <MagicWand01Icon size={16} aria-hidden="true" />
              {ACTION_LABEL[engine]}
              {queue.items.length > 1 ? ` ${queue.items.length} images` : ""}
            </Button>
          )}

          {queue.hasResults ? (
            <Button
              variant="secondary"
              onClick={() => void queue.download()}
              disabled={queue.isRunning}
              className="w-full"
            >
              <Download04Icon size={16} aria-hidden="true" />
              {queue.doneCount > 1 ? "Download all as zip" : "Download"}
            </Button>
          ) : null}

          <Button
            variant="ghost"
            size="sm"
            onClick={queue.clear}
            disabled={queue.isRunning}
            className="w-full text-muted-foreground"
          >
            <Delete02Icon size={15} aria-hidden="true" />
            Clear
          </Button>
        </div>

        {queue.hasResults && !queue.isRunning ? (
          <p className="text-center text-xs text-muted-foreground">
            {formatBytes(queue.totalInputBytes)} →{" "}
            {formatBytes(queue.totalOutputBytes)}
            {totalSaved > 0 ? (
              <span className="font-medium text-emerald-600 dark:text-emerald-500">
                {" "}
                ({totalSaved}% smaller)
              </span>
            ) : null}
          </p>
        ) : null}
      </aside>
    </div>
  );
}
