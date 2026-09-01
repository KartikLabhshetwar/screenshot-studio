import assert from "node:assert/strict";
import test from "node:test";
import {
  buildOverlayShadowFilter,
  buildOverlayTiltTransform,
  fitOverlayImage,
  hasOverlayTilt,
} from "../lib/overlay-style";

test("overlays without tilt render no 3D transform", () => {
  assert.equal(buildOverlayTiltTransform(undefined), undefined);
  assert.equal(
    buildOverlayTiltTransform({ perspective: 600, rotateX: 0, rotateY: 0, rotateZ: 0 }),
    undefined
  );
});

test("tilted overlays render rotateX, rotateY and rotateZ in order", () => {
  assert.equal(
    buildOverlayTiltTransform({ perspective: 600, rotateX: 12, rotateY: -20, rotateZ: 3 }),
    "rotateX(12deg) rotateY(-20deg) rotateZ(3deg)"
  );
});

test("hasOverlayTilt is true only when some axis is rotated", () => {
  assert.equal(hasOverlayTilt(undefined), false);
  assert.equal(hasOverlayTilt({ perspective: 600, rotateX: 0, rotateY: 0, rotateZ: 0 }), false);
  assert.equal(hasOverlayTilt({ perspective: 600, rotateX: 0, rotateY: 15, rotateZ: 0 }), true);
});

test("disabled or missing shadows render no filter", () => {
  assert.equal(buildOverlayShadowFilter(undefined), undefined);
  assert.equal(
    buildOverlayShadowFilter({
      enabled: false,
      blur: 15,
      offsetX: 5,
      offsetY: 8,
      spread: 3,
      color: "rgba(0, 0, 0, 0.6)",
      opacity: 0.5,
    }),
    undefined
  );
});

test("enabled shadows render a drop-shadow using blur plus spread and the shadow opacity", () => {
  assert.equal(
    buildOverlayShadowFilter({
      enabled: true,
      blur: 10,
      offsetX: 4,
      offsetY: 6,
      spread: 2,
      color: "#102030",
      opacity: 0.4,
    }),
    "drop-shadow(4px 6px 12px rgba(16, 32, 48, 0.4))"
  );
});

test("landscape overlays fill the box width and keep their aspect ratio", () => {
  assert.deepEqual(fitOverlayImage(200, 1600, 1000), { width: 200, height: 125 });
});

test("portrait overlays fill the box height and keep their aspect ratio", () => {
  assert.deepEqual(fitOverlayImage(200, 500, 1000), { width: 100, height: 200 });
});

test("overlays with unknown natural size fill the box", () => {
  assert.deepEqual(fitOverlayImage(200, 0, 0), { width: 200, height: 200 });
});
