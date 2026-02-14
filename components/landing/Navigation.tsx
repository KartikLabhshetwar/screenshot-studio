"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { GithubIcon } from "hugeicons-react";
import { motion, useSpring, useTransform } from "motion/react";

interface NavigationProps {
  ctaLabel?: string;
  ctaHref?: string;
}

function useGitHubStars() {
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    const fetchStars = async () => {
      try {
        const response = await fetch(
          "https://api.github.com/repos/KartikLabhshetwar/stage"
        );
        if (response.ok) {
          const data = await response.json();
          setStars(data.stargazers_count);
        }
      } catch (error) {
        console.error("Failed to fetch GitHub stars:", error);
      }
    };

    fetchStars();
  }, []);

  return stars;
}

function AnimatedCounter({ value }: { value: number }) {
  const spring = useSpring(0, { damping: 30, stiffness: 100 });

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  const display = useTransform(spring, (current) =>
    Math.round(current).toLocaleString()
  );

  return <motion.span>{display}</motion.span>;
}

export function Navigation({
  ctaLabel = "Open Editor",
  ctaHref = "/home",
}: NavigationProps) {
  const stars = useGitHubStars();

  return (
    <nav className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-xl border-b border-border/40">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/landing" className="flex items-center">
          <Image
            src="/logo.png"
            alt="Stage"
            width={40}
            height={40}
            className="h-9 w-9 sm:h-10 sm:w-10"
            priority
          />
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="https://github.com/KartikLabhshetwar/stage"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="GitHub"
          >
            <GithubIcon className="w-5 h-5" />
            {stars !== null && (
              <span className="text-sm font-medium hidden sm:inline-flex items-center gap-1">
                <AnimatedCounter value={stars} />
              </span>
            )}
          </Link>

          <Link href={ctaHref}>
            <Button variant="integration" size="sm" className="font-medium">
              {ctaLabel}
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
