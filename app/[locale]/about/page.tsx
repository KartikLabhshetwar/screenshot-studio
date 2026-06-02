import { Metadata } from "next";
import Link from "next/link";
import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "About Screenshot Studio — the free, open-source browser tool that transforms plain screenshots into professional graphics.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation ctaLabel="Open Editor" ctaHref="/" />

      <main className="flex-1 max-w-3xl mx-auto px-6 py-16 sm:py-24">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6">
          About Screenshot Studio
        </h1>

        <div className="space-y-8">
          <section>
            <p className="text-muted-foreground leading-relaxed text-lg">
              Screenshot Studio is a free, open-source screenshot editor built
              for developers, designers, and marketers who want their images to
              look professional — without paying for expensive tools or signing
              up for yet another account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Why We Built This</h2>
            <p className="text-muted-foreground leading-relaxed">
              Every time you share a screenshot on social media, in
              documentation, or on a landing page, presentation matters. But
              existing tools either cost too much, require signups, add
              watermarks, or upload your images to their servers. We wanted
              something better — a tool that runs entirely in your browser,
              respects your privacy, and is completely free to use.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">What We Offer</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-card border border-border">
                <p className="font-medium text-foreground mb-1">
                  100+ Backgrounds
                </p>
                <p className="text-sm text-muted-foreground">
                  Gradient backgrounds, solid colors, and patterns to make your
                  screenshots pop.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-card border border-border">
                <p className="font-medium text-foreground mb-1">
                  Browser Mockups
                </p>
                <p className="text-sm text-muted-foreground">
                  Safari and Chrome browser frames for realistic app previews.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-card border border-border">
                <p className="font-medium text-foreground mb-1">
                  3D Effects & Animations
                </p>
                <p className="text-sm text-muted-foreground">
                  Perspective transforms, shadows, and animation timelines with
                  video export.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-card border border-border">
                <p className="font-medium text-foreground mb-1">
                  Tweet & Code Import
                </p>
                <p className="text-sm text-muted-foreground">
                  Turn tweets and code snippets into beautiful shareable images.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Open Source</h2>
            <p className="text-muted-foreground leading-relaxed">
              Screenshot Studio is fully open source. You can view, contribute
              to, or fork the project on{" "}
              <Link
                href="https://github.com/KartikLabhshetwar/stage"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                GitHub
              </Link>
              . We believe the best tools are built in the open.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Built By</h2>
            <p className="text-muted-foreground leading-relaxed">
              Created and maintained by{" "}
              <Link
                href="https://x.com/code_kartik"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
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
