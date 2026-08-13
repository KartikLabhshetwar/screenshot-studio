"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView, useReducedMotion } from "motion/react";
import { EditorPreview } from "./EditorPreview";
import { trackCTAClick } from "@/lib/analytics";

interface HeroProps {
  title: string;
  subtitle?: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
}

const MASK_EASE = [0.33, 1, 0.68, 1] as const;

const DESC_DELAY = 0.42;
const BUTTON_DELAY = 0.62;

const headingMaskAnimation = {
  initial: { y: "100%" },
  enter: (i: number) => ({
    y: "0%",
    transition: {
      duration: 0.75,
      ease: MASK_EASE,
      delay: 0.075 * i,
    },
  }),
};

const descriptionMaskAnimation = {
  initial: { y: "100%" },
  enter: {
    y: "0%",
    transition: {
      duration: 0.32,
      ease: MASK_EASE,
      delay: DESC_DELAY,
    },
  },
};

const buttonAnimation = {
  initial: { opacity: 0, y: 8 },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.25,
      ease: MASK_EASE,
      delay: BUTTON_DELAY,
    },
  },
};

export function Hero({
  title,
  subtitle,
  description,
  ctaLabel = "Start Creating",
  ctaHref = "/",
}: HeroProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const isInView = useInView(headingRef, { once: true, margin: "-10%" });
  const prefersReducedMotion = useReducedMotion();
  const lines = subtitle ? [title, subtitle] : [title];
  const showMotion = prefersReducedMotion || isInView;

  return (
    <main className="relative z-10 pt-32 pb-24 sm:pt-36" role="banner">
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="text-left">
          <motion.a
            href="https://vercel.com/oss"
            target="_blank"
            rel="noopener noreferrer"
            className="mb-5 inline-flex items-center gap-1.5 rounded-full bg-muted/40 px-3 py-1 text-xs ring-1 ring-border/60 transition-colors hover:bg-muted/55 hover:ring-border"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
            animate={
              showMotion
                ? {
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: 0.35,
                      ease: MASK_EASE,
                      delay: 0.12,
                    },
                  }
                : { opacity: 0, y: 6 }
            }
          >
            <span className="text-muted-foreground">Backed by</span>
            <Image
              src="/vercel-icon.png"
              alt=""
              width={12}
              height={10}
              className="h-2.5 w-auto shrink-0 mix-blend-lighten"
              aria-hidden="true"
            />
            <span className="font-medium text-foreground">
              Vercel OSS Program
            </span>
          </motion.a>

          <h1
            ref={headingRef}
            className="max-w-4xl text-[32px] leading-[38px] sm:text-[44px] sm:leading-[50px] md:text-[56px] md:leading-[64px] font-semibold tracking-[-0.03em] text-foreground"
            style={{
              fontFamily:
                'Inter, "Inter Fallback", Arial, Helvetica, sans-serif',
            }}
          >
            {lines.map((line, index) => (
              <div key={line} className="overflow-hidden">
                <motion.span
                  className="block md:whitespace-nowrap"
                  custom={index}
                  variants={headingMaskAnimation}
                  initial={prefersReducedMotion ? false : "initial"}
                  animate={showMotion ? "enter" : "initial"}
                >
                  {line}
                </motion.span>
              </div>
            ))}
          </h1>

          <div className="mt-6 max-w-2xl overflow-hidden">
            <motion.p
              className="text-[15px] md:text-base leading-normal text-muted-foreground"
              variants={descriptionMaskAnimation}
              initial={prefersReducedMotion ? false : "initial"}
              animate={showMotion ? "enter" : "initial"}
            >
              {description}
            </motion.p>
          </div>

          <motion.div
            className="mt-8"
            variants={buttonAnimation}
            initial={prefersReducedMotion ? false : "initial"}
            animate={showMotion ? "enter" : "initial"}
          >
            <Link
              href={ctaHref}
              onClick={() => trackCTAClick("hero", ctaLabel)}
              className="relative inline-flex h-auto cursor-pointer items-center justify-center rounded-md border-0 bg-[var(--nav-cta-bg)] px-6 py-2.5 text-base font-medium text-[var(--nav-cta-fg)] shadow-none transition-[transform,box-shadow,background-color,color] duration-150 ease-out [text-shadow:var(--nav-cta-text-shadow)] hover:bg-[var(--nav-cta-bg)] hover:text-[var(--nav-cta-fg)] hover:shadow-[var(--nav-cta-hover-shadow)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 active:scale-[0.97] active:bg-[var(--nav-cta-bg)] active:text-[var(--nav-cta-fg)] active:shadow-none"
            >
              {ctaLabel}
            </Link>
          </motion.div>
        </div>

        <div className="mt-14 md:mt-16">
          <EditorPreview />
        </div>
      </div>
    </main>
  );
}
