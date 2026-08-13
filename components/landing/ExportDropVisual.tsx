"use client";

import React from "react";
import { motion } from "motion/react";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";

const mainVariant = {
  initial: {
    x: 0,
    y: 0,
  },
  animate: {
    x: 8,
    y: -6,
    opacity: 0.9,
  },
};

const secondaryVariant = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
};

export function ExportDropVisual({
  title,
}: {
  title: string;
}): React.JSX.Element {
  return (
    <div className="w-full">
      <motion.div
        whileHover="animate"
        className="group/file relative block w-full overflow-hidden rounded-lg p-4"
      >
        <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]">
          <GridPattern />
        </div>
        <div className="flex flex-col items-center justify-center">
          <div className="relative mx-auto mt-0 w-full max-w-[6rem]">
            <motion.div
              variants={mainVariant}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
              }}
              className="relative z-40 mx-auto mt-0 flex h-14 w-full max-w-[4.75rem] items-center justify-center rounded-md bg-accent shadow-xl ring-1 ring-foreground/10 group-hover/file:shadow-2xl"
            >
              <Upload className="h-3.5 w-3.5 text-foreground" />
            </motion.div>

            <motion.div
              variants={secondaryVariant}
              className="absolute inset-0 z-30 mx-auto mt-0 flex h-14 max-w-[4.75rem] items-center justify-center rounded-md border border-dashed border-foreground/25 bg-transparent opacity-0"
            />
          </div>
          <p className="relative z-20 mt-1.5 font-sans text-[9px] font-medium tracking-wide text-muted-foreground">
            {title}
          </p>
        </div>
      </motion.div>
    </div>
  );
}

function GridPattern(): React.JSX.Element {
  const columns = 17;
  const rows = 7;

  return (
    <div className="flex shrink-0 scale-105 flex-wrap items-center justify-center gap-x-px gap-y-px bg-card">
      {Array.from({ length: rows }).map((_, row) =>
        Array.from({ length: columns }).map((_, col) => {
          const index = row * columns + col;
          return (
            <div
              key={`${col}-${row}`}
              className={cn(
                "flex h-3 w-3 shrink-0 rounded-[2px]",
                index % 2 === 0
                  ? "bg-accent"
                  : "bg-accent shadow-[var(--card-highlight-shadow)]",
              )}
            />
          );
        }),
      )}
    </div>
  );
}
