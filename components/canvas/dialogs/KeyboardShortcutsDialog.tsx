"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface ShortcutGroup {
  title: string;
  shortcuts: { keys: string[]; description: string }[];
}

const shortcutGroups: ShortcutGroup[] = [
  {
    title: "General",
    shortcuts: [
      { keys: ["⌘/Ctrl", "Z"], description: "Undo" },
      { keys: ["⌘/Ctrl", "Shift", "Z"], description: "Redo" },
      { keys: ["Delete", "Backspace"], description: "Delete selected overlay" },
      { keys: ["Esc"], description: "Close panel / Deselect" },
    ],
  },
  {
    title: "Tools",
    shortcuts: [
      { keys: ["V"], description: "Select tool" },
      { keys: ["T"], description: "Add text overlay" },
      { keys: ["R"], description: "Add rectangle annotation" },
      { keys: ["O"], description: "Add circle annotation" },
      { keys: ["A"], description: "Add arrow annotation" },
      { keys: ["B"], description: "Blur tool" },
    ],
  },
  {
    title: "Canvas",
    shortcuts: [
      { keys: ["⌘/Ctrl", "C"], description: "Copy to clipboard" },
      { keys: ["⌘/Ctrl", "S"], description: "Export image" },
      { keys: ["⌘/Ctrl", "Shift", "E"], description: "Export video" },
      { keys: ["⌘/Ctrl", "Shift", "D"], description: "Download all slides" },
    ],
  },
  {
    title: "View",
    shortcuts: [
      { keys: ["R"], description: "Toggle rulers" },
      { keys: ["G"], description: "Toggle grid" },
    ],
  },
];

export function KeyboardShortcutsDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
          <DialogDescription>
            Boost your workflow with these shortcuts
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {shortcutGroups.map((group) => (
            <div key={group.title}>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                {group.title}
              </h4>
              <div className="space-y-1.5">
                {group.shortcuts.map((shortcut, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-1"
                  >
                    <span className="text-sm text-foreground/80">
                      {shortcut.description}
                    </span>
                    <div className="flex items-center gap-1">
                      {shortcut.keys.map((key, j) => (
                        <React.Fragment key={j}>
                          <kbd className="px-1.5 py-0.5 text-[10px] font-medium bg-muted border border-border rounded shadow-sm text-muted-foreground">
                            {key}
                          </kbd>
                          {j < shortcut.keys.length - 1 && (
                            <span className="text-muted-foreground/40 text-xs">+</span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
