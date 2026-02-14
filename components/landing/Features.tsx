"use client";

import { motion } from "motion/react";
import { Instrument_Serif } from "next/font/google";
import {
  Image01Icon,
  Layers01Icon,
  Download01Icon,
} from "hugeicons-react";

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
}

const iconMap: Record<string, React.ElementType> = {
  upload: Image01Icon,
  layers: Layers01Icon,
  export: Download01Icon,
};

export function Features({ features, title }: FeaturesProps) {
  return (
    <section className="py-20 sm:py-28 md:py-32 px-6 border-t border-border/40 bg-background">
      <div className="container mx-auto max-w-5xl">
        {title && (
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-16 sm:mb-20 ${instrumentSerif.className}`}
          >
            {title}
          </motion.h2>
        )}

        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {features.map((feature, index) => {
            const IconComponent = feature.icon
              ? iconMap[feature.icon] || Image01Icon
              : Image01Icon;

            return (
              <motion.article
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="group"
              >
                {/* Icon */}
                <div className="mb-5">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors duration-300">
                    <IconComponent className="w-6 h-6 text-primary" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
