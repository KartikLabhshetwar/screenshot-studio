import Link from "next/link";
import Image from "next/image";
import { NewTwitterIcon } from "hugeicons-react";
import { GitHubIcon } from "@/components/ui/github-star-button";

interface FooterProps {
  brandName?: string;
}

const GITHUB_URL = "https://github.com/KartikLabhshetwar/screenshot-studio";
const X_URL = "https://x.com/code_kartik";
const PEERLIST_URL =
  "https://peerlist.io/code_kartik/project/screenshot-studio";
const PEERLIST_BADGE =
  "https://dqy38fnwh4fqs.cloudfront.net/website/project-spotlight/project-week-rank-one-dark.svg";

const navCol1 = [
  { href: "/", label: "Editor" },
  { href: "/features", label: "Features" },
  { href: "/changelog", label: "Changelog" },
  { href: "/free-screenshot-editor", label: "Free editor" },
] as const;

const navCol2 = [
  { href: "/features/3d-effects", label: "3D effects" },
  { href: "/features/animation-maker", label: "Animations" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

function FooterNavLink({
  href,
  label,
}: {
  href: string;
  label: string;
}): React.JSX.Element {
  return (
    <Link
      href={href}
      className="flex w-full flex-1 items-center rounded-md bg-foreground/[0.04] px-4 py-3 text-sm text-foreground/90 ring-1 ring-border transition-colors duration-150 hover:bg-foreground/[0.08] hover:text-foreground"
    >
      {label}
    </Link>
  );
}

export function Footer({ brandName = "Screenshot Studio" }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background px-6 pb-8 pt-4 sm:pb-10">
      <div className="mx-auto max-w-6xl rounded-2xl bg-card px-6 py-12 ring-1 ring-border shadow-[var(--card-edge-shadow)] sm:px-8 sm:py-14">
        <div className="grid grid-cols-1 items-stretch gap-10 md:grid-cols-2 md:gap-12 lg:gap-16">
          <div className="flex h-full flex-col gap-6">
            <Link
              href="/landing"
              className="inline-flex w-fit items-center gap-2.5"
            >
              <Image
                src="/logo-mark.png"
                alt=""
                width={40}
                height={40}
                className="h-10 w-10"
              />
              <span className="text-base font-semibold tracking-tight text-foreground">
                {brandName}
              </span>
            </Link>
            <p
              className="max-w-xs text-[22px] font-semibold leading-[1.2] tracking-[-0.03em] text-foreground sm:text-[26px] sm:leading-[1.15]"
              style={{
                fontFamily:
                  'Inter, "Inter Fallback", Arial, Helvetica, sans-serif',
              }}
            >
              Free and open source.
              <br />
              Screenshot mockups
              <br />
              you can ship.
            </p>
            <a
              href={PEERLIST_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-auto inline-flex w-fit opacity-90 transition-opacity duration-150 hover:opacity-100"
            >
              <img
                src={PEERLIST_BADGE}
                alt="Peerlist Project Spotlight. Rank 1"
                className="h-10 w-auto"
              />
            </a>
          </div>

          <div className="grid h-full w-full grid-cols-2 gap-2 md:max-w-md md:justify-self-end">
            <div className="flex h-full flex-col gap-2">
              {navCol1.map((item) => (
                <FooterNavLink key={item.href} {...item} />
              ))}
            </div>
            <div className="flex h-full flex-col gap-2">
              {navCol2.map((item) => (
                <FooterNavLink key={item.href} {...item} />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="inline-flex size-10 items-center justify-center rounded-md bg-foreground/[0.04] text-foreground/90 ring-1 ring-border transition-colors duration-150 hover:bg-foreground/[0.08] hover:text-foreground"
            >
              <GitHubIcon className="size-[18px]" />
            </a>
            <a
              href={X_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X"
              className="inline-flex size-10 items-center justify-center rounded-md bg-foreground/[0.04] text-foreground/90 ring-1 ring-border transition-colors duration-150 hover:bg-foreground/[0.08] hover:text-foreground"
            >
              <NewTwitterIcon className="size-4" />
            </a>
            <Link
              href="/privacy-policy"
              className="inline-flex h-10 items-center rounded-md bg-foreground/[0.04] px-3 text-sm text-foreground/90 ring-1 ring-border transition-colors duration-150 hover:bg-foreground/[0.08] hover:text-foreground"
            >
              Privacy policy
            </Link>
            <Link
              href="/terms"
              className="inline-flex h-10 items-center rounded-md bg-foreground/[0.04] px-3 text-sm text-foreground/90 ring-1 ring-border transition-colors duration-150 hover:bg-foreground/[0.08] hover:text-foreground"
            >
              Terms of service
            </Link>
          </div>

          <p className="text-xs text-muted-foreground/70">
            © {currentYear} {brandName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
