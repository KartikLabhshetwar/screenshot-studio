import { Metadata } from "next";
import Link from "next/link";
import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Terms and Conditions for using Screenshot Studio — the free, open-source screenshot beautifier.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation ctaLabel="Open Editor" ctaHref="/" />

      <main className="flex-1 max-w-3xl mx-auto px-6 py-16 sm:py-24">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
          Terms & Conditions
        </h1>
        <p className="text-sm text-muted-foreground mb-12">
          Last updated: June 2, 2026
        </p>

        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-3">
              1. Acceptance of Terms
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing and using Screenshot Studio ("the Service"), you agree
              to be bound by these Terms and Conditions. If you do not agree to
              these terms, please do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">
              2. Description of Service
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Screenshot Studio is a free, browser-based screenshot editing tool
              that allows users to beautify screenshots with backgrounds, frames,
              effects, and more. The tool processes images entirely within your
              browser — no images are uploaded to our servers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. Use of Service</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              You agree to use the Service only for lawful purposes. You may not:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Use the Service to create or distribute harmful content</li>
              <li>
                Attempt to interfere with the Service&apos;s operation or
                security
              </li>
              <li>
                Reverse-engineer the Service beyond what the open-source license
                permits
              </li>
              <li>
                Use the Service in any way that violates applicable laws or
                regulations
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">
              4. Intellectual Property
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              The images you create with Screenshot Studio belong to you. We
              claim no ownership or rights over content you produce using the
              tool. The Screenshot Studio software itself is open source and
              licensed under the terms specified in our{" "}
              <Link
                href="https://github.com/KartikLabhshetwar/stage"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                GitHub repository
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">
              5. Disclaimer of Warranties
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              The Service is provided &quot;as is&quot; and &quot;as
              available&quot; without warranties of any kind, either express or
              implied. We do not guarantee that the Service will be
              uninterrupted, error-free, or free of harmful components.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">
              6. Limitation of Liability
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              In no event shall Screenshot Studio or its creator be liable for
              any indirect, incidental, special, consequential, or punitive
              damages arising out of or related to your use of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">7. Changes to Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to modify these terms at any time. Changes
              will be posted on this page with an updated date. Continued use of
              the Service after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">8. Contact</h2>
            <p className="text-muted-foreground leading-relaxed">
              For questions about these terms, please visit our{" "}
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
