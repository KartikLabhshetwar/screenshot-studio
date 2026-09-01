import assert from "node:assert/strict";
import test from "node:test";
import { cleanExportClone, shouldIncludeInExport } from "../lib/export/export-filter";

test("editor-only device content is excluded from exports", () => {
  const excludedNode = {
    getAttribute: (name: string) => name === "data-export-exclude" ? "true" : null,
    classList: { contains: () => false },
  } as unknown as Node;

  assert.equal(shouldIncludeInExport(excludedNode), false);
});

test("device crop rings are removed from export clones", () => {
  const classes = new Set([
    "ring-2",
    "ring-primary",
    "ring-offset-1",
    "ring-offset-foreground/20",
    "bg-muted",
  ]);
  const styles = new Map<string, string>();
  const deviceScreen = {
    getAttribute: (name: string) => name === "data-export-clean-device-screen" ? "true" : null,
    querySelectorAll: () => [],
    classList: {
      remove: (...names: string[]) => names.forEach((name) => classes.delete(name)),
    },
    style: {
      setProperty: (name: string, value: string) => styles.set(name, value),
      removeProperty: (name: string) => styles.delete(name),
    },
  } as unknown as Node;

  cleanExportClone(deviceScreen);

  assert.deepEqual([...classes], ["bg-muted"]);
  assert.equal(styles.get("box-shadow"), "none");
});
