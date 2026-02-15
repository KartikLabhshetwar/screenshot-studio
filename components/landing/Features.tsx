"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Instrument_Serif } from "next/font/google";
import {
  Image01Icon,
  Layers01Icon,
  Download01Icon,
} from "hugeicons-react";
import { Player, PlayerRef } from "@remotion/player";
import { EditorDemo, BackgroundsDemo, ExportDemo } from "@/remotion";

const instrumentSerif = Instrument_Serif({
  weight: ["400"],
  subsets: ["latin"],
});

interface Feature {
  title: string;
  description: string;
  icon?: string;
}

interface FeaturesProps {
  features: Feature[];
  title?: string;
  eyebrow?: string;
}

const iconMap: Record<string, React.ElementType> = {
  upload: Image01Icon,
  layers: Layers01Icon,
  export: Download01Icon,
};

// Remotion composition map with their configurations
const remotionPreviewMap: Record<string, { component: React.FC; durationInFrames: number }> = {
  upload: { component: EditorDemo, durationInFrames: 300 }, // 5 seconds at 60fps
  layers: { component: BackgroundsDemo, durationInFrames: 240 }, // 4 seconds at 60fps
  export: { component: ExportDemo, durationInFrames: 240 }, // 4 seconds at 60fps
};

export function Features({ features, title, eyebrow = "FEATURES" }: FeaturesProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const playerRef = useRef<PlayerRef>(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Get current animation duration in milliseconds
  const getCurrentDuration = useCallback(() => {
    const feature = features[activeIndex];
    const remotionPreview = feature?.icon ? remotionPreviewMap[feature.icon] : null;
    if (remotionPreview) {
      // Duration = frames / fps * 1000ms
      return (remotionPreview.durationInFrames / 60) * 1000;
    }
    return 5000; // Default 5 seconds
  }, [activeIndex, features]);

  // Auto-switch to next feature when animation completes
  useEffect(() => {
    if (!isAutoPlaying) return;

    const duration = getCurrentDuration();
    const timer = setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % features.length);
    }, duration);

    return () => clearTimeout(timer);
  }, [activeIndex, features.length, isAutoPlaying, getCurrentDuration]);

  // Pause auto-play when user manually selects a feature
  const handleFeatureClick = (index: number) => {
    setActiveIndex(index);
    setIsAutoPlaying(false);
    // Resume auto-play after 10 seconds of inactivity
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <section className="py-24 sm:py-32 px-6 bg-background">
      <div className="max-w-screen-xl mx-auto">
        {/* Header */}
        <div className="mb-16 sm:mb-20">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-muted-foreground uppercase tracking-[0.2em] text-xs sm:text-sm mb-6"
          >
            {eyebrow}
          </motion.p>

          {title && (
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className={`text-3xl sm:text-4xl md:text-5xl font-normal max-w-3xl ${instrumentSerif.className}`}
            >
              {title}
            </motion.h2>
          )}
        </div>

        {/* Features Grid */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Feature Navigation - Left Side */}
          <div className="lg:col-span-4 space-y-2">
            {features.map((feature, index) => {
              const IconComponent = feature.icon
                ? iconMap[feature.icon] || Image01Icon
                : Image01Icon;
              const isActive = activeIndex === index;

              return (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleFeatureClick(index)}
                  className={`w-full text-left p-4 sm:p-5 rounded-2xl transition-all duration-300 group ${
                    isActive
                      ? "bg-surface-3 border border-brand/30"
                      : "hover:bg-surface-2 border border-transparent"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                        isActive
                          ? "bg-brand/20 text-brand"
                          : "bg-surface-3 text-muted-foreground group-hover:text-foreground"
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <h3
                        className={`text-base sm:text-lg font-semibold mb-1 transition-colors ${
                          isActive ? "text-foreground" : "text-foreground/80"
                        }`}
                      >
                        {feature.title}
                      </h3>
                      <p
                        className={`text-sm leading-relaxed transition-colors ${
                          isActive
                            ? "text-muted-foreground"
                            : "text-muted-foreground/70"
                        }`}
                      >
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Feature Preview - Right Side */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="aspect-[4/3] rounded-3xl overflow-hidden"
              >
                {(() => {
                  const feature = features[activeIndex];
                  const remotionPreview = feature?.icon
                    ? remotionPreviewMap[feature.icon]
                    : null;

                  if (remotionPreview) {
                    return (
                      <Player
                        ref={playerRef}
                        component={remotionPreview.component}
                        durationInFrames={remotionPreview.durationInFrames}
                        fps={60}
                        compositionWidth={800}
                        compositionHeight={600}
                        autoPlay
                        loop
                        controls={false}
                        acknowledgeRemotionLicense
                        style={{ width: '100%', height: '100%' }}
                      />
                    );
                  }

                  // Fallback
                  const IconComponent = feature?.icon
                    ? iconMap[feature.icon] || Image01Icon
                    : Image01Icon;
                  return (
                    <div className="w-full h-full bg-surface-2 flex items-center justify-center p-8">
                      <div className="text-center">
                        <div className="w-20 h-20 rounded-2xl bg-brand/10 flex items-center justify-center mx-auto mb-6">
                          <IconComponent className="w-10 h-10 text-brand" />
                        </div>
                        <h4 className={`text-2xl sm:text-3xl font-normal mb-3 ${instrumentSerif.className}`}>
                          {feature?.title}
                        </h4>
                        <p className="text-muted-foreground max-w-md mx-auto">
                          {feature?.description}
                        </p>
                      </div>
                    </div>
                  );
                })()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
