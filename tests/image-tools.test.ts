import test from "node:test";
import assert from "node:assert/strict";
import {
  aspectRatioOf,
  applyCropAspectRatio,
  centeredCropForRatio,
  clampCropRect,
  computeResizeDimensions,
  dimensionsAfterRotation,
  fitWithin,
  matchLockedAxis,
  normalizeAngle,
} from "../lib/image-tools/geometry";
import {
  clampQuality,
  extensionFor,
  formatBytes,
  formatFromMime,
  isLossy,
  mimeFor,
  qualityForLevel,
  savingsPercent,
  supportsTransparency,
} from "../lib/image-tools/format";
import {
  baseName,
  batchArchiveName,
  outputFilename,
  sanitizeFilename,
  swapExtension,
  uniqueFilename,
} from "../lib/image-tools/filename";
import {
  buildOutputName,
  buildProcessOptions,
  resolveOutputFormat,
  DEFAULT_REENCODE_QUALITY,
  DEFAULT_RESIZE,
  DEFAULT_TOOL_SETTINGS,
} from "../lib/image-tools/plan";
import type { ResizeOptions } from "../lib/image-tools/types";

const SOURCE = { width: 1600, height: 900 };

function resizeOptions(overrides: Partial<ResizeOptions> = {}): ResizeOptions {
  return {
    mode: "pixels",
    width: null,
    height: null,
    percentage: 100,
    lockAspectRatio: true,
    allowUpscale: false,
    ...overrides,
  };
}

test("aspectRatioOf survives a zero-height image", () => {
  assert.equal(aspectRatioOf({ width: 1600, height: 900 }), 1600 / 900);
  assert.equal(aspectRatioOf({ width: 100, height: 0 }), 1);
});

test("quarter turns swap width and height", () => {
  assert.deepEqual(dimensionsAfterRotation(SOURCE, 0), SOURCE);
  assert.deepEqual(dimensionsAfterRotation(SOURCE, 180), SOURCE);
  assert.deepEqual(dimensionsAfterRotation(SOURCE, 90), {
    width: 900,
    height: 1600,
  });
  assert.deepEqual(dimensionsAfterRotation(SOURCE, 270), {
    width: 900,
    height: 1600,
  });
});

test("normalizeAngle snaps onto the four quarter turns", () => {
  assert.equal(normalizeAngle(0), 0);
  assert.equal(normalizeAngle(90), 90);
  assert.equal(normalizeAngle(-90), 270);
  assert.equal(normalizeAngle(360), 0);
  assert.equal(normalizeAngle(450), 90);
});

test("percentage resize scales both axes and rounds to whole pixels", () => {
  assert.deepEqual(
    computeResizeDimensions(
      SOURCE,
      resizeOptions({ mode: "percentage", percentage: 50 })
    ),
    { width: 800, height: 450 }
  );
});

test("locked resize derives the axis the user did not type", () => {
  assert.deepEqual(
    computeResizeDimensions(SOURCE, resizeOptions({ width: 800 })),
    { width: 800, height: 450 }
  );
  assert.deepEqual(
    computeResizeDimensions(SOURCE, resizeOptions({ height: 450 })),
    { width: 800, height: 450 }
  );
});

test("locked resize with both axes fits inside the box instead of stretching", () => {
  assert.deepEqual(
    computeResizeDimensions(
      SOURCE,
      resizeOptions({ width: 800, height: 800 })
    ),
    { width: 800, height: 450 }
  );
});

test("unlocked resize stretches to exactly what was typed", () => {
  assert.deepEqual(
    computeResizeDimensions(
      SOURCE,
      resizeOptions({ width: 500, height: 500, lockAspectRatio: false })
    ),
    { width: 500, height: 500 }
  );
});

test("upscaling is clamped to the source unless explicitly allowed", () => {
  assert.deepEqual(
    computeResizeDimensions(SOURCE, resizeOptions({ width: 3200 })),
    SOURCE
  );
  assert.deepEqual(
    computeResizeDimensions(
      SOURCE,
      resizeOptions({ width: 3200, allowUpscale: true })
    ),
    { width: 3200, height: 1800 }
  );
});

test("a resize with no target returns the source size", () => {
  assert.deepEqual(computeResizeDimensions(SOURCE, resizeOptions()), SOURCE);
});

test("matchLockedAxis keeps the ratio true as the user types", () => {
  assert.deepEqual(matchLockedAxis(SOURCE, "width", 800), {
    width: 800,
    height: 450,
  });
  assert.deepEqual(matchLockedAxis(SOURCE, "height", 450), {
    width: 800,
    height: 450,
  });
});

