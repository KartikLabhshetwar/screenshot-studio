import { getDefaultDefinition, getMockupDefinition } from "@/lib/constants/mockups";
import type { DeviceLayoutDefinition, DeviceScreenContent, Mockup } from "@/types/mockup";

export function createDeviceScreen(
  src: string | null,
  name: string | null,
  isCustom = false,
): DeviceScreenContent {
  return {
    src,
    name,
    fit: "cover",
    scale: 1,
    offset: { x: 0, y: 0 },
    isCustom,
  };
}

export function compactDeviceScreenForDraft(
  screen: DeviceScreenContent,
  uploadedImageUrl: string | null,
): DeviceScreenContent {
  const { sourceRef: _sourceRef, ...rest } = screen;
  if (!screen.isCustom && screen.src && screen.src === uploadedImageUrl) {
    return { ...rest, src: null, sourceRef: "uploaded-image" };
  }
  return rest;
}

export function restoreDeviceScreenFromDraft(
  screen: DeviceScreenContent,
  uploadedImageUrl: string | null,
  imageName: string | null,
  deviceScreenAssets: Readonly<Record<string, string>> = {},
): DeviceScreenContent {
  const { sourceRef, ...rest } = screen;
  if (sourceRef === "uploaded-image") {
    return {
      ...rest,
      src: uploadedImageUrl,
      name: rest.name ?? imageName,
    };
  }
  if (sourceRef?.startsWith("device-screen:")) {
    return {
      ...rest,
      src: deviceScreenAssets[sourceRef.slice("device-screen:".length)] ?? rest.src,
    };
  }
  return rest;
}

export function createMockup(
  definitionId: string,
  screen: DeviceScreenContent,
  index = 0,
): Mockup {
  return {
    id: `device-${Date.now()}-${index}-${Math.random().toString(36).slice(2, 8)}`,
    definitionId,
    position: { x: 0.5 + index * 0.03, y: 0.5 + index * 0.03 },
    size: 0.34,
    rotation: 0,
    opacity: 1,
    isVisible: true,
    screen,
  };
}

export function cloneMockups(mockups: Mockup[]): Mockup[] {
  return mockups.map((mockup) => ({
    ...mockup,
    position: { ...mockup.position },
    screen: { ...mockup.screen, offset: { ...mockup.screen.offset } },
  }));
}

export function hasVisibleMockups(mockups: readonly Mockup[]): boolean {
  return mockups.some((mockup) => (
    mockup.isVisible && Boolean(getMockupDefinition(mockup.definitionId))
  ));
}

export function shouldRenderSourceImage(
  editorMode: "screenshot" | "browser" | "device",
  mockups: readonly Mockup[],
): boolean {
  return editorMode !== "device" || mockups.length === 0;
}

export function restoreMockupsFromLayoutSnapshot(snapshot: Mockup[], current: Mockup[]): Mockup[] {
  const currentById = new Map(current.map((mockup) => [mockup.id, mockup]));

  return snapshot.map((mockup) => {
    const currentMockup = currentById.get(mockup.id);
    return {
      ...mockup,
      position: { ...mockup.position },
      screen: currentMockup
        ? { ...currentMockup.screen, offset: { ...currentMockup.screen.offset } }
        : { ...mockup.screen, offset: { ...mockup.screen.offset } },
    };
  });
}

export function applyLayoutToMockups(
  current: Mockup[],
  layout: DeviceLayoutDefinition,
  fallbackScreen: DeviceScreenContent,
): Mockup[] {
  const usedIndexes = new Set<number>();

  return layout.slots.map((slot, index) => {
    let existingIndex = -1;
    if (slot.family) {
      existingIndex = current.findIndex((mockup, mockupIndex) => (
        !usedIndexes.has(mockupIndex)
        && getMockupDefinition(mockup.definitionId)?.family === slot.family
      ));
    } else if (current[index]) {
      existingIndex = index;
    }
    if (existingIndex === -1) {
      existingIndex = current.findIndex((_mockup, mockupIndex) => !usedIndexes.has(mockupIndex));
    }
    if (existingIndex >= 0) usedIndexes.add(existingIndex);
    const existing = existingIndex >= 0 ? current[existingIndex] : undefined;
    const definitionId = slot.definitionId
      ?? existing?.definitionId
      ?? getDefaultDefinition(slot.family ?? "phone").id;
    const family = getMockupDefinition(definitionId)?.family;
    const mockup = existing
      ? { ...existing, definitionId }
      : createMockup(definitionId, { ...fallbackScreen, offset: { ...fallbackScreen.offset } }, index);

    return {
      ...mockup,
      position: { ...slot.position },
      size: (family && slot.sizeByFamily?.[family]) ?? slot.size,
      rotation: slot.rotation,
      isVisible: true,
    };
  });
}
