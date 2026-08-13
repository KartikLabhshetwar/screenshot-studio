import { Metadata } from "next";
import Link from "next/link";
import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "About Screenshot Studio, the free, open-source browser tool that transforms plain screenshots into professional graphics.",
  alternates: {
    canonical: "/about",
  },
};

const cardSurface =
  "rounded-2xl bg-card p-4 ring-1 ring-inset ring-border shadow-[var(--card-highlight-shadow)]";

const linkClassName =
  "text-foreground underline decoration-foreground/30 underline-offset-4 transition-colors hover:decoration-foreground/60";

const INTER =
  "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

const offerings = [
  {
    title: "100+ Backgrounds",
    description:
      "Gradient backgrounds, solid colors, and patterns to make your screenshots pop.",
  },
  {
    title: "Browser Mockups",
    description:
      "Safari and Chrome browser frames for realistic app previews.",
  },
  {
    title: "3D Effects & Animations",
    description:
      "Perspective transforms, shadows, and animation timelines with video export.",
  },
  {
    title: "Tweet & Code Import",
    description:
      "Turn tweets and code snippets into beautiful shareable images.",
  },
];

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navigation />

      <main className="mx-auto max-w-3xl flex-1 px-6 pb-16 pt-28 sm:pb-24">
        <h1
          className="mb-6 text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-4xl"
          style={{ fontFamily: INTER }}
        >
          About Screenshot Studio
        </h1>

        <div className="space-y-8">
          <section>
            <p className="text-lg leading-relaxed text-muted-foreground">
              Screenshot Studio is a free, open-source screenshot editor built
              for developers, designers, and marketers who want their images to
              look professional, without paying for expensive tools or signing
              up for yet another account.
            </p>
          </section>

          <section>
            <h2
              className="mb-3 text-xl font-semibold tracking-[-0.02em] text-foreground"
              style={{ fontFamily: INTER }}
            >
              Why We Built This
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              Every time you share a screenshot on social media, in
              documentation, or on a landing page, presentation matters. But
              existing tools either cost too much, require signups, add
              watermarks, or upload your images to their servers. We wanted
              something better: a tool that runs entirely in your browser,
              respects your privacy, and is completely free to use.
            </p>
          </section>

          <section>
            <h2
              className="mb-3 text-xl font-semibold tracking-[-0.02em] text-foreground"
              style={{ fontFamily: INTER }}
            >
              What We Offer
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {offerings.map((item) => (
                <div key={item.title} className={cardSurface}>
                  <p className="mb-1 font-medium text-foreground">
                    {item.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2
              className="mb-3 text-xl font-semibold tracking-[-0.02em] text-foreground"
              style={{ fontFamily: INTER }}
            >
              Open Source
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              Screenshot Studio is fully open source. You can view, contribute
              to, or fork the project on{" "}
              <Link
                href="https://github.com/KartikLabhshetwar/stage"
                target="_blank"
                rel="noopener noreferrer"
                className={linkClassName}
              >
                GitHub
              </Link>
              . We believe the best tools are built in the open.
            </p>
          </section>

          <section>
            <h2
              className="mb-3 text-xl font-semibold tracking-[-0.02em] text-foreground"
              style={{ fontFamily: INTER }}
            >
              Built By
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              Created and maintained by{" "}
              <Link
                href="https://x.com/code_kartik"
                target="_blank"
                rel="noopener noreferrer"
                className={linkClassName}
              >
                Kartik Labhshetwar
              </Link>
              . If you find Screenshot Studio useful, consider starring the repo
              or sharing it with others.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
