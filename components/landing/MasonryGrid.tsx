"use client";

import { motion } from "motion/react";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { demoImagePaths } from "@/lib/r2-demo-images";

interface MasonryItem {
  id: number;
  image: string;
  aspectRatio: string;
}

// Aspect ratios based on actual image dimensions
const getAspectRatio = (index: number): string => {
  const demoNumber = index + 1;

  // Square images (3240x3240)
  if (demoNumber === 7 || demoNumber === 10) return "aspect-square";

  // All others are 16:9 landscape (3600x2025)
  return "aspect-video";
};

const sampleItems: MasonryItem[] = demoImagePaths.map((imagePath, index) => ({
  id: index + 1,
  image: imagePath,
  aspectRatio: getAspectRatio(index),
}));

export function MasonryGrid() {
  return (
    <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 bg-background">
      <div className="container mx-auto max-w-[1400px]">
        <div
          className="columns-1 md:columns-2 gap-6 md:gap-10"
          style={{ columnFill: "balance" as const }}
        >
          {sampleItems.map((item, index) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: (index % 6) * 0.05, duration: 0.4 }}
              className="relative rounded-2xl overflow-hidden mb-6 md:mb-10 break-inside-avoid group"
            >
              <div className={`relative w-full ${item.aspectRatio} overflow-hidden bg-muted/30`}>
                <OptimizedImage
                  src={item.image}
                  alt={`Example design ${item.id}`}
                  fill
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  quality="auto"
                  crop="fill"
                  gravity="auto"
                />
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
