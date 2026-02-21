"use client";

import Link from "next/link";
import { GithubIcon, NewTwitterIcon } from "hugeicons-react";

interface FooterProps {
  brandName?: string;
}

export function Footer({ brandName = "Screenshot Studio" }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 px-6 bg-background">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} {brandName}
          </p>

          <div className="flex items-center gap-6">
            <Link
              href="/changelog"
              className="cursor-pointer text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              Changelog
            </Link>
            <Link
              href="https://github.com/KartikLabhshetwar/stage"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
              aria-label="GitHub"
            >
              <GithubIcon className="w-5 h-5" />
            </Link>
            <Link
              href="https://x.com/code_kartik"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Twitter"
            >
              <NewTwitterIcon className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
