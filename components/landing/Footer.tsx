import Link from "next/link";
import Image from "next/image";
import { GithubIcon, NewTwitterIcon } from "hugeicons-react";

interface FooterProps {
  brandName?: string;
}

export function Footer({ brandName = "Screenshot Studio" }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="px-6 pb-6">
      <div className="max-w-7xl mx-auto bg-card rounded-2xl py-12 px-8">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-10">
          {/* Brand */}
          <div>
            <Link href="/landing" className="flex items-center gap-2 mb-4">
              <Image
                src="/favicon.svg"
                alt={brandName}
                width={28}
                height={28}
                className="h-7 w-7"
              />
              <span className="font-semibold text-foreground">{brandName}</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              The free browser-based screenshot editor. Beautify images with
              backgrounds, frames, 3D effects, and animations.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">
              Product
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Editor
                </Link>
              </li>
              <li>
                <Link
                  href="/features"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/free-screenshot-editor"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Free Screenshot Editor
                </Link>
              </li>
              <li>
                <Link
                  href="/changelog"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Changelog
                </Link>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">
              Features
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/features/screenshot-beautifier"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Screenshot Beautifier
                </Link>
              </li>
              <li>
                <Link
                  href="/features/social-media-graphics"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Social Media Graphics
                </Link>
              </li>
              <li>
                <Link
                  href="/features/animation-maker"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Animation Maker
                </Link>
              </li>
              <li>
                <Link
                  href="/features/3d-effects"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  3D Effects
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">
              Company
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="https://github.com/KartikLabhshetwar/stage"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                >
                  <GithubIcon className="w-4 h-4" />
                  GitHub
                </Link>
              </li>
              <li>
                <Link
                  href="https://x.com/code_kartik"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                >
                  <NewTwitterIcon className="w-4 h-4" />
                  Twitter / X
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t border-border/40 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            © {currentYear} {brandName}
          </p>
          <a
            href="https://peerlist.io/code_kartik/project/screenshot-studio"
            target="_blank"
            rel="noreferrer"
          >
            <img
              src="https://dqy38fnwh4fqs.cloudfront.net/website/project-spotlight/project-week-rank-one-dark.svg"
              alt="Peerlist Project Spotlight - Rank 1"
              className="h-10"
            />
          </a>
        </div>
      </div>
    </footer>
  );
}
