import {
  getMockupDefinition,
  resolveMockupDefinitionId,
} from "@/lib/constants/mockups";
import {
  createDeviceScreen,
  restoreDeviceScreenFromDraft,
} from "@/lib/device-mockups/layouts";
import type { DeviceImageFit, Mockup } from "@/types/mockup";

interface DraftMockup extends Omit<Mockup, "screen"> {
  screen?: Mockup["screen"];
  imageFit?: DeviceImageFit | "fill";
}

interface DraftCanvasDimensions {
  canvasW: number;
  canvasH: number;
}

interface NormalizeDraftMockupsOptions {
  uploadedImageUrl: string | null;
  imageName: string | null;
  canvasDimensions?: DraftCanvasDimensions | null;
  deviceScreenAssets?: Readonly<Record<string, string>>;
}

type EditorMode = "screenshot" | "browser" | "device";

const LEGACY_ASPECT_RATIOS: Record<string, number> = {
  "iphone-1": 9 / 16,
  "iwatch-1": 1,
  "mac-1": 16 / 9,
  "imac-1": 2146 / 1207,
};

function normalizeLegacyGeometry(
  mockup: DraftMockup,
  canvasDimensions: DraftCanvasDimensions | null | undefined,
): Pick<Mockup, "position" | "size"> {
  const canvasWidth = canvasDimensions?.canvasW && canvasDimensions.canvasW > 0
    ? canvasDimensions.canvasW
    : 1920;
  const canvasHeight = canvasDimensions?.canvasH && canvasDimensions.canvasH > 0
    ? canvasDimensions.canvasH
    : 1080;
  const width = Number.isFinite(mockup.size) && mockup.size > 0
    ? mockup.size
    : canvasWidth * 0.3;
  const aspectRatio = LEGACY_ASPECT_RATIOS[mockup.definitionId]
    ?? getMockupDefinition(mockup.definitionId)?.aspectRatio
    ?? 1;

  return {
    size: Math.max(0.08, Math.min(0.9, width / canvasWidth)),
    position: {
      x: (mockup.position.x + width / 2) / canvasWidth,
      y: (mockup.position.y + width / aspectRatio / 2) / canvasHeight,
    },
  };
}

export function normalizeDraftMockups(
  draftMockups: readonly Mockup[] | undefined,
  options: NormalizeDraftMockupsOptions,
): { mockups: Mockup[]; migratedLegacyMockups: boolean } {
  let migratedLegacyMockups = false;
  const mockups = (draftMockups ?? []).flatMap((storedMockup) => {
    const mockup = storedMockup as DraftMockup;
    const definitionId = resolveMockupDefinitionId(mockup.definitionId);
    if (!definitionId) return [];

    const isLegacyMockup = mockup.screen === undefined;
    migratedLegacyMockups ||= isLegacyMockup;
    const inheritedScreen = createDeviceScreen(
      options.uploadedImageUrl,
      options.imageName,
    );
    const screen = restoreDeviceScreenFromDraft(
      mockup.screen ?? {
        ...inheritedScreen,
        fit: mockup.imageFit === "contain" ? "contain" : "cover",
      },
      options.uploadedImageUrl,
      options.imageName,
      options.deviceScreenAssets,
    );
    const geometry = isLegacyMockup
      ? normalizeLegacyGeometry(mockup, options.canvasDimensions)
      : { position: mockup.position, size: mockup.size };

    return [{
      id: mockup.id,
      definitionId,
      position: geometry.position,
      size: geometry.size,
      rotation: mockup.rotation,
      opacity: mockup.opacity,
      isVisible: mockup.isVisible,
      screen,
    }];
  });

  return { mockups, migratedLegacyMockups };
}

export function resolveRestoredEditorMode(
  editorMode: EditorMode | undefined,
  migratedLegacyMockups: boolean,
): EditorMode | undefined {
  return migratedLegacyMockups ? "device" : editorMode;
}
