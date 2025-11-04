"use client";

import { OptimizedImage } from "@/components/ui/optimized-image";
import { demoImageMapping } from "@/lib/cloudinary-demo-images";

interface MasonryItem {
  id: number;
  image: string;
}

// Use demo image Cloudinary public IDs from mapping
const sampleItems: MasonryItem[] = Object.values(demoImageMapping).map((publicId, index) => ({
  id: index + 1,
  image: publicId,
}));

export function MasonryGrid() {
  return (
    <section className="w-full py-24 px-8 bg-muted/30">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleItems.map((item) => (
            <div
              key={item.id}
              className="relative bg-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-border group aspect-video"
            >
              <OptimizedImage
                src={item.image}
                alt={`Gallery image ${item.id}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                quality="auto"
                crop="fill"
                gravity="auto"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
