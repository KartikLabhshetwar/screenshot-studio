"use client";

import Link from "next/link";
import { Instrument_Serif } from "next/font/google";

const instrumentSerif = Instrument_Serif({
  weight: ["400"],
  subsets: ["latin"],
});

interface BackerItem {
  name: string;
  badge: string;
  description: string;
  logo: React.ReactNode;
  url: string;
}

const backers: BackerItem[] = [
  {
    name: "Vercel",
    badge: "Open Source Program",
    description:
      "Vercel is a platform for building modern web applications. It provides a seamless development experience with a focus on performance and scalability. Vercel provides the developer tools and cloud infrastructure to build, scale, and secure a faster, more personalized web.",
    logo: (
      <svg
        viewBox="0 0 256 222"
        className="h-12 sm:h-16 w-auto"
        fill="currentColor"
        aria-label="Vercel logo"
      >
        <path d="M128 0L256 221.705H0L128 0Z" />
      </svg>
    ),
    url: "https://vercel.com/oss",
  },
];

export function BackedBy() {
  return (
    <section className="w-full py-16 sm:py-24 px-4 sm:px-6">
      <div className="container mx-auto max-w-6xl">
        <h2
          className={`text-3xl sm:text-4xl md:text-5xl font-normal text-center mb-12 sm:mb-16 ${instrumentSerif.className}`}
        >
          Backed By
        </h2>

        <div className="flex flex-col gap-6">
          {backers.map((backer, index) => (
            <Link
              key={backer.name}
              href={backer.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
            >
              <div className="rounded-2xl border border-border/50 bg-background/50 backdrop-blur-sm hover:border-border transition-all duration-300 overflow-hidden">
                <div
                  className={`grid grid-cols-1 md:grid-cols-2 gap-0 ${
                    index % 2 === 1 ? "md:[direction:rtl]" : ""
                  }`}
                >
                  {/* Logo side */}
                  <div className="flex items-center justify-center p-8 sm:p-12 md:p-16 border-b md:border-b-0 md:border-r border-border/30">
                    <div
                      className={`text-foreground/90 group-hover:text-foreground transition-colors ${
                        index % 2 === 1 ? "md:[direction:ltr]" : ""
                      }`}
                    >
                      {backer.logo}
                    </div>
                  </div>

                  {/* Content side */}
                  <div
                    className={`p-8 sm:p-10 md:p-12 flex flex-col justify-center ${
                      index % 2 === 1 ? "md:[direction:ltr]" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <h3 className="text-xl sm:text-2xl font-semibold text-foreground">
                        {backer.name}
                      </h3>
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-foreground/10 text-foreground/70 border border-border/50">
                        {backer.badge}
                      </span>
                    </div>
                    <p className="text-sm sm:text-base text-foreground/60 leading-relaxed">
                      {backer.description}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}

          {/* "Your Company Here" CTA */}
          <div className="rounded-2xl border border-dashed border-border/40 bg-background/30 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              {/* Content side */}
              <div className="p-8 sm:p-10 md:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-xl sm:text-2xl font-semibold text-foreground">
                    Your Company Here
                  </h3>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-brand/10 text-brand border border-brand/20">
                    Free Sponsor
                  </span>
                </div>
                <p className="text-sm sm:text-base text-foreground/60 leading-relaxed mb-6">
                  Screenshot Studio is free for everyone — forever. If you&apos;d like
                  to sponsor us with a service that benefits our platform and
                  users, we&apos;d love to hear from you.
                </p>
                <div>
                  <Link
                    href="https://x.com/code_kartik"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border bg-background hover:bg-foreground/5 text-sm font-medium text-foreground transition-colors"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>

              {/* Placeholder side */}
              <div className="hidden md:flex items-center justify-center p-8 sm:p-12 md:p-16 border-t md:border-t-0 md:border-l border-border/30">
                <div className="w-full h-full min-h-[120px] rounded-xl border border-dashed border-border/30 flex items-center justify-center">
                  <span className="text-sm text-foreground/30 font-medium">
                    Your Image Here
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
