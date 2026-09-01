import type {
  DeviceFamily,
  DeviceLayoutDefinition,
  MockupDefinition,
} from "@/types/mockup";

export const MAX_DEVICE_MOCKUPS = 6;

export const MOCKUP_DEFINITIONS: MockupDefinition[] = [
  {
    id: "iphone-17-pro-front",
    name: "iPhone 17 Pro",
    family: "phone",
    finish: "dark",
    perspective: "front",
    aspectRatio: 0.485446,
    asset: {
      src: "/device-mockups/iphone-17-pro-front.png",
      maskSrc: "/device-mockups/iphone-17-pro-front-screen-mask.png",
      screen: { x: 0.043037, y: 0.017606, width: 0.913926, height: 0.964789 },
    },
  },
  {
    id: "iphone-17-front",
    name: "iPhone 17",
    family: "phone",
    finish: "dark",
    perspective: "front",
    aspectRatio: 0.483752,
    asset: {
      src: "/device-mockups/iphone-17-front.png",
      maskSrc: "/device-mockups/iphone-17-front-screen-mask.png",
      screen: { x: 0.038931, y: 0.016248, width: 0.920611, height: 0.967873 },
    },
  },
  {
    id: "iphone-15-perspective",
    name: "iPhone 15",
    family: "phone",
    finish: "dark",
    perspective: "right",
    aspectRatio: 0.797583,
    asset: {
      src: "/device-mockups/iphone-15-perspective.png",
      maskSrc: "/device-mockups/iphone-15-perspective-screen-mask.png",
      screen: { x: 0.051948, y: 0.014674, width: 0.945887, height: 0.941303 },
      emptyStatePosition: { x: 0.479, y: 0.5026 },
      emptyStateWidth: 0.47,
      emptyStateTransform: "matrix(1, -0.19, 0.46, 1, 0, 0)",
    },
  },
  {
    id: "iphone-13-perspective",
    name: "iPhone 13",
    family: "phone",
    finish: "dark",
    perspective: "right",
    aspectRatio: 0.915354,
    asset: {
      src: "/device-mockups/iphone-13-perspective.png",
      maskSrc: "/device-mockups/iphone-13-perspective-screen-mask.png",
      screen: { x: 0.017634, y: 0.022835, width: 0.570323, height: 0.934646 },
      emptyStatePosition: { x: 0.4113, y: 0.4965 },
      emptyStateWidth: 0.6,
      emptyStateTransform: "matrix(1, 0.123, -0.07, 1, 0, 0)",
    },
  },
  {
    id: "iphone-14-pro-landscape",
    name: "iPhone 14 Pro",
    family: "phone",
    finish: "dark",
    perspective: "right",
    aspectRatio: 2.888345,
    asset: {
      src: "/device-mockups/iphone-14-pro-landscape.png",
      maskSrc: "/device-mockups/iphone-14-pro-landscape-screen-mask.png",
      screen: { x: 0.036623, y: 0.029383, width: 0.929807, height: 0.735553 },
      emptyStatePosition: { x: 0.5055, y: 0.5084 },
    },
  },
  {
    id: "apple-watch-ultra-trail-loop",
    name: "Apple Watch Ultra with Trail Loop",
    family: "watch",
    finish: "graphite",
    perspective: "front",
    aspectRatio: 0.63048,
    asset: {
      src: "/device-mockups/apple-watch-ultra-trail-loop.png",
      maskSrc: "/device-mockups/apple-watch-ultra-trail-loop-screen-mask.png",
      screen: { x: 0.139073, y: 0.23382, width: 0.662252, height: 0.521921 },
    },
  },
  {
    id: "apple-watch-ultra-ocean-band",
    name: "Apple Watch Ultra with Ocean Band",
    family: "watch",
    finish: "graphite",
    perspective: "front",
    aspectRatio: 0.611667,
    asset: {
      src: "/device-mockups/apple-watch-ultra-ocean-band.png",
      maskSrc: "/device-mockups/apple-watch-ultra-ocean-band-screen-mask.png",
      screen: { x: 0.065137, y: 0.207968, width: 0.816878, height: 0.599349 },
    },
  },
  {
    id: "apple-watch-red-braided-solo-loop",
    name: "Apple Watch Red with Braided Solo Loop",
    family: "watch",
    finish: "dark",
    perspective: "front",
    aspectRatio: 0.599558,
    asset: {
      src: "/device-mockups/apple-watch-red-braided-solo-loop.png",
      maskSrc: "/device-mockups/apple-watch-red-braided-solo-loop-screen-mask.png",
      screen: { x: 0.147601, y: 0.247788, width: 0.682657, height: 0.495575 },
    },
  },
  {
    id: "apple-watch-gold-orange-leather-band",
    name: "Apple Watch Gold with Orange Leather Band",
    family: "watch",
    finish: "light",
    perspective: "front",
    aspectRatio: 0.606667,
    asset: {
      src: "/device-mockups/apple-watch-gold-orange-leather-band.png",
      maskSrc: "/device-mockups/apple-watch-gold-orange-leather-band-screen-mask.png",
      screen: { x: 0.150183, y: 0.246667, width: 0.677656, height: 0.497778 },
    },
  },
  {
    id: "apple-watch-silver-blue-sport-band",
    name: "Apple Watch Silver with Blue Sport Band",
    family: "watch",
    finish: "light",
    perspective: "front",
    aspectRatio: 0.602222,
    asset: {
      src: "/device-mockups/apple-watch-silver-blue-sport-band.png",
      maskSrc: "/device-mockups/apple-watch-silver-blue-sport-band-screen-mask.png",
      screen: { x: 0.147601, y: 0.246667, width: 0.682657, height: 0.497778 },
    },
  },
  {
    id: "apple-watch-midnight-pride-sport-loop",
    name: "Apple Watch Midnight with Pride Sport Loop",
    family: "watch",
    finish: "dark",
    perspective: "front",
    aspectRatio: 0.603982,
    asset: {
      src: "/device-mockups/apple-watch-midnight-pride-sport-loop.png",
      maskSrc: "/device-mockups/apple-watch-midnight-pride-sport-loop-screen-mask.png",
      screen: { x: 0.150183, y: 0.247788, width: 0.677656, height: 0.495575 },
    },
  },
  {
    id: "apple-watch-gold-milanese-loop",
    name: "Apple Watch Gold with Milanese Loop",
    family: "watch",
    finish: "light",
    perspective: "front",
    aspectRatio: 0.606667,
    asset: {
      src: "/device-mockups/apple-watch-gold-milanese-loop.png",
      maskSrc: "/device-mockups/apple-watch-gold-milanese-loop-screen-mask.png",
      screen: { x: 0.150183, y: 0.246667, width: 0.677656, height: 0.497778 },
    },
  },
  {
    id: "macbook-pro-studio-front",
    name: "MacBook Pro",
    family: "laptop",
    finish: "dark",
    perspective: "front",
    aspectRatio: 1.6598,
    asset: {
      src: "/device-mockups/macbook-pro-studio-front.png",
      maskSrc: "/device-mockups/macbook-pro-studio-front-screen-mask.png",
      screen: { x: 0.088896, y: 0.058463, width: 0.817846, height: 0.841314 },
    },
  },
  {
    id: "macbook-neo-front",
    name: "MacBook Neo",
    family: "laptop",
    finish: "dark",
    perspective: "front",
    aspectRatio: 1.640785,
    asset: {
      src: "/device-mockups/macbook-neo-front.png",
      maskSrc: "/device-mockups/macbook-neo-front-screen-mask.png",
      screen: { x: 0.097764, y: 0.043942, width: 0.804732, height: 0.825085 },
    },
  },
  {
    id: "macbook-air-15-perspective",
    name: "MacBook Air 15-inch",
    family: "laptop",
    finish: "dark",
    perspective: "right",
    aspectRatio: 0.978252,
    asset: {
      src: "/device-mockups/macbook-air-15-perspective.png",
      maskSrc: "/device-mockups/macbook-air-15-perspective-screen-mask.png",
      screen: { x: 0.016779, y: 0.016003, width: 0.633389, height: 0.666803 },
      emptyStatePosition: { x: 0.5038, y: 0.4932 },
      emptyStateWidth: 0.82,
      emptyStateTransform: "matrix(0.9, -0.49, 0.18, 1, 0, 0)",
    },
  },
  {
    id: "macbook-pro-14-front",
    name: "MacBook Pro 14-inch",
    family: "laptop",
    finish: "dark",
    perspective: "front",
    aspectRatio: 1.652893,
    asset: {
      src: "/device-mockups/macbook-pro-14-front.png",
      maskSrc: "/device-mockups/macbook-pro-14-front-screen-mask.png",
      screen: { x: 0.104712, y: 0.027682, width: 0.790576, height: 0.847751 },
    },
  },
  {
    id: "macbook-pro-16-front",
    name: "MacBook Pro 16-inch",
    family: "laptop",
    finish: "dark",
    perspective: "front",
    aspectRatio: 1.633606,
    asset: {
      src: "/device-mockups/macbook-pro-16-front.png",
      maskSrc: "/device-mockups/macbook-pro-16-front-screen-mask.png",
      screen: { x: 0.092068, y: 0.024691, width: 0.815864, height: 0.861111 },
    },
  },
];

