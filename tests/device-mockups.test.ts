import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  DEVICE_LAYOUTS,
  getDeviceLayout,
  getMockupDefinition,
  MAX_DEVICE_MOCKUPS,
  MOCKUP_DEFINITIONS,
  resolveMockupDefinitionId,
} from "../lib/constants/mockups";
import {
  applyLayoutToMockups,
  cloneMockups,
  compactDeviceScreenForDraft,
  createDeviceScreen,
  createMockup,
  hasVisibleMockups,
  restoreDeviceScreenFromDraft,
  restoreMockupsFromLayoutSnapshot,
  shouldRenderSourceImage,
} from "../lib/device-mockups/layouts";
import {
  normalizeDraftMockups,
  resolveRestoredEditorMode,
} from "../lib/device-mockups/draft-migration";
import type { Mockup } from "../types/mockup";
import { useDeviceUIStore } from "../lib/store/device-ui";

test("autosave never replaces the saved canvas background", async () => {
  const source = await readFile(
    new URL("../hooks/useAutosaveDraft.ts", import.meta.url),
    "utf8",
  );

  assert.doesNotMatch(source, /DEFAULT_CANVAS_BACKGROUND|red_distortion_4/);
  assert.match(source, /useImageStore\.setState\(\{\s*\.\.\.definedOnly\(rest\)/);
});

test("device library ships licensed device assets", () => {
  assert.equal(MOCKUP_DEFINITIONS.length, 17);
  assert.equal(MOCKUP_DEFINITIONS.filter((definition) => definition.family === "phone").length, 5);
  assert.equal(MOCKUP_DEFINITIONS.filter((definition) => definition.family === "watch").length, 7);
  assert.equal(MOCKUP_DEFINITIONS.filter((definition) => definition.family === "tablet").length, 0);
  assert.equal(MOCKUP_DEFINITIONS.filter((definition) => definition.family === "laptop").length, 5);
  assert.equal(MOCKUP_DEFINITIONS.filter((definition) => definition.family === "desktop").length, 0);
  assert.equal(new Set(MOCKUP_DEFINITIONS.map((definition) => definition.id)).size, MOCKUP_DEFINITIONS.length);

  const licensedAssets = MOCKUP_DEFINITIONS.filter((definition) => definition.asset);
  assert.equal(licensedAssets.length, 17);
  assert.equal(getMockupDefinition("macbook-pro-front"), undefined);
  assert.deepEqual(
    licensedAssets.map((definition) => definition.name),
    [
      "iPhone 17 Pro",
      "iPhone 17",
      "iPhone 15",
      "iPhone 13",
      "iPhone 14 Pro",
      "Apple Watch Ultra with Trail Loop",
      "Apple Watch Ultra with Ocean Band",
      "Apple Watch Red with Braided Solo Loop",
      "Apple Watch Gold with Orange Leather Band",
      "Apple Watch Silver with Blue Sport Band",
      "Apple Watch Midnight with Pride Sport Loop",
      "Apple Watch Gold with Milanese Loop",
      "MacBook Pro",
      "MacBook Neo",
      "MacBook Air 15-inch",
      "MacBook Pro 14-inch",
      "MacBook Pro 16-inch",
    ],
  );
  assert.ok(licensedAssets.every((definition) => definition.asset?.src.startsWith("/device-mockups/")));
  assert.ok(licensedAssets.every((definition) => definition.asset?.maskSrc.endsWith("-screen-mask.png")));
  assert.ok(licensedAssets.every((definition) => {
    const screen = definition.asset?.screen;
    return screen
      && screen.x >= 0
      && screen.y >= 0
      && screen.width > 0
      && screen.height > 0
      && screen.x + screen.width <= 1.001
      && screen.y + screen.height <= 1.001;
  }));
});

test("legacy draft devices migrate to supported catalog definitions", () => {
  assert.equal(resolveMockupDefinitionId("iphone-1"), "iphone-17-pro-front");
  assert.equal(resolveMockupDefinitionId("iwatch-1"), "apple-watch-midnight-pride-sport-loop");
  assert.equal(resolveMockupDefinitionId("mac-1"), "macbook-pro-studio-front");
  assert.equal(resolveMockupDefinitionId("imac-1"), "macbook-pro-studio-front");
  assert.equal(resolveMockupDefinitionId("iphone-17-pro-front"), "iphone-17-pro-front");
  assert.equal(resolveMockupDefinitionId("unknown-device"), null);
});

test("legacy draft device geometry migrates from pixels to normalized canvas coordinates", () => {
  const legacyMockup = {
    id: "legacy-phone",
    definitionId: "iphone-1",
    position: { x: 850, y: 344.4444444444 },
    size: 220,
    rotation: 0,
    opacity: 1,
    isVisible: true,
    imageFit: "contain",
  } as unknown as Mockup;

  const result = normalizeDraftMockups([legacyMockup], {
    uploadedImageUrl: "data:image/png;base64,screen",
    imageName: "screen.png",
    canvasDimensions: { canvasW: 1920, canvasH: 1080 },
  });

  assert.equal(result.migratedLegacyMockups, true);
  assert.equal(result.mockups[0].definitionId, "iphone-17-pro-front");
  assert.equal(result.mockups[0].size, 220 / 1920);
  assert.ok(Math.abs(result.mockups[0].position.x - 0.5) < 0.000001);
  assert.ok(Math.abs(result.mockups[0].position.y - 0.5) < 0.000001);
  assert.equal(result.mockups[0].screen.fit, "contain");
  assert.equal(result.mockups[0].screen.src, "data:image/png;base64,screen");
  assert.equal(resolveRestoredEditorMode("screenshot", true), "device");
  assert.equal(resolveRestoredEditorMode("browser", false), "browser");
});

test("a device scene is renderable only when a supported device is visible", async () => {
  const mockup = createMockup(
    "iphone-17-pro-front",
    createDeviceScreen(null, null),
  );
  assert.equal(hasVisibleMockups([mockup]), true);
  assert.equal(hasVisibleMockups([{ ...mockup, isVisible: false }]), false);
  assert.equal(hasVisibleMockups([{ ...mockup, definitionId: "unknown-device" }]), false);
  assert.equal(shouldRenderSourceImage("device", []), true);
  assert.equal(shouldRenderSourceImage("device", [mockup]), false);
  assert.equal(shouldRenderSourceImage("device", [{ ...mockup, isVisible: false }]), false);
  assert.equal(shouldRenderSourceImage("screenshot", [mockup]), true);

  const [editorCanvas, clientCanvas] = await Promise.all([
    readFile(new URL("../components/canvas/EditorCanvas.tsx", import.meta.url), "utf8"),
    readFile(new URL("../components/canvas/ClientCanvas.tsx", import.meta.url), "utf8"),
  ]);
  assert.match(editorCanvas, /hasVisibleMockups\(mockups\)/);
  assert.match(clientCanvas, /hasVisibleMockups\(mockups\)/);
  assert.doesNotMatch(editorCanvas, /mockups\.length > 0/);
  assert.doesNotMatch(clientCanvas, /mockups\.length > 0/);
});

test("device panel leaves change mode when its selected mockup is cleared", () => {
  useDeviceUIStore.setState({
    selectedDeviceId: "removed-device",
    editingScreenDeviceId: "removed-device",
    galleryOpen: true,
    galleryMode: "change",
  });

  useDeviceUIStore.getState().reconcileMockups([]);

  assert.deepEqual(
    {
      selectedDeviceId: useDeviceUIStore.getState().selectedDeviceId,
      editingScreenDeviceId: useDeviceUIStore.getState().editingScreenDeviceId,
      galleryOpen: useDeviceUIStore.getState().galleryOpen,
      galleryMode: useDeviceUIStore.getState().galleryMode,
    },
    {
      selectedDeviceId: null,
      editingScreenDeviceId: null,
      galleryOpen: true,
      galleryMode: "add",
    },
  );
});

test("drafts store inherited device images once without changing custom screens", async () => {
  const primary = "data:image/png;base64," + "a".repeat(2048);
  const inherited = createDeviceScreen(primary, "primary.png");
  const compacted = compactDeviceScreenForDraft(inherited, primary);

  assert.equal(compacted.src, null);
  assert.equal(compacted.sourceRef, "uploaded-image");
  assert.deepEqual(
    restoreDeviceScreenFromDraft(compacted, primary, "primary.png"),
    inherited,
  );

  const custom = createDeviceScreen(primary, "custom.png", true);
  assert.deepEqual(compactDeviceScreenForDraft(custom, primary), custom);

  const compactedCustom = {
    ...custom,
    src: null,
    sourceRef: "device-screen:screen-1" as const,
  };
  assert.deepEqual(
    restoreDeviceScreenFromDraft(
      compactedCustom,
      primary,
      "primary.png",
      { "screen-1": primary },
    ),
    custom,
  );

  const source = await readFile(
    new URL("../hooks/useAutosaveDraft.ts", import.meta.url),
    "utf8",
  );
  assert.match(source, /processMockups\(persistedImage\.mockups\)/);
  assert.match(source, /processMockups\(persistedImage\.deviceLayoutSnapshot\)/);
  assert.match(source, /deviceScreenAssets\[assetId\] = src/);
  assert.match(source, /sourceRef: `device-screen:\$\{assetId\}`/);
});

test("device screen uploads use durable data URLs instead of leaking blob URLs", async () => {
  const controls = await readFile(
    new URL("../components/mockups/MockupControls.tsx", import.meta.url),
    "utf8",
  );
  const renderer = await readFile(
    new URL("../components/mockups/MockupRenderer.tsx", import.meta.url),
    "utf8",
  );

  assert.match(controls, /blobToDataUrl\(file\)/);
  assert.match(renderer, /blobToDataUrl\(file\)/);
  assert.doesNotMatch(controls, /URL\.createObjectURL\(file\)/);
  assert.doesNotMatch(renderer, /URL\.createObjectURL\(file\)/);
});

test("device library includes all six launch layouts within the device limit", () => {
  assert.equal(DEVICE_LAYOUTS.length, 6);
  assert.ok(DEVICE_LAYOUTS.every((layout) => layout.slots.length <= MAX_DEVICE_MOCKUPS));
  assert.equal(new Set(DEVICE_LAYOUTS.map((layout) => layout.id)).size, DEVICE_LAYOUTS.length);
});

test("angled licensed devices align their empty state to the screen plane", () => {
  const angledAssetIds = [
    "iphone-15-perspective",
    "iphone-13-perspective",
    "macbook-air-15-perspective",
  ];

  assert.ok(angledAssetIds.every((id) => getMockupDefinition(id)?.asset?.emptyStateTransform?.startsWith("matrix(")));
  assert.ok(angledAssetIds.every((id) => getMockupDefinition(id)?.asset?.emptyStatePosition));
  assert.ok(angledAssetIds.every((id) => {
    const width = getMockupDefinition(id)?.asset?.emptyStateWidth;
    return width !== undefined && width > 0 && width < 1;
  }));
  assert.deepEqual(
    getMockupDefinition("iphone-15-perspective")?.asset?.emptyStatePosition,
    { x: 0.479, y: 0.5026 },
  );
  assert.equal(getMockupDefinition("iphone-17-pro-front")?.asset?.emptyStateTransform, undefined);
});

test("layout application preserves screen content and arranges existing devices", () => {
  const screen = createDeviceScreen("data:image/png;base64,example", "example.png", true);
  const current = [
    createMockup("iphone-17-pro-front", screen),
    createMockup("iphone-17-front", screen, 1),
  ];
  const layout = getDeviceLayout("duo-split");
  assert.ok(layout);

  const result = applyLayoutToMockups(current, layout, screen);
  assert.equal(result.length, 2);
  assert.equal(result[0].screen.src, screen.src);
  assert.deepEqual(result[0].position, layout.slots[0].position);
  assert.deepEqual(result[1].position, layout.slots[1].position);
});

test("center stage keeps portrait phones inside a safe canvas scale", () => {
  const screen = createDeviceScreen("phone", "phone.png", true);
  const phone = createMockup("iphone-17-pro-front", screen);
  const layout = getDeviceLayout("center-stage");
  assert.ok(layout);

  const [result] = applyLayoutToMockups([phone], layout, screen);
  assert.equal(result.size, 0.28);
  assert.deepEqual(result.position, { x: 0.5, y: 0.5 });
});

test("leaving a layout restores the prior arrangement without losing a replaced screen", () => {
  const original = createMockup("iphone-17-pro-front", createDeviceScreen("old", "old.png", true));
  original.position = { x: 0.32, y: 0.61 };
  original.size = 0.21;
  original.rotation = -8;
  const snapshot = cloneMockups([original]);

  const layout = getDeviceLayout("center-stage");
  assert.ok(layout);
  const arranged = applyLayoutToMockups([original], layout, original.screen);
  arranged[0].screen = createDeviceScreen("new", "new.png", true);

  const [restored] = restoreMockupsFromLayoutSnapshot(snapshot, arranged);
  assert.deepEqual(restored.position, original.position);
  assert.equal(restored.size, original.size);
  assert.equal(restored.rotation, original.rotation);
  assert.equal(restored.screen.src, "new");
});

test("product suite creates one laptop, phone, and watch without losing content", () => {
  const screen = createDeviceScreen("data:image/png;base64,suite", "suite.png");
  const layout = getDeviceLayout("product-suite");
  assert.ok(layout);
  assert.equal(layout.slots[0].definitionId, "macbook-pro-studio-front");

  const result = applyLayoutToMockups([], layout, screen);
  const families = result.map((mockup) => getMockupDefinition(mockup.definitionId)?.family);
  assert.deepEqual(families, ["laptop", "phone", "watch"]);
  assert.ok(result.every((mockup) => mockup.screen.src === screen.src));
});

test("product suite preserves independent images while matching device families", () => {
  const phone = createMockup("iphone-17-pro-front", createDeviceScreen("phone", "phone.png", true));
  const watch = createMockup("apple-watch-midnight-pride-sport-loop", createDeviceScreen("watch", "watch.png", true), 1);
  const layout = getDeviceLayout("product-suite");
  assert.ok(layout);

  const result = applyLayoutToMockups([phone, watch], layout, createDeviceScreen("fallback", null));
  const screenSources = new Set(result.map((mockup) => mockup.screen.src));
  assert.ok(screenSources.has("phone"));
  assert.ok(screenSources.has("watch"));
});
