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
    <section className="py-24 sm:py-32 md:py-40 px-6 bg-background relative overflow-hidden">
      {/* Subtle gradient */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 container mx-auto max-w-2xl text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-6 ${instrumentSerif.className}`}
        >
          {title}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-lg text-muted-foreground mb-10"
        >
          {description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <Link href={ctaHref}>
            <Button
              variant="integration"
              size="lg"
              className="text-base sm:text-lg px-8 py-6 min-h-[56px] font-medium"
            >
              {ctaLabel}
            </Button>
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-xs text-muted-foreground/60"
        >
          Free forever · No signup required
        </motion.p>
      </div>
    </section>
  );
}
