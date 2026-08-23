import Link from "next/link";
import { Metadata } from "next";
import { GoBackButton } from "@/components/landing/GoBackButton";

const RECOVERY_LINKS = [
  { href: "/features", label: "Features" },
  { href: "/docs", label: "API docs" },
  { href: "/developers", label: "Developers" },
  { href: "/sitemap.xml", label: "Sitemap" },
  { href: "/llms.txt", label: "llms.txt" },
];

export const metadata: Metadata = {
  title: "404. Page not found | Screenshot Studio",
  description:
    "This page does not exist. Go back, or open the Screenshot Studio editor.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-6">
      <main className="relative z-10 mx-auto flex w-full max-w-lg flex-col items-center text-center">
        <p
          className="landing-heading text-[72px] leading-none font-semibold tracking-[-0.04em] sm:text-[96px]"
          style={{
            fontFamily:
              'Inter, "Inter Fallback", Arial, Helvetica, sans-serif',
          }}
        >
          404
        </p>

        <h1
          className="mt-5 text-[22px] font-semibold tracking-[-0.03em] text-foreground sm:text-[28px]"
          style={{
            fontFamily:
              'Inter, "Inter Fallback", Arial, Helvetica, sans-serif',
          }}
        >
          Page not found
        </h1>

        <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-muted-foreground md:text-base">
          This page does not exist or was moved. Go back, or open the editor to
          keep creating.
        </p>

        <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <GoBackButton />
          <Link
            href="/"
            className="inline-flex h-10 items-center justify-center rounded-md bg-[var(--nav-cta-bg)] px-5 text-sm font-medium text-[var(--nav-cta-fg)] shadow-sm transition-[transform,box-shadow] duration-150 ease-out [text-shadow:var(--nav-cta-text-shadow)] hover:shadow-[var(--nav-cta-hover-shadow)] active:scale-[0.98]"
          >
            Open editor
          </Link>
        </div>

        <nav
          aria-label="Other pages"
          className="mt-10 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-muted-foreground"
        >
          {RECOVERY_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="underline decoration-muted-foreground/40 underline-offset-4 transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </main>
    </div>
  );
}
