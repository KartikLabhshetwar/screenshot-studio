export type DeviceFamily = "phone" | "watch" | "tablet" | "laptop" | "desktop";
export type DeviceFinish = "light" | "dark" | "graphite";
export type DevicePerspective = "front" | "left" | "right";
export type DeviceImageFit = "cover" | "contain";
export type DeviceScreenSourceRef = "uploaded-image" | `device-screen:${string}`;

export interface DeviceFrameAsset {
  src: string;
  maskSrc: string;
  screen: { x: number; y: number; width: number; height: number };
  emptyStatePosition?: { x: number; y: number };
  emptyStateWidth?: number;
  emptyStateTransform?: string;
}
export type DeviceLayoutId =
  | "center-stage"
  | "editorial-offset"
  | "duo-split"
  | "duo-depth"
  | "trio-fan"
  | "product-suite";

export interface MockupDefinition {
  id: string;
  name: string;
  family: DeviceFamily;
  finish: DeviceFinish;
  perspective: DevicePerspective;
  aspectRatio: number;
  asset?: DeviceFrameAsset;
}

export interface DeviceScreenContent {
  src: string | null;
  name: string | null;
  fit: DeviceImageFit;
  scale: number;
  offset: { x: number; y: number };
  isCustom: boolean;
  sourceRef?: DeviceScreenSourceRef;
}

export interface Mockup {
  id: string;
  definitionId: string;
  position: { x: number; y: number };
  size: number;
  rotation: number;
  opacity: number;
  isVisible: boolean;
  screen: DeviceScreenContent;
}

export interface DeviceLayoutSlot {
  family?: DeviceFamily;
  definitionId?: string;
  position: { x: number; y: number };
  size: number;
  sizeByFamily?: Partial<Record<DeviceFamily, number>>;
  rotation: number;
}

export interface DeviceLayoutDefinition {
  id: DeviceLayoutId;
  name: string;
  description: string;
  slots: DeviceLayoutSlot[];
}
