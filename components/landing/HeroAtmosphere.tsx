"use client";

import dynamic from "next/dynamic";
import { useReducedMotion } from "motion/react";

const Beams = dynamic(() => import("./beams/Beams").then((m) => m.Beams), {
  ssr: false,
});

export function HeroAtmosphere(): React.JSX.Element | null {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) return null;

  return (
    <div
      aria-hidden="true"
      // Fixed height (not inset-0) so nav compact/expand doesn’t resize the WebGL canvas
      className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[min(920px,100svh)] overflow-hidden"
    >
      <div className="absolute inset-y-0 right-0 w-[min(720px,70%)] opacity-[0.28] [mask-image:linear-gradient(90deg,transparent_0%,black_28%,black_100%)] [-webkit-mask-image:linear-gradient(90deg,transparent_0%,black_28%,black_100%)]">
        <div className="absolute inset-0 opacity-80 mix-blend-screen">
          <Beams
            beamWidth={1.6}
            beamHeight={18}
            beamNumber={8}
            lightColor="#f5f5f5"
            speed={0.7}
            noiseIntensity={1.15}
            scale={0.14}
            rotation={28}
          />
        </div>
      </div>
    </div>
  );
}