test("clampCropRect slides an out-of-bounds rect back inside", () => {
  assert.deepEqual(
    clampCropRect({ x: -50, y: -50, width: 400, height: 300 }, SOURCE),
    { x: 0, y: 0, width: 400, height: 300 }
  );
  assert.deepEqual(
    clampCropRect({ x: 1500, y: 800, width: 400, height: 300 }, SOURCE),
    { x: 1200, y: 600, width: 400, height: 300 }
  );
});

test("clampCropRect trims a rect larger than the image", () => {
  assert.deepEqual(
    clampCropRect({ x: 0, y: 0, width: 9999, height: 9999 }, SOURCE),
    { x: 0, y: 0, width: 1600, height: 900 }
  );
});

test("applyCropAspectRatio reshapes around the current centre", () => {
  const square = applyCropAspectRatio(
    { x: 400, y: 200, width: 400, height: 300 },
    SOURCE,
    1
  );
  assert.equal(square.width, square.height);
  assert.ok(square.x >= 0 && square.x + square.width <= SOURCE.width);
  assert.ok(square.y >= 0 && square.y + square.height <= SOURCE.height);
});

test("centeredCropForRatio returns the largest fitting rect", () => {
  assert.deepEqual(centeredCropForRatio(SOURCE, 1), {
    x: 350,
    y: 0,
    width: 900,
    height: 900,
  });
  assert.deepEqual(centeredCropForRatio(SOURCE, 16 / 9), {
    x: 0,
    y: 0,
    width: 1600,
    height: 900,
  });
});

test("fitWithin shrinks to the box but never enlarges", () => {
  assert.deepEqual(fitWithin(SOURCE, { width: 800, height: 800 }), {
    width: 800,
    height: 450,
  });
  assert.deepEqual(fitWithin({ width: 100, height: 100 }, { width: 800, height: 800 }), {
    width: 100,
    height: 100,
  });
});

test("format metadata matches what canvas encoders expect", () => {
  assert.equal(mimeFor("jpeg"), "image/jpeg");
  assert.equal(extensionFor("jpeg"), "jpg");
  assert.equal(isLossy("png"), false);
  assert.equal(isLossy("webp"), true);
  assert.equal(supportsTransparency("jpeg"), false);
  assert.equal(supportsTransparency("webp"), true);
});

test("formatFromMime is case-insensitive and rejects what we cannot encode", () => {
  assert.equal(formatFromMime("image/PNG"), "png");
  assert.equal(formatFromMime(" image/jpg "), "jpeg");
  assert.equal(formatFromMime("image/gif"), null);
  assert.equal(formatFromMime("image/svg+xml"), null);
});

test("clampQuality bounds lossy values and ignores quality for lossless", () => {
  assert.equal(clampQuality(0.8, "jpeg"), 0.8);
  assert.equal(clampQuality(5, "jpeg"), 1);
  assert.equal(clampQuality(-1, "jpeg"), 0.01);
  assert.equal(clampQuality(Number.NaN, "webp"), 1);
  assert.equal(clampQuality(0.2, "png"), 1);
});

test("compression levels trade quality for size in the right direction", () => {
  assert.ok(
    qualityForLevel("low", "jpeg") > qualityForLevel("medium", "jpeg")
  );
  assert.ok(
    qualityForLevel("medium", "jpeg") > qualityForLevel("high", "jpeg")
  );
  assert.ok(
    qualityForLevel("high", "jpeg") > qualityForLevel("extreme", "jpeg")
  );
});

test("formatBytes reads like a file manager", () => {
  assert.equal(formatBytes(512), "512 B");
  assert.equal(formatBytes(1536), "1.5 KB");
  assert.equal(formatBytes(15 * 1024), "15 KB");
  assert.equal(formatBytes(2 * 1024 * 1024), "2.0 MB");
  assert.equal(formatBytes(-1), "-");
});

test("savingsPercent reports growth as a negative saving", () => {
  assert.equal(savingsPercent(1000, 250), 75);
  assert.equal(savingsPercent(1000, 1200), -20);
  assert.equal(savingsPercent(0, 100), 0);
});

test("filenames are stripped of characters that break zips and downloads", () => {
  assert.equal(sanitizeFilename("my/screen:shot?.png"), "my-screen-shot-.png");
  assert.equal(sanitizeFilename("   "), "image");
});

test("baseName keeps dotted names and leading-dot files intact", () => {
  assert.equal(baseName("shot.final.png"), "shot.final");
  assert.equal(baseName("shot"), "shot");
  assert.equal(baseName(".gitignore"), ".gitignore");
});

