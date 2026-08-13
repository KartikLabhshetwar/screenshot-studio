import { Metadata } from "next";
import Link from "next/link";
import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for Screenshot Studio. Learn how we handle your data. Spoiler: everything stays in your browser.",
  alternates: {
    canonical: "/privacy-policy",
  },
};

const linkClassName =
  "text-foreground underline decoration-foreground/30 underline-offset-4 transition-colors hover:decoration-foreground/60";

const INTER =
  "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

export default function PrivacyPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navigation />

      <main className="mx-auto max-w-3xl flex-1 px-6 pb-16 pt-28 sm:pb-24">
        <h1
          className="mb-2 text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-4xl"
          style={{ fontFamily: INTER }}
        >
          Privacy Policy
        </h1>
        <p className="mb-12 text-sm text-muted-foreground">
          Last updated: June 2, 2026
        </p>

        <div className="max-w-none space-y-8">
          <section>
            <h2
              className="mb-3 text-xl font-semibold tracking-[-0.02em] text-foreground"
              style={{ fontFamily: INTER }}
            >
              Overview
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              Screenshot Studio is a browser-based image editor. Your images and
              edits are processed entirely in your browser. We do not upload,
              store, or have access to any images you edit.
            </p>
          </section>

          <section>
            <h2
              className="mb-3 text-xl font-semibold tracking-[-0.02em] text-foreground"
              style={{ fontFamily: INTER }}
            >
              Information We Collect
            </h2>
            <p className="mb-3 leading-relaxed text-muted-foreground">
              We collect minimal information to improve the service:
            </p>
            <ul className="list-inside list-disc space-y-2 text-muted-foreground">
              <li>
                <strong className="text-foreground">Analytics data:</strong> Page
                views, feature usage patterns, and general interaction data via
                privacy-respecting analytics.
              </li>
              <li>
                <strong className="text-foreground">Feedback:</strong> If you
                voluntarily submit feedback through our widget, we collect the
                message content and optionally your email.
              </li>
              <li>
                <strong className="text-foreground">Technical data:</strong> Browser
                type, screen resolution, and operating system for compatibility
                improvements.
              </li>
            </ul>
          </section>

          <section>
            <h2
              className="mb-3 text-xl font-semibold tracking-[-0.02em] text-foreground"
              style={{ fontFamily: INTER }}
            >
              What We Do NOT Collect
            </h2>
            <ul className="list-inside list-disc space-y-2 text-muted-foreground">
              <li>Your screenshots or images (they never leave your device)</li>
              <li>Personal identification information (no signup required)</li>
              <li>Cookies for advertising or tracking</li>
              <li>Data shared with third-party advertisers</li>
            </ul>
          </section>

          <section>
            <h2
              className="mb-3 text-xl font-semibold tracking-[-0.02em] text-foreground"
              style={{ fontFamily: INTER }}
            >
              Local Storage
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              We use browser local storage to save your editor preferences
              (aspect ratio, export settings, etc.) so your workflow is
              preserved between sessions. This data stays on your device and can
              be cleared at any time through your browser settings.
            </p>
          </section>

          <section>
            <h2
              className="mb-3 text-xl font-semibold tracking-[-0.02em] text-foreground"
              style={{ fontFamily: INTER }}
            >
              Third-Party Services
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              We may use privacy-focused analytics (such as Vercel Analytics) to
              understand how the tool is used. These services do not track
              individual users across websites and comply with GDPR.
            </p>
          </section>

          <section>
            <h2
              className="mb-3 text-xl font-semibold tracking-[-0.02em] text-foreground"
              style={{ fontFamily: INTER }}
            >
              Open Source
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              Screenshot Studio is open source. You can inspect exactly what
              data is collected by reviewing our{" "}
              <Link
                href="https://github.com/KartikLabhshetwar/stage"
                target="_blank"
                rel="noopener noreferrer"
                className={linkClassName}
              >
                source code on GitHub
              </Link>
              .
            </p>
          </section>

          <section>
            <h2
              className="mb-3 text-xl font-semibold tracking-[-0.02em] text-foreground"
              style={{ fontFamily: INTER }}
            >
              Changes
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              We may update this policy from time to time. Changes will be
              reflected on this page with an updated date.
            </p>
          </section>

          <section>
            <h2
              className="mb-3 text-xl font-semibold tracking-[-0.02em] text-foreground"
              style={{ fontFamily: INTER }}
            >
              Contact
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              If you have questions about this policy, reach out via our{" "}
              <Link href="/contact" className={linkClassName}>
                contact page
              </Link>
              .
            </p>
          </section>
        </div>
      </main>

      <Footer brandName="Screenshot Studio" />
    </div>
  );
}
