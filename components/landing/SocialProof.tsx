"use client";

import { motion } from "motion/react";

interface Stat {
  value: string;
  label: string;
}

interface SocialProofProps {
  stats?: Stat[];
}

export function SocialProof({ stats }: SocialProofProps) {
  if (!stats || stats.length === 0) return null;

  return (
    <section className="py-12 sm:py-16 border-y border-border/40">
      <div className="container mx-auto max-w-4xl px-6">
        <div className="flex items-center justify-center gap-8 sm:gap-16 md:gap-24">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="text-center"
            >
              <p className="text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground tracking-tight">
                {stat.value}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 uppercase tracking-wider">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
