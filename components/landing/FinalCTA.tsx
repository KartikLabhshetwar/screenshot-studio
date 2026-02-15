"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Instrument_Serif } from "next/font/google";

const instrumentSerif = Instrument_Serif({
  weight: ["400"],
  subsets: ["latin"],
});

interface FinalCTAProps {
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
}

export function FinalCTA({
  title,
  description,
  ctaLabel,
  ctaHref,
}: FinalCTAProps) {
  return (
    <section className="py-16 sm:py-20 px-6 bg-background">
      <div className="max-w-screen-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-brand rounded-3xl px-8 sm:px-12 md:px-16 py-12 sm:py-16"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            {/* Text Content */}
            <div className="max-w-xl">
              <h2
                className={`text-2xl sm:text-3xl md:text-4xl font-normal text-brand-foreground mb-3 ${instrumentSerif.className}`}
              >
                {title}
              </h2>
              <p className="text-brand-foreground/80 text-lg">
                {description}
              </p>
            </div>

            {/* CTA Button */}
            <div className="flex-shrink-0">
              <Link href={ctaHref}>
                <Button
                  size="lg"
                  className="text-base sm:text-lg px-8 py-6 min-h-[56px] font-medium bg-brand-foreground text-brand hover:bg-brand-foreground/90 rounded-full"
                >
                  {ctaLabel}
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Subtle trust line */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-6 text-center text-sm text-muted-foreground/60"
        >
          Free forever · No signup required
        </motion.p>
      </div>
    </section>
  );
}
