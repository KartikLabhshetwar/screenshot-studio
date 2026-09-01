import assert from "node:assert/strict";
import test from "node:test";
import {
  DEVICE_SCREEN_DROPZONE_SELECTOR,
  isDeviceScreenDropTarget,
} from "../lib/drop-routing";

test("global image drops yield to device screen drop targets", () => {
  let receivedSelector = "";
  const deviceChild = {
    closest: (selector: string) => {
      receivedSelector = selector;
      return {};
    },
  } as unknown as EventTarget;
  const canvas = {
    closest: () => null,
  } as unknown as EventTarget;

  assert.equal(isDeviceScreenDropTarget(deviceChild), true);
  assert.equal(receivedSelector, DEVICE_SCREEN_DROPZONE_SELECTOR);
  assert.equal(isDeviceScreenDropTarget(canvas), false);
  assert.equal(isDeviceScreenDropTarget(null), false);
});
