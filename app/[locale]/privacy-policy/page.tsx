import { Metadata } from "next";
import Link from "next/link";
import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for Screenshot Studio. Learn how we handle your data — spoiler: everything stays in your browser.",
  alternates: {
    canonical: "/privacy-policy",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation ctaLabel="Open Editor" ctaHref="/" />

      <main className="flex-1 max-w-3xl mx-auto px-6 py-16 sm:py-24">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
          Privacy Policy
        </h1>
        <p className="text-sm text-muted-foreground mb-12">
          Last updated: June 2, 2026
        </p>

        <div className="prose prose-invert prose-sm max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-3">Overview</h2>
            <p className="text-muted-foreground leading-relaxed">
              Screenshot Studio is a browser-based image editor. Your images and
              edits are processed entirely in your browser — we do not upload,
              store, or have access to any images you edit.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">
              Information We Collect
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              We collect minimal information to improve the service:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>
                <strong className="text-foreground">Analytics data:</strong>{" "}
                Page views, feature usage patterns, and general interaction data
                via privacy-respecting analytics.
              </li>
              <li>
                <strong className="text-foreground">Feedback:</strong> If you
                voluntarily submit feedback through our widget, we collect the
                message content and optionally your email.
              </li>
              <li>
                <strong className="text-foreground">Technical data:</strong>{" "}
                Browser type, screen resolution, and operating system for
                compatibility improvements.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">
              What We Do NOT Collect
            </h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Your screenshots or images (they never leave your device)</li>
              <li>Personal identification information (no signup required)</li>
              <li>Cookies for advertising or tracking</li>
              <li>Data shared with third-party advertisers</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Local Storage</h2>
            <p className="text-muted-foreground leading-relaxed">
              We use browser local storage to save your editor preferences
              (aspect ratio, export settings, etc.) so your workflow is
              preserved between sessions. This data stays on your device and
              can be cleared at any time through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Third-Party Services</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may use privacy-focused analytics (such as Vercel Analytics) to
              understand how the tool is used. These services do not track
              individual users across websites and comply with GDPR.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Open Source</h2>
            <p className="text-muted-foreground leading-relaxed">
              Screenshot Studio is open source. You can inspect exactly what data
              is collected by reviewing our{" "}
              <Link
                href="https://github.com/KartikLabhshetwar/stage"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                source code on GitHub
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Changes</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this policy from time to time. Changes will be
              reflected on this page with an updated date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Contact</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have questions about this policy, reach out via our{" "}
              <Link href="/contact" className="text-primary hover:underline">
                contact page
              </Link>
              .
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
