"use client";

import {
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { AspectRatioIcon, Globe02Icon, Image01Icon } from "hugeicons-react";
import {
  getBackgroundCSS,
  type BackgroundConfig,
} from "@/lib/constants/backgrounds";
import { cn } from "@/lib/utils";
import { trackCTAClick } from "@/lib/analytics";

type AspectId = "16:9" | "1:1" | "9:16";
type LayoutId = "flat" | "tilt-left" | "tilt-right" | "float";
type BgKind = "mesh" | "glow" | "gradient" | "solid";

const ASPECTS: { id: AspectId; label: string; w: number; h: number }[] = [
  { id: "16:9", label: "16:9", w: 16, h: 9 },
  { id: "1:1", label: "1:1", w: 1, h: 1 },
  { id: "9:16", label: "9:16", w: 9, h: 16 },
];

const BG_KINDS: { id: BgKind; label: string }[] = [
  { id: "mesh", label: "Mesh" },
  { id: "glow", label: "Glow" },
  { id: "gradient", label: "Grad" },
  { id: "solid", label: "Solid" },
];

const BACKGROUNDS: {
  id: string;
  label: string;
  kind: BgKind;
  config: BackgroundConfig;
}[] = [
  {
    id: "mesh-warm",
    label: "Warm",
    kind: "mesh",
    config: { type: "gradient", value: "mesh:mesh_warm" },
  },
  {
    id: "mesh-ocean",
    label: "Ocean",
    kind: "mesh",
    config: { type: "gradient", value: "mesh:mesh_ocean" },
  },
  {
    id: "mesh-forest",
    label: "Forest",
    kind: "mesh",
    config: { type: "gradient", value: "mesh:mesh_forest" },
  },
  {
    id: "mesh-peach",
    label: "Peach",
    kind: "mesh",
    config: { type: "gradient", value: "mesh:mesh_peach" },
  },
  {
    id: "mesh-mint",
    label: "Mint",
    kind: "mesh",
    config: { type: "gradient", value: "mesh:mesh_mint" },
  },
  {
    id: "mesh-rose",
    label: "Rose",
    kind: "mesh",
    config: { type: "gradient", value: "mesh:mesh_rose" },
  },
  {
    id: "mesh-sunset",
    label: "Sunset",
    kind: "mesh",
    config: { type: "gradient", value: "mesh:mesh_sunset" },
  },
  {
    id: "mesh-aurora",
    label: "Aurora",
    kind: "mesh",
    config: { type: "gradient", value: "mesh:mesh_aurora" },
  },
  {
    id: "mesh-cosmic",
    label: "Cosmic",
    kind: "mesh",
    config: { type: "gradient", value: "mesh:mesh_cosmic" },
  },
  {
    id: "glow-gold",
    label: "Gold",
    kind: "glow",
    config: { type: "gradient", value: "magic:magic_gold_center" },
  },
  {
    id: "glow-cyan",
    label: "Cyan",
    kind: "glow",
    config: { type: "gradient", value: "magic:magic_cyan_center" },
  },
  {
    id: "glow-mint",
    label: "Mint",
    kind: "glow",
    config: { type: "gradient", value: "magic:magic_mint_center" },
  },
  {
    id: "glow-orange",
    label: "Orange",
    kind: "glow",
    config: { type: "gradient", value: "magic:magic_orange_glow" },
  },
  {
    id: "glow-silver",
    label: "Silver",
    kind: "glow",
    config: { type: "gradient", value: "magic:magic_silver_center" },
  },
  {
    id: "glow-teal",
    label: "Teal",
    kind: "glow",
    config: { type: "gradient", value: "magic:magic_teal_center" },
  },
  {
    id: "glow-amber",
    label: "Amber",
    kind: "glow",
    config: { type: "gradient", value: "magic:magic_amber_center" },
  },
  {
    id: "glow-ring",
    label: "Ring",
    kind: "glow",
    config: { type: "gradient", value: "magic:magic_gold_ring" },
  },
  {
    id: "glow-corner",
    label: "Corner",
    kind: "glow",
    config: { type: "gradient", value: "magic:magic_silver_topleft" },
  },
  {
    id: "grad-warm",
    label: "Warm",
    kind: "gradient",
    config: { type: "gradient", value: "vibrant_orange_pink" },
  },
  {
    id: "grad-teal",
    label: "Teal",
    kind: "gradient",
    config: { type: "gradient", value: "green_teal_navy" },
  },
  {
    id: "grad-ocean",
    label: "Ocean",
    kind: "gradient",
    config: { type: "gradient", value: "teal_navy" },
  },
  {
    id: "grad-peach",
    label: "Peach",
    kind: "gradient",
    config: { type: "gradient", value: "peach_coral" },
  },
  {
    id: "grad-lime",
    label: "Lime",
    kind: "gradient",
    config: { type: "gradient", value: "cyan_lime" },
  },
  {
    id: "grad-sky",
    label: "Sky",
    kind: "gradient",
    config: { type: "gradient", value: "sky_blue" },
  },
  {
    id: "grad-mint",
    label: "Mint",
    kind: "gradient",
    config: { type: "gradient", value: "mint_sky" },
  },
  {
    id: "grad-night",
    label: "Night",
    kind: "gradient",
    config: { type: "gradient", value: "navy_blue" },
  },
  {
    id: "grad-flare",
    label: "Flare",
    kind: "gradient",
    config: { type: "gradient", value: "pink_orange" },
  },
  {
    id: "solid-ink",
    label: "Ink",
    kind: "solid",
    config: { type: "solid", value: "#0a0a0a" },
  },
  {
    id: "solid-charcoal",
    label: "Charcoal",
    kind: "solid",
    config: { type: "solid", value: "#171717" },
  },
  {
    id: "solid-slate",
    label: "Slate",
    kind: "solid",
    config: { type: "solid", value: "#2a2a2a" },
  },
  {
    id: "solid-paper",
    label: "Paper",
    kind: "solid",
    config: { type: "solid", value: "#e8e4df" },
  },
  {
    id: "solid-white",
    label: "White",
    kind: "solid",
    config: { type: "solid", value: "#ffffff" },
  },
  {
    id: "solid-sand",
    label: "Sand",
    kind: "solid",
    config: { type: "solid", value: "#fff5e6" },
  },
  {
    id: "solid-blue",
    label: "Blue",
    kind: "solid",
    config: { type: "solid", value: "medium_blue" },
  },
  {
    id: "solid-coral",
    label: "Coral",
    kind: "solid",
    config: { type: "solid", value: "coral_red" },
  },
  {
    id: "solid-mint",
    label: "Mint",
    kind: "solid",
    config: { type: "solid", value: "light_mint_green" },
  },
];

const LAYOUTS: {
  id: LayoutId;
  label: string;
  transform: string;
}[] = [
  {
    id: "flat",
    label: "Flat",
    transform: "none",
  },
  {
    id: "tilt-left",
    label: "Left",
    transform: "perspective(900px) rotateY(12deg) rotateX(3deg)",
  },
  {
    id: "tilt-right",
    label: "Right",
    transform: "perspective(900px) rotateY(-12deg) rotateX(3deg)",
  },
  {
    id: "float",
    label: "Float",
    transform: "perspective(900px) rotateX(6deg) translateY(-2%)",
  },
];

const DEMO_BY_ASPECT: Record<
  AspectId,
  {
    src: string;
    objectClass: string;
    frameOrigin: string;
    frameScale?: number;
  }
> = {
  "16:9": {
    src: "/demo/demo-5.png",
    objectClass: "object-cover object-top",
    frameOrigin: "center top",
    frameScale: 1.03,
  },
  "1:1": {
    src: "/demo/demo-mazie-1x1.jpg",
    objectClass: "object-contain object-center",
    frameOrigin: "center center",
  },
  "9:16": {
    src: "/demo/demo-checkout-9x16.jpg",
    objectClass: "object-contain object-center",
    frameOrigin: "center center",
  },
};

const PREVIEW_DESIGN_W = 768;
const PREVIEW_DESIGN_H = 630;
const PREVIEW_SCALE_MQ = "(max-width: 767px)";

export function EditorPreview(): React.JSX.Element {
  const prefersReducedMotion = useReducedMotion();
  const scaleShellRef = useRef<HTMLDivElement>(null);
  const shotPadRef = useRef<HTMLDivElement>(null);
  const [mobileScale, setMobileScale] = useState<number | null>(null);
  const [shotPad, setShotPad] = useState({ w: 0, h: 0 });
  const [hasMeasuredShot, setHasMeasuredShot] = useState(false);
  const [aspect, setAspect] = useState<AspectId>("16:9");
  const [bgKind, setBgKind] = useState<BgKind>("solid");
  const [bgId, setBgId] = useState("solid-ink");
  const [showFrame, setShowFrame] = useState(false);
  const [layout, setLayout] = useState<LayoutId>("flat");
  const [radius, setRadius] = useState(27);
  const [padding, setPadding] = useState(26);
  const [shadow, setShadow] = useState(40);
  const [border, setBorder] = useState(6);
  const [noise, setNoise] = useState(9);
  const [shotScale, setShotScale] = useState(100);

  useLayoutEffect(() => {
    const shell = scaleShellRef.current;
    if (!shell) return;

    const mq = window.matchMedia(PREVIEW_SCALE_MQ);
    const update = (): void => {
      if (!mq.matches) {
        setMobileScale(null);
        return;
      }
      setMobileScale(shell.clientWidth / PREVIEW_DESIGN_W);
    };

    const ro = new ResizeObserver(update);
    ro.observe(shell);
    mq.addEventListener("change", update);
    update();
    return () => {
      ro.disconnect();
      mq.removeEventListener("change", update);
    };
  }, []);

  useLayoutEffect(() => {
    const pad = shotPadRef.current;
    if (!pad) return;

    const update = (): void => {
      const w = pad.clientWidth;
      const h = pad.clientHeight;
      // Ignore empty frames (common before the grid cell finishes layout).
      if (w < 2 || h < 2) return;
      setShotPad((prev) => (prev.w === w && prev.h === h ? prev : { w, h }));
    };

    update();
    // Remeasure after layout settles (first paint can still be 0×0).
    const raf = requestAnimationFrame(update);
    const ro = new ResizeObserver(update);
    ro.observe(pad);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  const kindBackgrounds = BACKGROUNDS.filter((b) => b.kind === bgKind);
  const background =
    BACKGROUNDS.find((b) => b.id === bgId) ??
    kindBackgrounds[0] ??
    BACKGROUNDS[0];
  const bgStyle = getBackgroundCSS(background.config);
  const aspectMeta = ASPECTS.find((a) => a.id === aspect) ?? ASPECTS[0];
  const demo = DEMO_BY_ASPECT[aspect];
  const demoImageClass = showFrame
    ? aspect === "16:9"
      ? "object-cover object-top"
      : "object-cover object-center"
    : demo.objectClass;
  const demoFrameScale = showFrame ? (demo.frameScale ?? 1.03) : undefined;
  const demoFrameOrigin = showFrame
    ? (demo.frameOrigin ?? "center center")
    : undefined;
  const layoutMeta = LAYOUTS.find((l) => l.id === layout) ?? LAYOUTS[0];
  const shotTransition = prefersReducedMotion
    ? undefined
    : "background-color 200ms ease-out, border-radius 200ms ease-out, box-shadow 200ms ease-out, transform 280ms cubic-bezier(0.23, 1, 0.32, 1)";

  const aspectRatio = aspectMeta.w / aspectMeta.h;
  let shotW = 0;
  let shotH = 0;
  if (shotPad.w > 0 && shotPad.h > 0) {
    shotW = shotPad.w;
    shotH = shotW / aspectRatio;
    if (shotH > shotPad.h) {
      shotH = shotPad.h;
      shotW = shotH * aspectRatio;
    }
  }
  const hasShotSize = shotW > 0 && shotH > 0;

  const selectBgKind = (kind: BgKind): void => {
    setBgKind(kind);
    const first = BACKGROUNDS.find((b) => b.kind === kind);
    if (first) setBgId(first.id);
  };

  const shotRadius = showFrame ? 10 : radius;
  const shotShadow = `0 0 0 ${border}px rgba(255,255,255,${border > 0 ? 0.2 : 0}), 0 ${6 + shadow * 0.18}px ${20 + shadow * 0.9}px rgba(0,0,0,${0.2 + shadow / 160})`;
  const aspectMorph =
    prefersReducedMotion || !hasShotSize || !hasMeasuredShot
      ? { duration: 0 }
      : { duration: 0.32, ease: [0.23, 1, 0.32, 1] as const };

  useLayoutEffect(() => {
    if (hasShotSize) setHasMeasuredShot(true);
  }, [hasShotSize]);

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.15, ease: [0.33, 1, 0.68, 1] }}
      className="relative w-full"
    >
      <div
        className="pointer-events-none absolute -inset-x-4 -inset-y-6 rounded-[28px] bg-[radial-gradient(ellipse_at_center,var(--preview-ambient-glow),transparent_70%)]"
        aria-hidden
      />

      <div
        ref={scaleShellRef}
        className={cn(
          "relative w-full",
          mobileScale != null && "overflow-hidden",
        )}
        style={
          mobileScale != null
            ? { height: PREVIEW_DESIGN_H * mobileScale }
            : undefined
        }
      >
        <div
          className={cn(
            "relative mx-auto flex flex-col border border-border bg-card",
            "shadow-[var(--preview-shell-shadow)]",
            mobileScale == null && "h-[630px] w-full lg:h-[660px]",
          )}
          style={
            {
              "--preview-r": "12px",
              "--preview-bw": "1px",
              "--preview-pad": "6px",
              "--preview-inner-r":
                "max(0px, calc(var(--preview-r) - var(--preview-bw) - var(--preview-pad)))",
              borderRadius: "var(--preview-r)",
              padding: "var(--preview-pad)",
              ...(mobileScale != null
                ? {
                    width: PREVIEW_DESIGN_W,
                    height: PREVIEW_DESIGN_H,
                    transform: `scale(${mobileScale})`,
                    transformOrigin: "top left",
                  }
                : null),
            } as CSSProperties
          }
        >
          <div
            className="relative flex min-h-0 flex-1 flex-col overflow-hidden border border-border"
            style={{ borderRadius: "var(--preview-inner-r)" }}
          >
            <div
              className="pointer-events-none absolute inset-px z-20 opacity-[0.035] mix-blend-overlay"
              style={{
                borderRadius: "max(0px, calc(var(--preview-inner-r) - 1px))",
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
              }}
              aria-hidden
            />

            <div className="relative z-30 grid h-12 shrink-0 grid-cols-[180px_minmax(0,1fr)_152px] items-center border-b border-border">
              <div className="flex min-w-0 items-center gap-2 px-3">
                <Image
                  src="/logo-mark.png"
                  alt=""
                  width={20}
                  height={20}
                  className="h-5 w-5 shrink-0"
                  aria-hidden
                />
                <span className="truncate text-[13px] font-semibold tracking-tight text-foreground">
                  Screenshot Studio
                </span>
              </div>

              <div className="flex items-center justify-center gap-0.5 px-2">
                {ASPECTS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setAspect(item.id)}
                    className={cn(
                      "inline-flex h-7 cursor-pointer items-center gap-1 px-2 text-[11px] font-medium transition-colors duration-150",
                      aspect === item.id
                        ? "text-foreground/90"
                        : "text-muted-foreground hover:text-foreground/70",
                    )}
                    aria-pressed={aspect === item.id}
                  >
                    <AspectRatioIcon size={12} />
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-end px-3">
                <Link
                  href="/"
                  onClick={() =>
                    trackCTAClick("hero-preview", "Open in editor")
                  }
                  className="inline-flex h-7 shrink-0 cursor-pointer items-center rounded-md bg-[var(--nav-cta-bg)] px-2.5 text-[11px] font-medium text-[var(--nav-cta-fg)] transition-[transform,box-shadow] duration-150 hover:shadow-[var(--nav-cta-hover-shadow)] active:scale-[0.98]"
                >
                  Open editor
                </Link>
              </div>
            </div>

            <div className="relative z-30 grid min-h-0 flex-1 grid-cols-[180px_minmax(0,1fr)_152px]">
              <aside className="flex flex-col gap-3.5 overflow-y-auto border-r border-border p-3">
                <div>
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Background
                  </p>
                  <div className="mb-2 grid grid-cols-4 gap-1">
                    {BG_KINDS.map((kind) => (
                      <button
                        key={kind.id}
                        type="button"
                        onClick={() => selectBgKind(kind.id)}
                        className={cn(
                          "h-6 cursor-pointer rounded-md text-[10px] font-medium transition-colors duration-150",
                          bgKind === kind.id
                            ? "bg-foreground/10 text-foreground"
                            : "text-muted-foreground hover:text-foreground",
                        )}
                      >
                        {kind.label}
                      </button>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {kindBackgrounds.map((item) => {
                      const swatch = getBackgroundCSS(item.config);
                      const selected = item.id === bgId;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          title={item.label}
                          aria-label={`${item.kind} background ${item.label}`}
                          aria-pressed={selected}
                          onClick={() => setBgId(item.id)}
                          className={cn(
                            "aspect-square cursor-pointer rounded-[10px] p-0.5 transition-all duration-150",
                            selected
                              ? "ring-1 ring-ring/40"
                              : "ring-1 ring-border hover:ring-ring/25",
                          )}
                        >
                          <span
                            className="block h-full w-full rounded-md"
                            style={swatch}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Frame
                  </p>
                  <div className="flex gap-1.5">
                    <FrameChip
                      active={!showFrame}
                      onClick={() => setShowFrame(false)}
                      icon={<Image01Icon size={13} />}
                      label="None"
                    />
                    <FrameChip
                      active={showFrame}
                      onClick={() => setShowFrame(true)}
                      icon={<Globe02Icon size={13} />}
                      label="Browser"
                    />
                  </div>
                </div>

                <SliderRow
                  label="Radius"
                  value={`${radius}px`}
                  min={0}
                  max={36}
                  valueNum={radius}
                  onChange={setRadius}
                  disabled={showFrame}
                />
                <SliderRow
                  label="Padding"
                  value={`${padding}px`}
                  min={16}
                  max={72}
                  valueNum={padding}
                  onChange={setPadding}
                />
                <SliderRow
                  label="Border"
                  value={`${border}px`}
                  min={0}
                  max={12}
                  valueNum={border}
                  onChange={setBorder}
                />
                <SliderRow
                  label="Noise"
                  value={`${noise}%`}
                  min={0}
                  max={40}
                  valueNum={noise}
                  onChange={setNoise}
                />
              </aside>

              <div
                className="relative min-h-0 overflow-hidden"
                style={{
                  ...bgStyle,
                  transition: prefersReducedMotion
                    ? undefined
                    : "background 280ms ease-out",
                }}
              >
                {noise > 0 ? (
                  <div
                    className="pointer-events-none absolute inset-0 z-[1]"
                    style={{
                      opacity: noise / 100,
                      backgroundImage:
                        "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
                    }}
                    aria-hidden
                  />
                ) : null}

                <div
                  className="absolute inset-0 z-[2]"
                  style={{ padding, transition: "padding 200ms ease-out" }}
                >
                  <div
                    ref={shotPadRef}
                    className="relative flex h-full w-full items-center justify-center"
                  >
                    <motion.div
                      className="relative flex flex-col overflow-hidden"
                      initial={false}
                      animate={
                        hasShotSize
                          ? { width: shotW, height: shotH }
                          : false
                      }
                      transition={aspectMorph}
                      style={{
                        // Style size is the source of truth so first paint isn't a speck
                        // if Motion hasn't applied animate yet.
                        ...(hasShotSize
                          ? { width: shotW, height: shotH }
                          : {
                              width: "100%",
                              maxWidth: "100%",
                              maxHeight: "100%",
                              aspectRatio: `${aspectMeta.w} / ${aspectMeta.h}`,
                            }),
                        // Match chrome when framed so corner AA never flashes a light gap
                        backgroundColor: showFrame ? "var(--card)" : "var(--background)",
                        borderRadius: shotRadius,
                        boxShadow: shotShadow,
                        transform:
                          [
                            layoutMeta.transform === "none"
                              ? null
                              : layoutMeta.transform,
                            shotScale !== 100
                              ? `scale(${shotScale / 100})`
                              : null,
                          ]
                            .filter(Boolean)
                            .join(" ") || undefined,
                        transition: shotTransition,
                        transformStyle: "preserve-3d",
                      }}
                    >
                      {showFrame ? (
                        <div className="relative z-[1] flex h-7 shrink-0 items-center gap-1.5 bg-card px-2.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-foreground/25" />
                          <span className="h-1.5 w-1.5 rounded-full bg-foreground/25" />
                          <span className="h-1.5 w-1.5 rounded-full bg-foreground/25" />
                          <span className="ml-2 h-2.5 flex-1 rounded-sm bg-foreground/6" />
                        </div>
                      ) : null}
                      <div
                        className={cn(
                          "relative min-h-0 w-full flex-1 overflow-hidden",
                          showFrame && "bg-card"
                        )}
                      >
                        <Image
                          key={demo.src}
                          src={demo.src}
                          alt="Sample screenshot in the editor preview"
                          fill
                          className={demoImageClass}
                          sizes="(max-width: 768px) 90vw, 640px"
                          priority={aspect === "16:9"}
                          style={
                            demoFrameScale
                              ? {
                                  transform: `scale(${demoFrameScale})`,
                                  transformOrigin: demoFrameOrigin,
                                }
                              : undefined
                          }
                        />
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>

              <aside className="flex flex-col gap-3.5 overflow-y-auto border-l border-border p-3">
                <div>
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Layout
                  </p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {LAYOUTS.map((item) => {
                      const selected = item.id === layout;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setLayout(item.id)}
                          aria-pressed={selected}
                          className="flex cursor-pointer flex-col gap-1.5"
                        >
                          <span
                            className={cn(
                              "rounded-md p-0.5 transition-colors duration-150",
                              selected ? "bg-foreground/10" : "hover:bg-foreground/5",
                            )}
                          >
                            <span
                              className="relative flex aspect-4/3 items-center justify-center overflow-hidden rounded-[5px]"
                              style={getBackgroundCSS(background.config)}
                            >
                              <span
                                className="h-[48%] w-[62%] rounded-sm bg-background/55 ring-1 ring-ring/20"
                                style={{
                                  transform:
                                    item.transform === "none"
                                      ? undefined
                                      : item.transform,
                                  transition: prefersReducedMotion
                                    ? undefined
                                    : "transform 200ms ease-out",
                                }}
                              />
                            </span>
                          </span>
                          <span className="text-center text-[10px] font-medium text-muted-foreground">
                            {item.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <SliderRow
                  label="Shadow"
                  value={`${shadow}%`}
                  min={0}
                  max={80}
                  valueNum={shadow}
                  onChange={setShadow}
                />
                <SliderRow
                  label="Scale"
                  value={`${shotScale}%`}
                  min={70}
                  max={110}
                  valueNum={shotScale}
                  onChange={setShotScale}
                />

                <div>
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Export
                  </p>
                  <div className="grid grid-cols-3 gap-1">
                    {(["PNG", "JPG", "WebP"] as const).map((fmt) => (
                      <span
                        key={fmt}
                        className="flex h-7 items-center justify-center rounded-md border border-border bg-foreground/[0.04] text-[10px] font-medium text-muted-foreground"
                      >
                        {fmt}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Quick look
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {(
                      [
                        {
                          id: "clean",
                          label: "Clean flat",
                          apply: () => {
                            setLayout("flat");
                            setShowFrame(false);
                            setShadow(28);
                            setPadding(48);
                            setRadius(20);
                            setBorder(0);
                            setNoise(0);
                            setShotScale(100);
                            setBgKind("solid");
                            setBgId("solid-paper");
                          },
                        },
                        {
                          id: "browser",
                          label: "Browser shot",
                          apply: () => {
                            setLayout("flat");
                            setShowFrame(true);
                            setShadow(44);
                            setPadding(36);
                            setBorder(0);
                            setNoise(0);
                            setShotScale(100);
                            setBgKind("mesh");
                            setBgId("mesh-ocean");
                          },
                        },
                        {
                          id: "glow",
                          label: "Dark glow",
                          apply: () => {
                            setLayout("flat");
                            setShowFrame(false);
                            setShadow(60);
                            setPadding(44);
                            setRadius(18);
                            setBorder(1);
                            setNoise(12);
                            setShotScale(100);
                            setBgKind("glow");
                            setBgId("glow-cyan");
                          },
                        },
                      ] as const
                    ).map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={preset.apply}
                        className="h-8 cursor-pointer rounded-md border border-border px-2.5 text-left text-[11px] font-medium text-muted-foreground transition-colors duration-150 hover:border-foreground/20 hover:text-foreground"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function SliderRow({
  label,
  value,
  min,
  max,
  valueNum,
  onChange,
  disabled,
}: {
  label: string;
  value: string;
  min: number;
  max: number;
  valueNum: number;
  onChange: (v: number) => void;
  disabled?: boolean;
}): React.JSX.Element {
  return (
    <div className={cn(disabled && "opacity-40")}>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <span className="text-[10px] tabular-nums text-muted-foreground">
          {value}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={valueNum}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1 w-full cursor-pointer appearance-none rounded-full bg-foreground/10 accent-foreground disabled:cursor-not-allowed"
        aria-label={label}
      />
    </div>
  );
}

function FrameChip({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
  label: string;
}): React.JSX.Element {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex h-8 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-md border text-[11px] font-medium transition-colors duration-150",
        active
          ? "border-foreground/25 bg-foreground/8 text-foreground"
          : "border-border text-muted-foreground hover:border-foreground/20 hover:text-foreground",
      )}
    >
      {icon}
      {label}
    </button>
  );
}
