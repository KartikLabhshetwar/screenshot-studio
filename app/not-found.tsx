import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 — Page Not Found | Screenshot Studio",
  description:
    "The page you're looking for doesn't exist. Head back to Screenshot Studio to create stunning visuals.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-background relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-primary/3 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-xl w-full text-center space-y-8">
        <div className="relative inline-block">
          <div className="w-48 h-32 mx-auto rounded-xl border-2 border-dashed border-border relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                className="text-muted-foreground/40"
              >
                <path
                  d="M21 15V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10m18 0l-4.5-4.5a2 2 0 00-2.83 0L3 17m18-2v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="8.5"
                  cy="8.5"
                  r="1.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
            </div>
            <div className="absolute -top-px -left-px w-3 h-3 border-t-2 border-l-2 border-primary rounded-tl-lg" />
            <div className="absolute -top-px -right-px w-3 h-3 border-t-2 border-r-2 border-primary rounded-tr-lg" />
            <div className="absolute -bottom-px -left-px w-3 h-3 border-b-2 border-l-2 border-primary rounded-bl-lg" />
            <div className="absolute -bottom-px -right-px w-3 h-3 border-b-2 border-r-2 border-primary rounded-br-lg" />
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-8xl font-bold tracking-tighter text-foreground">
            4<span className="text-primary">0</span>4
          </p>
          <h1 className="text-xl font-medium text-foreground">
            This page is off-canvas
          </h1>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved. Let&apos;s get you back to creating.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Open Editor
          </Link>
          <Link
            href="/landing"
            className="px-6 py-2.5 rounded-lg border border-border text-foreground text-sm hover:bg-muted transition-colors"
          >
            Homepage
          </Link>
        </div>

        <div className="pt-6 border-t border-border">
          <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">
            Popular pages
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { href: "/free-screenshot-editor", label: "Free Editor" },
              {
                href: "/features/screenshot-beautifier",
                label: "Beautifier",
              },
              {
                href: "/features/animation-maker",
                label: "Animations",
              },
              { href: "/features/3d-effects", label: "3D Effects" },
              { href: "/features", label: "All Features" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs px-3 py-1.5 rounded-md border border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
