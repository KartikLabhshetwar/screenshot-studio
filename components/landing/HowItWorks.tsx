import {
  ImageUploadIcon,
  PaintBrush01Icon,
  Download04Icon,
} from "hugeicons-react";

interface Step {
  step: number;
  title: string;
  description: string;
}

interface HowItWorksProps {
  steps: Step[];
  title?: string;
}

const STEP_ICONS: (typeof ImageUploadIcon)[] = [
  ImageUploadIcon,
  PaintBrush01Icon,
  Download04Icon,
];

const ICON_HOVER = [
  "group-hover:-translate-y-1 group-hover:scale-110",
  "group-hover:rotate-12 group-hover:scale-110",
  "group-hover:translate-y-1 group-hover:scale-110",
] as const;

export function HowItWorks({ steps }: HowItWorksProps) {
  return (
    <section
      aria-label="How it works"
      className="bg-background px-6 pt-4 pb-12 sm:pb-16 md:pt-12 md:pb-20"
    >
      <div className="mx-auto w-full max-w-6xl">
        <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = STEP_ICONS[index] ?? ImageUploadIcon;
            const iconHover = ICON_HOVER[index] ?? ICON_HOVER[0];
            return (
              <div
                key={step.step}
                className="group flex h-full flex-col rounded-2xl bg-card px-5 py-4"
              >
                <Icon
                  className={`size-5 shrink-0 text-foreground transition-transform duration-200 ease-out will-change-transform ${iconHover}`}
                  aria-hidden
                />
                <h3 className="mt-3 text-sm leading-5 font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-1.5 text-sm leading-5 text-pretty text-muted-foreground">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