const MOCKUP_DEFINITION_BY_ID = new Map(
  MOCKUP_DEFINITIONS.map((definition) => [definition.id, definition]),
);

const LEGACY_MOCKUP_DEFINITION_IDS = new Map([
  ["iphone-1", "iphone-17-pro-front"],
  ["iwatch-1", "apple-watch-midnight-pride-sport-loop"],
  ["mac-1", "macbook-pro-studio-front"],
  ["imac-1", "macbook-pro-studio-front"],
]);

export const DEVICE_LAYOUTS: DeviceLayoutDefinition[] = [
  {
    id: "center-stage",
    name: "Center Stage",
    description: "A single device with balanced focus.",
    slots: [{
      position: { x: 0.5, y: 0.5 },
      size: 0.42,
      sizeByFamily: { phone: 0.28, watch: 0.2 },
      rotation: 0,
    }],
  },
  {
    id: "editorial-offset",
    name: "Editorial Offset",
    description: "An asymmetric layout with room for copy.",
    slots: [{ position: { x: 0.62, y: 0.5 }, size: 0.4, rotation: 4 }],
  },
  {
    id: "duo-split",
    name: "Duo Split",
    description: "Two devices presented side by side.",
    slots: [
      { position: { x: 0.34, y: 0.51 }, size: 0.3, rotation: -4 },
      { position: { x: 0.66, y: 0.49 }, size: 0.3, rotation: 4 },
    ],
  },
  {
    id: "duo-depth",
    name: "Duo Depth",
    description: "A layered pair with visual depth.",
    slots: [
      { position: { x: 0.42, y: 0.51 }, size: 0.37, rotation: -5 },
      { position: { x: 0.64, y: 0.48 }, size: 0.25, rotation: 7 },
    ],
  },
  {
    id: "trio-fan",
    name: "Trio Fan",
    description: "Three devices in a compact fan.",
    slots: [
      { position: { x: 0.34, y: 0.52 }, size: 0.25, rotation: -10 },
      { position: { x: 0.5, y: 0.47 }, size: 0.28, rotation: 0 },
      { position: { x: 0.66, y: 0.52 }, size: 0.25, rotation: 10 },
    ],
  },
  {
    id: "product-suite",
    name: "Product Suite",
    description: "Laptop, phone, and watch together.",
    slots: [
      { family: "laptop", definitionId: "macbook-pro-studio-front", position: { x: 0.47, y: 0.48 }, size: 0.53, rotation: 0 },
      { family: "phone", definitionId: "iphone-17-pro-front", position: { x: 0.75, y: 0.58 }, size: 0.16, rotation: 4 },
      { family: "watch", definitionId: "apple-watch-midnight-pride-sport-loop", position: { x: 0.2, y: 0.61 }, size: 0.13, rotation: -6 },
    ],
  },
];

export function getMockupDefinition(id: string): MockupDefinition | undefined {
  return MOCKUP_DEFINITION_BY_ID.get(id);
}

export function resolveMockupDefinitionId(id: string): string | null {
  if (MOCKUP_DEFINITION_BY_ID.has(id)) return id;

  const replacementId = LEGACY_MOCKUP_DEFINITION_IDS.get(id);
  return replacementId && MOCKUP_DEFINITION_BY_ID.has(replacementId)
    ? replacementId
    : null;
}

export function getMockupsByFamily(family: DeviceFamily): MockupDefinition[] {
  return MOCKUP_DEFINITIONS.filter((definition) => definition.family === family);
}

export function getDeviceLayout(id: string): DeviceLayoutDefinition | undefined {
  return DEVICE_LAYOUTS.find((layout) => layout.id === id);
}

export function getDefaultDefinition(family: DeviceFamily): MockupDefinition {
  return MOCKUP_DEFINITIONS.find((definition) => definition.family === family && definition.perspective === "front" && definition.finish === "dark")
    ?? MOCKUP_DEFINITIONS.find((definition) => definition.family === family)
    ?? MOCKUP_DEFINITIONS[0];
}
