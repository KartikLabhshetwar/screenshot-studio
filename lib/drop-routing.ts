export const DEVICE_SCREEN_DROPZONE_SELECTOR = "[data-device-screen-dropzone]";

interface ClosestTarget extends EventTarget {
  closest: (selector: string) => unknown;
}

function hasClosest(target: EventTarget | null): target is ClosestTarget {
  return typeof (target as Partial<ClosestTarget> | null)?.closest === "function";
}

export function isDeviceScreenDropTarget(target: EventTarget | null): boolean {
  return hasClosest(target) && Boolean(target.closest(DEVICE_SCREEN_DROPZONE_SELECTOR));
}
