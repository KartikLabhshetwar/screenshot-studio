"use client";

import { motion } from "motion/react";
import { Instrument_Serif } from "next/font/google";
import { Player } from "@remotion/player";
import { LightningFastDemo, Transform3DDemo, AnimateDemo } from "@/remotion";

const instrumentSerif = Instrument_Serif({
  weight: ["400"],
  subsets: ["latin"],
});

// Remotion-based visual for "Lightning Fast"
function LightningFastVisual() {
  return (
    <div className="h-32 mb-6 overflow-hidden rounded-xl">
      <Player
        component={LightningFastDemo}
        durationInFrames={180}
        fps={60}
        compositionWidth={400}
        compositionHeight={160}
        autoPlay
        loop
        controls={false}
        acknowledgeRemotionLicense
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}

// Remotion-based visual for "3D Transforms"
function Transform3DVisual() {
  return (
    <div className="h-32 mb-6 overflow-hidden rounded-xl">
      <Player
        component={Transform3DDemo}
        durationInFrames={180}
        fps={60}
        compositionWidth={400}
        compositionHeight={160}
        autoPlay
        loop
        controls={false}
        acknowledgeRemotionLicense
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}

// Remotion-based visual for "Animate Everything"
function AnimateVisual() {
  return (
    <div className="h-32 mb-6 overflow-hidden rounded-xl">
      <Player
        component={AnimateDemo}
        durationInFrames={180}
        fps={60}
        compositionWidth={400}
        compositionHeight={160}
        autoPlay
        loop
        controls={false}
        acknowledgeRemotionLicense
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}

interface ValuePropositionProps {
  eyebrow?: string;
  headline?: string;
}

export function ValueProposition({
  eyebrow = "OUR WHY",
  headline = "We believe beautiful images shouldn't require expensive tools or design degrees. Stage puts professional-quality creation in everyone's hands.",
}: ValuePropositionProps) {
  const cards = [
    {
      title: "Lightning Fast",
      description:
        "Create stunning images in seconds, not hours. Our intuitive editor eliminates the learning curve.",
      Visual: LightningFastVisual,
    },
    {
      title: "3D Transforms",
      description:
        "Add depth and dimension with 30+ perspective presets. Magazine spreads, hero shots, and dramatic angles.",
      Visual: Transform3DVisual,
    },
    {
      title: "Animate Everything",
      description:
        "Create cinematic slideshows with 20+ animation presets. Zoom, pan, Ken Burns, and more.",
      Visual: AnimateVisual,
    },
  ];

  return (
    <section className="py-24 sm:py-32 px-6 bg-background">
      <div className="max-w-screen-xl mx-auto">
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-muted-foreground uppercase tracking-[0.2em] text-xs sm:text-sm mb-6"
        >
          {eyebrow}
        </motion.p>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal max-w-4xl mb-16 sm:mb-20 leading-[1.2] ${instrumentSerif.className}`}
        >
          {headline}
        </motion.h2>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {cards.map((card, index) => {
            const Visual = card.Visual;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 + 0.2 }}
                className="group bg-surface-2 rounded-2xl p-6 hover:bg-surface-3 transition-all duration-300 border border-transparent hover:border-border/50"
              >
                {/* Visual Preview */}
                <Visual />

                <h3 className="text-xl font-semibold mb-3 text-foreground group-hover:text-brand transition-colors">
                  {card.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {card.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
