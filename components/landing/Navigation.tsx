"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion, useSpring, useTransform } from "motion/react";
import { ArrowRight01Icon } from "hugeicons-react";

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

function GitHubStarButton({ stars }: { stars: number | null }) {
  return (
    <Link
      href="https://github.com/KartikLabhshetwar/stage"
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 hover:scale-105"
      aria-label="Star on GitHub"
    >
      {/* Fancy gradient background */}
      <div className="absolute inset-0 rounded-full overflow-hidden">
        <span className="absolute inset-0 rounded-full bg-[#1a1a1a]" />

        {/* Gradient pills with mix-blend-difference */}
        <div className="absolute w-[120px] h-[32px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mix-blend-difference opacity-60 group-hover:opacity-100 transition-opacity">
          <svg className="w-full h-full" viewBox="0 0 1030 280" fill="none">
            <rect width="1030" height="280" rx="140" fill="url(#grad1)" />
            <defs>
              <radialGradient id="grad1" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(147.7244 406.3498) rotate(-61.30261) scale(596.96448 865.40806)">
                <stop offset="0" stopColor="#FFFFFF" />
                <stop offset="0.188423" stopColor="#1E10C5" />
                <stop offset="0.260417" stopColor="#9089E2" />
                <stop offset="0.328792" stopColor="#FCFCFE" />
                <stop offset="0.442708" stopColor="#B2B8E7" />
                <stop offset="0.537556" stopColor="#0E2DCB" />
                <stop offset="0.631738" stopColor="#FFFFFF" />
                <stop offset="0.725645" stopColor="#0017E9" />
                <stop offset="0.817779" stopColor="#4743EF" />
                <stop offset="0.84375" stopColor="#7D7BF4" />
                <stop offset="0.90569" stopColor="#FFFFFF" />
                <stop offset="1" stopColor="#0B06FC" />
              </radialGradient>
            </defs>
          </svg>
        </div>

        <div className="absolute w-[120px] h-[32px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[165deg] mix-blend-difference opacity-60 group-hover:opacity-100 transition-opacity">
          <svg className="w-full h-full" viewBox="0 0 1030 280" fill="none">
            <rect width="1030" height="280" rx="140" fill="url(#grad2)" />
            <defs>
              <radialGradient id="grad2" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(147.7244 406.3498) rotate(-61.30261) scale(596.96448 865.40806)">
                <stop offset="0" stopColor="#FFFFFF" />
                <stop offset="0.188423" stopColor="#1E10C5" />
                <stop offset="0.537556" stopColor="#0E2DCB" />
                <stop offset="0.631738" stopColor="#FFFFFF" />
                <stop offset="0.725645" stopColor="#0017E9" />
                <stop offset="1" stopColor="#0B06FC" />
              </radialGradient>
            </defs>
          </svg>
        </div>

        <div className="absolute w-[150px] h-[40px] top-1/2 left-1/2 -translate-x-[57%] -translate-y-1/2 rotate-[-30deg] mix-blend-difference opacity-40 group-hover:opacity-80 transition-opacity">
          <svg className="w-full h-full" viewBox="0 0 1030 280" fill="none">
            <rect width="1030" height="280" rx="140" fill="url(#grad3)" />
            <defs>
              <radialGradient id="grad3" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(147.7244 406.3498) rotate(-61.30261) scale(596.96448 865.40806)">
                <stop offset="0" stopColor="#FFFFFF" />
                <stop offset="0.260417" stopColor="#9089E2" />
                <stop offset="0.442708" stopColor="#B2B8E7" />
                <stop offset="0.725645" stopColor="#0017E9" />
                <stop offset="0.84375" stopColor="#7D7BF4" />
                <stop offset="1" stopColor="#0B06FC" />
              </radialGradient>
            </defs>
          </svg>
        </div>

        {/* Glow effect */}
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[40%] rounded-full blur-[8px] bg-[#3333ff]/30 group-hover:bg-[#5555ff]/50 transition-colors" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center gap-2">
        {/* GitHub Icon */}
        <svg className="w-4 h-4 text-white/90" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
        </svg>

        {stars !== null && (
          <span className="text-sm font-medium text-white/90 tabular-nums">
            <AnimatedCounter value={stars} />
          </span>
        )}
      </div>
    </Link>
  );
}

export function Navigation({
  ctaLabel = "Open Editor",
  ctaHref = "/home",
}: NavigationProps) {
  const stars = useGitHubStars();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 py-4">
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`flex items-center justify-between w-full max-w-3xl gap-4 sm:gap-8 px-6 sm:px-8 py-3 rounded-full transition-all duration-300 ${
          scrolled
            ? "bg-background/90 backdrop-blur-xl shadow-lg shadow-black/10 border border-border/50"
            : "bg-background/60 backdrop-blur-md border border-border/30"
        }`}
      >
        {/* Logo */}
        <Link href="/landing" className="flex items-center">
          <Image
            src="/logo.svg"
            alt="Screenshot Studio"
            width={36}
            height={36}
            className="h-8 w-8 sm:h-9 sm:w-9"
            priority
          />
        </Link>

        {/* Right side actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* GitHub Star Button */}
          <GitHubStarButton stars={stars} />

          {/* CTA Button */}
          <Link href={ctaHref}>
            <Button
              size="sm"
              className="font-medium bg-foreground text-background hover:bg-foreground/90 rounded-full px-4 sm:px-5 py-2 h-auto text-sm flex items-center gap-1.5 group"
            >
              <span className="hidden sm:inline">{ctaLabel}</span>
              <span className="sm:hidden">Editor</span>
              <ArrowRight01Icon className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </Link>
        </div>
      </motion.div>
    </nav>
  );
}
