import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("segmented controls expose toggle buttons instead of incomplete tab semantics", async () => {
  const source = await readFile(
    new URL("../components/ui/segmented-control.tsx", import.meta.url),
    "utf8",
  );

  assert.match(source, /aria-pressed=\{isActive\}/);
  assert.doesNotMatch(source, /role="tablist"|role="tab"|aria-selected/);
});
