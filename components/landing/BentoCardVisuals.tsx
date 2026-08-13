"use client";

import { AnimatedList } from "@/components/ui/AnimatedList";
import { ExportDropVisual } from "./ExportDropVisual";
import { cn } from "@/lib/utils";
import "./BentoCardVisuals.css";

const BACKGROUND_PRESETS = [
  { name: "Mesh", tone: "a" as const },
  { name: "Noise", tone: "b" as const },
  { name: "Solid", tone: "c" as const },
  { name: "Blur", tone: "d" as const },
  { name: "Grain", tone: "e" as const },
];

const FRAME_PRESETS = [
  { name: "macOS", chrome: "traffic" as const },
  { name: "Windows", chrome: "win" as const },
  { name: "Arc", chrome: "arc" as const },
  { name: "Polaroid", chrome: "polaroid" as const },
];

type ListEvent = {
  title: string;
  meta: string;
  icon: "play" | "tweet" | "code" | "check";
};

const MOTION_EVENTS: ListEvent[] = [
  { title: "Fade In", meta: "0.4s · ease-out", icon: "play" },
  { title: "Slide Up", meta: "0.5s · spring", icon: "play" },
  { title: "Zoom Soft", meta: "0.6s · ease", icon: "play" },
  { title: "Export MP4", meta: "Ready", icon: "check" },
];

const CAPTURE_EVENTS: ListEvent[] = [
  { title: "Tweet imported", meta: "x.com/…", icon: "tweet" },
  { title: "Code themed", meta: "Dracula", icon: "code" },
  { title: "Snippet ready", meta: "tsx", icon: "check" },
];

function loopEvents(events: ListEvent[], times = 10): ListEvent[] {
  return Array.from({ length: times }, () => events).flat();
}

function EventCard({ title, meta, icon }: ListEvent): React.JSX.Element {
  return (
    <figure
      className={cn(
        "bento-visual__list-item",
        "relative mx-auto w-full overflow-hidden",
      )}
    >
      <div
        className={`bento-visual__list-icon bento-visual__list-icon--${icon}`}
      />
      <div className="bento-visual__list-copy">
        <strong>{title}</strong>
        <span>{meta}</span>
      </div>
    </figure>
  );
}

function EventListVisual({
  events,
  className,
  delay = 1800,
}: {
  events: ListEvent[];
  className: string;
  delay?: number;
}): React.JSX.Element {
  const items = loopEvents(events);

  return (
    <div className={cn("bento-visual", className)} aria-hidden="true">
      <div className="bento-visual__animated-list">
        <AnimatedList
          delay={delay}
          className="bento-visual__animated-list-inner"
        >
          {items.map((event, idx) => (
            <EventCard key={idx} {...event} />
          ))}
        </AnimatedList>
        <div className="bento-visual__animated-list-fade" />
      </div>
    </div>
  );
}

export function BackgroundsVisual(): React.JSX.Element {
  const loop = [...BACKGROUND_PRESETS, ...BACKGROUND_PRESETS];

  return (
    <div className="bento-visual bento-visual--backgrounds" aria-hidden="true">
      <div className="bento-visual__marquee bento-visual__marquee--fade">
        <div className="bento-visual__marquee-track">
          {loop.map((preset, idx) => (
            <figure
              key={`${preset.name}-${idx}`}
              className={`bento-visual__preset bento-visual__preset--${preset.tone}`}
            >
              <div className="bento-visual__preset-swatch" />
              <figcaption>{preset.name}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </div>
  );
}

export function FramesVisual(): React.JSX.Element {
  const loop = [...FRAME_PRESETS, ...FRAME_PRESETS];

  return (
    <div className="bento-visual bento-visual--frames" aria-hidden="true">
      <div className="bento-visual__marquee bento-visual__marquee--fade">
        <div className="bento-visual__marquee-track bento-visual__marquee-track--slow">
          {loop.map((frame, idx) => (
            <div
              key={`${frame.name}-${idx}`}
              className={`bento-visual__frame-card bento-visual__frame-card--${frame.chrome}`}
            >
              <div className="bento-visual__frame-chrome">
                {frame.chrome === "traffic" ? (
                  <>
                    <span />
                    <span />
                    <span />
                  </>
                ) : frame.chrome === "win" ? (
                  <div className="bento-visual__frame-win" />
                ) : frame.chrome === "arc" ? (
                  <div className="bento-visual__frame-arc" />
                ) : (
                  <div className="bento-visual__frame-polaroid-label" />
                )}
              </div>
              <div className="bento-visual__frame-page">
                <i />
                <i />
              </div>
              <span className="bento-visual__frame-name">{frame.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function TransformsVisual(): React.JSX.Element {
  return (
    <div className="bento-visual bento-visual--transforms" aria-hidden="true">
      <div className="bento-visual__stage bento-visual__stage--3d">
        <div className="bento-visual__plane bento-visual__plane--back" />
        <div className="bento-visual__plane bento-visual__plane--mid" />
        <div className="bento-visual__plane bento-visual__plane--front">
          <div className="bento-visual__plane-bar" />
          <div className="bento-visual__plane-block" />
        </div>
      </div>
    </div>
  );
}

export function MotionVisual(): React.JSX.Element {
  return (
    <EventListVisual
      events={MOTION_EVENTS}
      className="bento-visual--motion"
      delay={1800}
    />
  );
}

export function CaptureVisual(): React.JSX.Element {
  return (
    <EventListVisual
      events={CAPTURE_EVENTS}
      className="bento-visual--capture"
      delay={2000}
    />
  );
}

export function ExportVisual(): React.JSX.Element {
  return (
    <div
      className="bento-visual bento-visual--export"
      aria-hidden="true"
    >
      <ExportDropVisual title="Drop to export" />
    </div>
  );
}
