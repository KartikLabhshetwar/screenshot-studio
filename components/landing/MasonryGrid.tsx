"use client";

import { motion } from "motion/react";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { demoImagePaths } from "@/lib/r2-demo-images";

interface MasonryItem {
  id: number;
  image: string;
  aspectRatio: string;
}

const getAspectRatio = (index: number): string => {
  const demoNumber = index + 1;

  if (demoNumber === 1) return "aspect-[2/3]";
  if (demoNumber === 3 || demoNumber === 8) return "aspect-[4/3]";

  const landingPageNumbers = [2, 4, 5, 6, 9, 10, 11, 13, 14];
  if (landingPageNumbers.includes(demoNumber)) return "aspect-[16/9]";

  const defaultRatios = ["aspect-[4/3]", "aspect-square", "aspect-[3/4]"];
  return defaultRatios[(demoNumber - 1) % defaultRatios.length];
};

const sampleItems: MasonryItem[] = demoImagePaths.map((imagePath, index) => ({
  id: index + 1,
  image: imagePath,
  aspectRatio: getAspectRatio(index),
}));

export function MasonryGrid() {
  return (
    <section className="py-16 sm:py-20 md:py-24 px-6 bg-background">
      <div className="container mx-auto max-w-6xl">
        <div
          className="columns-1 sm:columns-2 lg:columns-3 gap-4 md:gap-6"
          style={{ columnFill: "balance" as const }}
        >
          {sampleItems.map((item, index) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: (index % 6) * 0.05, duration: 0.4 }}
              className="relative rounded-lg overflow-hidden mb-4 md:mb-6 break-inside-avoid group"
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
