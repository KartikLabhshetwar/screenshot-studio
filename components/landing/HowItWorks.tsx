"use client";

import { motion } from "motion/react";
import { Instrument_Serif } from "next/font/google";

const instrumentSerif = Instrument_Serif({
  weight: ["400"],
  subsets: ["latin"],
});

interface Step {
  step: number;
  title: string;
  description: string;
}

interface HowItWorksProps {
  steps: Step[];
  title?: string;
}

export function HowItWorks({
  steps,
  title = "How It Works",
}: HowItWorksProps) {
  return (
    <section className="py-20 sm:py-28 md:py-32 px-6 bg-background">
      <div className="container mx-auto max-w-4xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-16 sm:mb-20 ${instrumentSerif.className}`}
        >
          {title}
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-12 md:gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
              className="text-center md:text-left"
            >
              {/* Step number */}
              <span className="inline-block text-6xl sm:text-7xl font-bold text-primary/20 mb-4 leading-none">
                {step.step}
              </span>

              {/* Title */}
              <h3 className="text-xl sm:text-2xl font-semibold mb-2 text-foreground">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-muted-foreground">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