test("swapExtension and outputFilename produce the download name", () => {
  assert.equal(swapExtension("shot.png", "webp"), "shot.webp");
  assert.equal(swapExtension("shot.png", "jpeg"), "shot.jpg");
  assert.equal(outputFilename("shot.png", "jpeg"), "shot.jpg");
  assert.equal(
    outputFilename("shot.png", "png", "compressed"),
    "shot-compressed.png"
  );
});

test("uniqueFilename keeps batch zip entries from overwriting each other", () => {
  const taken = new Set(["shot.png"]);
  assert.equal(uniqueFilename("other.png", taken), "other.png");
  assert.equal(uniqueFilename("shot.png", taken), "shot (2).png");

  taken.add("shot (2).png");
  assert.equal(uniqueFilename("shot.png", taken), "shot (3).png");
});

test("batchArchiveName is a safe zip name", () => {
  assert.equal(
    batchArchiveName("compress-image"),
    "screenshot-studio-compress-image.zip"
  );
});

test("resolveOutputFormat keeps the source format on auto", () => {
  assert.equal(resolveOutputFormat("auto", "image/png"), "png");
  assert.equal(resolveOutputFormat("auto", "image/webp"), "webp");
  assert.equal(resolveOutputFormat("webp", "image/png"), "webp");
});

test("resolveOutputFormat falls back to PNG for decode-only sources", () => {
  assert.equal(resolveOutputFormat("auto", "image/gif"), "png");
  assert.equal(resolveOutputFormat("auto", "image/bmp"), "png");
});

test("each batch engine only sends the pipeline the options it uses", () => {
  const settings = {
    ...DEFAULT_TOOL_SETTINGS,
    // A crop rect is deliberately present: the batch builder must never pass
    // it through, because only the interactive crop tool sets one.
    crop: { x: 10, y: 10, width: 100, height: 100 },
    transform: { rotate: 90 as const, flipHorizontal: true, flipVertical: false },
    resize: { ...DEFAULT_RESIZE, width: 640 },
  };

  for (const engine of ["compress", "convert", "resize", "rotate"] as const) {
    assert.equal(
      buildProcessOptions(engine, settings, "image/jpeg").crop,
      null,
      `${engine} must not carry a crop rect`
    );
  }

  const compress = buildProcessOptions("compress", settings, "image/jpeg");
  assert.equal(compress.transform, null);
  assert.equal(compress.resize, null);

  const resize = buildProcessOptions("resize", settings, "image/jpeg");
  assert.equal(resize.resize?.width, 640);
  assert.equal(resize.transform, null);

  const rotate = buildProcessOptions("rotate", settings, "image/jpeg");
  assert.equal(rotate.transform?.rotate, 90);
  assert.equal(rotate.resize, null);
});

test("resize and rotate re-encode at the shared high-quality default", () => {
  const settings = { ...DEFAULT_TOOL_SETTINGS };
  assert.equal(
    buildProcessOptions("resize", settings, "image/jpeg").encode.quality,
    DEFAULT_REENCODE_QUALITY
  );
  assert.equal(
    buildProcessOptions("rotate", settings, "image/jpeg").encode.quality,
    DEFAULT_REENCODE_QUALITY
  );
});

test("compress quality follows the preset level, not the manual slider", () => {
  const gentle = buildProcessOptions(
    "compress",
    { ...DEFAULT_TOOL_SETTINGS, level: "low" },
    "image/jpeg"
  );
  const aggressive = buildProcessOptions(
    "compress",
    { ...DEFAULT_TOOL_SETTINGS, level: "extreme" },
    "image/jpeg"
  );
  assert.ok(gentle.encode.quality > aggressive.encode.quality);
});

test("convert honours the manual quality slider only when it is enabled", () => {
  const auto = buildProcessOptions(
    "convert",
    { ...DEFAULT_TOOL_SETTINGS, quality: 0.5 },
    "image/jpeg"
  );
  assert.equal(auto.encode.quality, 0.5);

  const manual = buildProcessOptions(
    "convert",
    { ...DEFAULT_TOOL_SETTINGS, quality: 0.4, useCustomQuality: true },
    "image/jpeg"
  );
  assert.equal(manual.encode.quality, 0.4);
});

test("output names only gain a suffix when they would overwrite the source", () => {
  assert.equal(buildOutputName("convert", "shot.png", "jpeg"), "shot.jpg");
  assert.equal(buildOutputName("compress", "shot.png", "png"), "shot-compressed.png");
  assert.equal(buildOutputName("resize", "shot.jpg", "jpeg"), "shot-resized.jpg");
  assert.equal(buildOutputName("rotate", "shot.PNG", "png"), "shot-rotated.png");
  assert.equal(buildOutputName("crop", "shot.webp", "png"), "shot.png");
});
