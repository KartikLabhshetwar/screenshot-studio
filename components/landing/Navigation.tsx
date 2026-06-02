"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight01Icon } from "hugeicons-react";
import { GitHubStarButton } from "@/components/ui/github-star-button";

interface NavigationProps {
  ctaLabel?: string;
  ctaHref?: string;
}

export function Navigation({
  ctaLabel = "Open Editor",
  ctaHref = "/",
}: NavigationProps) {
  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/landing" className="flex items-center gap-2">
          <Image
            src="/favicon.svg"
            alt="Screenshot Studio"
            width={32}
            height={32}
            className="h-8 w-8"
            priority
          />
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <GitHubStarButton />

          <Link href={ctaHref}>
            <Button
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-4 py-2 h-auto text-sm font-medium flex items-center gap-1.5"
            >
              {ctaLabel}
              <ArrowRight01Icon className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
